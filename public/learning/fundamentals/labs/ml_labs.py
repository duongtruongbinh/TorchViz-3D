"""Offline housing teaching labs. Python 3.11+, see requirements.txt."""
import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    adjusted_rand_score, average_precision_score, f1_score,
    mean_absolute_error, roc_auc_score, silhouette_score,
)
from sklearn.model_selection import (
    GridSearchCV, KFold, StratifiedKFold, cross_validate, train_test_split,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

SEED = 42
NUMERIC = ["area", "age", "distance"]
CATEGORICAL = ["district", "type"]
FEATURES = NUMERIC + CATEGORICAL
TARGET = "price"
LEAK = "post_sale_tax"
PRICE_THRESHOLD = 3.5  # Billions of VND; fixed teaching business rule, not a quantile.


def housing():
    """600 independent synthetic homes; not a real market benchmark."""
    rng = np.random.default_rng(SEED)
    n = 600
    area = rng.uniform(35, 160, n)
    age = rng.integers(0, 40, n).astype(float)
    distance = rng.uniform(1, 30, n)
    district = rng.choice(["central", "outer", "suburb"], n)
    kind = rng.choice(["apartment", "house"], n)
    price = (1.0 + 0.035 * area - 0.012 * age - 0.025 * distance
             + 0.65 * (district == "central") + 0.3 * (kind == "house")
             + 0.35 * (area > 100) * (kind == "house") + rng.normal(0, 0.4, n))
    frame = pd.DataFrame({
        "area": area, "age": age, "distance": distance,
        "district": district, "type": kind, TARGET: price,
        LEAK: 0.02 * price,
    })
    frame.index.name = "home_id"
    for column in FEATURES:
        frame.loc[rng.random(n) < 0.05, column] = np.nan
    return frame


def partitions():
    ids = np.arange(600)
    return train_test_split(ids, test_size=0.2, random_state=SEED)


def development():
    train_ids, _ = partitions()
    return housing().loc[train_ids].copy()


def classification_data(frame):
    return frame[FEATURES], (frame[TARGET] >= PRICE_THRESHOLD).astype(int)


def preprocessor():
    numeric = Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale", StandardScaler()),
    ])
    categorical = Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("encode", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    return ColumnTransformer([
        ("numeric", numeric, NUMERIC),
        ("categorical", categorical, CATEGORICAL),
    ], remainder="drop")


def pipeline(model):
    return Pipeline([("preprocess", preprocessor()), ("model", model)])


def classification_folds(X, y):
    return list(StratifiedKFold(4, shuffle=True, random_state=SEED).split(X, y))


def leakage_lab():
    data = development()
    folds = list(KFold(4, shuffle=True, random_state=SEED).split(data))
    safe = pipeline(LinearRegression())
    # Intentionally invalid predictor, known only AFTER the sale.
    leaky = Pipeline([("model", LinearRegression())])
    results = {}
    for name, model, columns in [
        ("safe", safe, FEATURES),
        ("leaky", leaky, [LEAK]),
    ]:
        scores = cross_validate(
            model, data[columns], data[TARGET], cv=folds,
            scoring="neg_mean_absolute_error", error_score="raise",
        )
        results[name] = -scores["test_score"]
        print(name, "MAE per fold:", results[name].round(6))
    assert results["leaky"].mean() < 1e-10
    assert results["safe"].mean() > 0.05
    print("Remove post_sale_tax based on availability, not score.")
    return results


def regression_lab():
    data = development()
    train, validation = train_test_split(data, test_size=0.25, random_state=SEED)
    imputer = SimpleImputer(strategy="median")
    x = imputer.fit_transform(train[["area"]])
    xv = imputer.transform(validation[["area"]])
    design = np.column_stack([np.ones(len(x)), x])
    design_v = np.column_stack([np.ones(len(xv)), xv])
    # lstsq avoids explicitly inverting X.T @ X.
    beta, *_ = np.linalg.lstsq(design, train[TARGET].to_numpy(), rcond=None)
    manual_prediction = design_v @ beta
    simple = Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("model", LinearRegression()),
    ]).fit(train[["area"]], train[TARGET])
    sklearn_prediction = simple.predict(validation[["area"]])
    np.testing.assert_allclose(manual_prediction, sklearn_prediction, atol=1e-10)
    full = pipeline(LinearRegression()).fit(train[FEATURES], train[TARGET])
    print("Intercept and area coefficient:", beta.round(4))
    print("Area-only validation MAE:", mean_absolute_error(validation[TARGET], sklearn_prediction))
    print("Mixed-feature validation MAE:", mean_absolute_error(
        validation[TARGET], full.predict(validation[FEATURES])))
    return beta


def classification_lab():
    X, y = classification_data(development())
    train_ids, val_ids = train_test_split(
        np.arange(len(X)), test_size=0.25, random_state=SEED, stratify=y,
    )
    model = pipeline(LogisticRegression(max_iter=1000))
    model.fit(X.iloc[train_ids], y.iloc[train_ids])
    probability = model.predict_proba(X.iloc[val_ids])[:, 1]
    print("Validation ROC-AUC:", roc_auc_score(y.iloc[val_ids], probability))
    print("Validation AP:", average_precision_score(y.iloc[val_ids], probability))
    print("Validation F1 at 0.5:", f1_score(y.iloc[val_ids], probability >= 0.5))
    new_home = X.iloc[[val_ids[0]]].copy()
    new_home["district"] = "new_district"
    assert np.isfinite(model.predict_proba(new_home)).all()
    print("Encoded columns:", model["preprocess"].get_feature_names_out())
    return model


