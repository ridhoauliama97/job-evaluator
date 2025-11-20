export type CriteriaType = "Benefit" | "Cost";

export interface CriteriaOption {
  label: string;
  value: number;
}

export interface Criteria {
  id: string;
  name: string;
  type: CriteriaType;
  options: CriteriaOption[];
}

export interface UserDetails {
  name: string;
  age: string;
  education: string;
  location: string;
}

export interface JobAlternative {
  id: string;
  name: string;
  values: Record<string, number>;
}

export interface PSICalculation {
  normalizedMatrix: number[][];
  averages: number[];
  preferenceVariations: number[];
  weights: number[];
  psiValues: number[];
}

export interface PSIResult extends PSICalculation {
  userDetails: UserDetails;
  alternatives: JobAlternative[];
  rankedAlternatives: Array<{
    alternative: JobAlternative;
    psiValue: number;
    rank: number;
  }>;
  timestamp: number;
}

export interface EvaluationHistory {
  id: string;
  userDetails: UserDetails;
  timestamp: number;
  topAlternative: string;
  alternativesCount: number;
}
