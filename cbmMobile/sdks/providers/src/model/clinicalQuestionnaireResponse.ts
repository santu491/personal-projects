export interface ClinicalQuestionnaireResponseDTO {
  data: ClinicalQuestionnaireResponse[];
}

export interface ClinicalQuestionnaireResponse {
  employerType: string;
  id: string;
  presentingProblems: string;
  problemTypeKey: string;
}

export interface ProblemInfo {
  id: string;
  label: string;
  value: string;
}
