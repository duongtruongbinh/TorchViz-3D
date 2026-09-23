"""Run with the same environment as the downloadable ML labs."""
import contextlib
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "ml_labs", ROOT / "public/learning/fundamentals/labs/ml_labs.py",
)
labs = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(labs)


class MachineLearningLabsTest(unittest.TestCase):
    def setUp(self):
        self.output = io.StringIO()
        self.redirect = contextlib.redirect_stdout(self.output)
        self.redirect.__enter__()

    def tearDown(self):
        self.redirect.__exit__(None, None, None)

    def test_dataset_contract_and_fold_isolation(self):
        data = labs.housing()
        pd.testing.assert_frame_equal(data, labs.housing())
        train_ids, test_ids = labs.partitions()
        self.assertEqual((len(train_ids), len(test_ids)), (480, 120))
        self.assertFalse(set(train_ids) & set(test_ids))
        self.assertEqual(set(labs.development().index), set(train_ids))
        self.assertTrue(data[labs.FEATURES].isna().any().all())
        X, y = labs.classification_data(labs.development())
        self.assertEqual(set(X.columns), set(labs.FEATURES))
        self.assertNotIn(labs.TARGET, X)
        self.assertNotIn(labs.LEAK, X)
        self.assertEqual(set(y), {0, 1})
        for fit_ids, val_ids in labs.classification_folds(X, y):
            self.assertFalse(set(fit_ids) & set(val_ids))
            pre = labs.preprocessor().fit(X.iloc[fit_ids])
            np.testing.assert_allclose(
                pre.named_transformers_["numeric"]["impute"].statistics_,
                X.iloc[fit_ids][labs.NUMERIC].median().to_numpy(),
            )
            transformed = pre.transform(X.iloc[val_ids])
            self.assertTrue(np.isfinite(transformed).all())

    def test_leakage_and_regression(self):
        result = labs.leakage_lab()
        self.assertLess(result["leaky"].mean(), result["safe"].mean())
        beta = labs.regression_lab()
        self.assertEqual(beta.shape, (2,))

    def test_classification_and_comparison(self):
        model = labs.classification_lab()
        self.assertEqual(len(model["preprocess"].get_feature_names_out()), 8)
        result = labs.comparison_lab()
        self.assertEqual(set(result), {"logistic", "forest", "boosting"})
        for scores in result.values():
            self.assertEqual(scores.shape, (4,))
            self.assertTrue(((0 <= scores) & (scores <= 1)).all())

    def test_clustering_uses_no_target(self):
        original = labs.development
        # Even nonsensical targets cannot change a feature-only clustering result.
        data = original()
        data[labs.TARGET] = np.nan
        data[labs.LEAK] = np.nan
        with patch.object(labs, "development", return_value=data):
            result = labs.clustering_lab()
        self.assertEqual(result["k"].tolist(), [2, 3, 4, 5])
        self.assertTrue(result["silhouette"].between(-1, 1).all())

    def test_nested_default_never_passes_holdout_to_classifier(self):
        original = labs.classification_data
        train_ids, _ = labs.partitions()
        seen = []
        def development_only(frame):
            self.assertTrue(set(frame.index).issubset(set(train_ids)))
            seen.append(len(frame))
            return original(frame)
        with patch.object(labs, "classification_data", side_effect=development_only):
            result = labs.nested_lab()
        self.assertEqual(len(result), 3)
        self.assertEqual(seen, [480])
        self.assertIn("Test remains unopened", self.output.getvalue())

    def test_final_holdout_and_roundtrip(self):
        original = labs.classification_data
        seen = []
        def record(frame):
            seen.append(set(frame.index))
            return original(frame)
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / "pipeline.joblib"
            with patch.object(labs, "classification_data", side_effect=record):
                labs.nested_lab(evaluate_test=True, artifact=artifact)
            self.assertTrue(artifact.exists())
            restored = labs.joblib.load(artifact)
            self.assertEqual(restored["features"], labs.FEATURES)
            self.assertEqual(restored["decision_threshold"], 0.5)
        train_ids, test_ids = labs.partitions()
        self.assertEqual(seen, [set(train_ids), set(test_ids)])
        self.assertIn("FINAL test AP:", self.output.getvalue())


if __name__ == "__main__":
    unittest.main()
