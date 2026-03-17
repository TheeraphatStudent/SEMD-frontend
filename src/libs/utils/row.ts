import { ThreatType, Verdict } from "./types";

export interface URLRow {
  id: number;
  url: string;
  date: string;
  type: ThreatType;
  verdict: Verdict;
  conf: number;
  reporter: string;
}

export interface FlagRow {
  id: number;
  url: string;
  date: string;
  flag: Verdict;
  action: string;
}