def comparison_lab():
    X, y = classification_data(development())
    folds = classification_folds(X, y)
    candidates = {
        "logistic": LogisticRegression(max_iter=1000),
        "forest": RandomForestClassifier(n_estimators=60, max_depth=6, random_state=SEED),
        "boosting": GradientBoostingClassifier(n_estimators=60, max_depth=2, random_state=SEED),
    }
    results = {}
    for name, estimator in candidates.items():
        scores = cross_validate(
            pipeline(estimator), X, y, cv=folds,
            scoring={"ap": "average_precision", "auc": "roc_auc", "f1": "f1"},
            error_score="raise",
        )
        results[name] = scores["test_ap"]
        print(name, {
            metric: (round(scores["test_" + metric].mean(), 4),
                     round(scores["test_" + metric].std(ddof=1), 4))
            for metric in ["ap", "auc", "f1"]
        })
    print("Paired AP differences, forest - logistic:",
          (results["forest"] - results["logistic"]).round(4))
    return results


def clustering_lab():
    # Neither continuous price nor the derived class enters clustering.
    X = development()[FEATURES]
    train, validation = train_test_split(X, test_size=0.25, random_state=SEED)
    rows = []
    fitted = {}
    for k in [2, 3, 4, 5]:
        model = pipeline(KMeans(n_clusters=k, n_init=10, random_state=SEED)).fit(train)
        transformed = model["preprocess"].transform(validation)
        labels = model.predict(validation)
        count = len(np.unique(labels))
        score = silhouette_score(transformed, labels) if 1 < count < len(labels) else np.nan
        rows.append({"k": k, "silhouette": score})
        fitted[k] = model
    table = pd.DataFrame(rows)
    print(table.to_string(index=False))
    valid = table.dropna()
    if valid.empty:
        raise ValueError("No valid silhouette: inspect features and cluster sizes.")
    k = int(valid.loc[valid["silhouette"].idxmax(), "k"])
    model = fitted[k]
    labels = model.predict(validation)
    alternate = pipeline(KMeans(n_clusters=k, n_init=10, random_state=7)).fit(train)
    print("Seed stability ARI:", adjusted_rand_score(labels, alternate.predict(validation)))
    print("Validation cluster sizes:", pd.Series(labels).value_counts().sort_index().to_dict())
    print(validation.assign(cluster=labels).groupby("cluster")[NUMERIC].mean())
    return table


def make_search():
    grid = [
        {"model": [LogisticRegression(max_iter=1000)], "model__C": [0.1, 1.0]},
        {"model": [RandomForestClassifier(n_estimators=60, random_state=SEED)],
         "model__max_depth": [3, 6]},
        {"model": [GradientBoostingClassifier(n_estimators=60, max_depth=2, random_state=SEED)],
         "model__learning_rate": [0.05, 0.1]},
    ]
    return GridSearchCV(
        pipeline(LogisticRegression(max_iter=1000)), grid,
        scoring="average_precision",
        cv=StratifiedKFold(3, shuffle=True, random_state=11),
        refit=True, error_score="raise", n_jobs=1,
    )


def nested_lab(evaluate_test=False, artifact=None):
    X, y = classification_data(development())
    outer = StratifiedKFold(3, shuffle=True, random_state=23)
    scores = []
    for train_ids, val_ids in outer.split(X, y):
        search = make_search()
        search.fit(X.iloc[train_ids], y.iloc[train_ids])
        probability = search.predict_proba(X.iloc[val_ids])[:, 1]
        scores.append(average_precision_score(y.iloc[val_ids], probability))
    print("Outer AP:", np.round(scores, 4))
    print("Outer mean/std (not a confidence interval):",
          np.mean(scores), np.std(scores, ddof=1))
    final = make_search().fit(X, y)
    print("Final development-selected parameters:", final.best_params_)
    if evaluate_test:
        if artifact is None:
            raise ValueError("Choose a NEW --artifact path for final evaluation.")
        path = Path(artifact)
        # Refuse overwrite before reading holdout: a reminder, not a security boundary.
        with path.open("xb") as output:
            joblib.dump({
                "pipeline": final.best_estimator_, "features": FEATURES,
                "price_threshold": PRICE_THRESHOLD, "decision_threshold": 0.5,
                "dataset": "synthetic-housing-v1", "seed": SEED,
            }, output)
        _, test_ids = partitions()
        X_test, y_test = classification_data(housing().loc[test_ids])
        probability = final.predict_proba(X_test)[:, 1]
        print("FINAL test AP:", average_precision_score(y_test, probability))
        print("FINAL test ROC-AUC:", roc_auc_score(y_test, probability))
        print("FINAL test F1 at 0.5:", f1_score(y_test, probability >= 0.5))
        restored = joblib.load(path)  # Only load your own trusted artifact.
        np.testing.assert_allclose(
            restored["pipeline"].predict_proba(X_test)[:, 1], probability,
        )
        print("Saved full pipeline:", path)
    else:
        print("Test remains unopened. Freeze protocol before --evaluate-test.")
    return scores


LABS = {
    "leakage": leakage_lab, "regression": regression_lab,
    "classification": classification_lab, "comparison": comparison_lab,
    "clustering": clustering_lab, "nested": nested_lab,
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("lab", choices=LABS)
    parser.add_argument("--evaluate-test", action="store_true")
    parser.add_argument("--artifact")
    args = parser.parse_args()
    if args.lab != "nested" and (args.evaluate_test or args.artifact):
        parser.error("Final evaluation options belong to the nested lab only.")
    if args.lab == "nested":
        nested_lab(args.evaluate_test, args.artifact)
    else:
        LABS[args.lab]()


if __name__ == "__main__":
    main()
