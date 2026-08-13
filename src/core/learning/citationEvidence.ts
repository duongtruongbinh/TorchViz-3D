export type LearningCitationEvidenceTargetPrecision = 'html-anchor' | 'pdf-page' | 'landing-page';

export type LearningCitationEvidence = {
  id: string;
  lessonId: string;
  claimId: string;
  paperId: string;
  excerpt: string;
  searchText: string;
  locator: string;
  verificationUrl: string;
  targetPrecision: LearningCitationEvidenceTargetPrecision;
  sourceVersion?: string;
  retrievedAt: string;
  review: {
    status: 'verified';
    verifiedAt: string;
  };
  quotation: {
    basis: 'short-quotation' | 'redistributable-license';
    licenseUrl?: string;
  };
  automatedAudit?: {
    status: 'manual-required';
    reason: string;
  };
};

export type LearningCitationLinkOnlyException = {
  id: string;
  lessonId: string;
  claimId: string;
  paperId: string;
  reason: string;
  verificationUrl: string;
  reviewedAt: string;
};

export function citationEvidenceTargetLabel(precision: LearningCitationEvidenceTargetPrecision): string {
  if (precision === 'html-anchor') return 'Mở đúng đoạn';
  if (precision === 'pdf-page') return 'Mở trang chứa đoạn';
  return 'Mở paper';
}
