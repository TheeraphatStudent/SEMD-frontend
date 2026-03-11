export type View = 'landing' | 'loading' | 'result';

export type InputType = 'url' | 'csv' | 'txt';

export type Verdict = 'Benign' | 'Malicious';

export type ThreatType = 'Legitimate' | 'Phishing' | 'Malware' | 'Scam' | 'Suspicious';

export interface CheckInput {
  url: string;
  evaluator: string;
  inputType: InputType;
}

export interface CheckResult {
  url: string;
  verdict: Verdict;
  confidence: number;
  model: string;
  timestamp: Date;
}

export interface URLRow {
  id: number;
  url: string;
  date: string;
  type: ThreatType;
  verdict: Verdict;
  conf: number;
  reporter: string;
}

export interface EvaluatorOption {
  label: string;
  tag?: string;
  icon?: string;
  value: string;
}

export interface InputTypeOption {
  value: InputType;
  icon: string;
  label: string;
  desc: string;
  supportsFile?: boolean;
  fileAccept?: string;
  exampleFormat?: string;
}
