export const mockUser = {
  username: 'th33edu',
  email: 'th33raphat@semd.com',
  role: 'Analyst' as const,
  stats: { total: 142, dangers: 23, accuracy: 97, days: 14 },
  connections: { google: true, github: false },
};

export type ProfileVerdict = 'Safe' | 'Danger' | 'Warning';

export interface ActivityRow {
  url: string;
  verdict: ProfileVerdict;
  time: string;
}

export const mockActivity: ActivityRow[] = [
  { url: 'http://bank-secure-login.net/th/confirm', verdict: 'Danger', time: '2 นาที' },
  { url: 'https://github.com/openai/gpt-4', verdict: 'Safe', time: '15 นาที' },
  { url: 'https://shop-discount-100percent.cc', verdict: 'Warning', time: '1 ชม.' },
  { url: 'http://free-robux-generator.io/claim', verdict: 'Danger', time: '3 ชม.' },
  { url: 'https://docs.anthropic.com/claude/api', verdict: 'Safe', time: 'เมื่อวาน' },
];

export interface UserStats {
  total: number;
  dangers: number;
  accuracy: number;
  days: number;
}

export interface UserConnections {
  google: boolean;
  github: boolean;
}

export interface MockUserData {
  username: string;
  email: string;
  role: 'Analyst' | 'Admin' | 'User';
  stats: UserStats;
  connections: UserConnections;
}
