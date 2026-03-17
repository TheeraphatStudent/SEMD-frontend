import { URLRow } from './row';
import { EvaluatorOption, InputTypeOption } from './types';

export const  mockRows: URLRow[] = [
  { id: 1, url: 'https://www.google.com', date: '28 Feb 2026', type: 'Legitimate', verdict: 'Benign', conf: 98, reporter: 'john_doe' },
  { id: 2, url: 'http://bank-secure-login.net/th/confirm', date: '28 Feb 2026', type: 'Phishing', verdict: 'Malicious', conf: 94, reporter: 'analyst_k' },
  { id: 3, url: 'https://update-flash-player-now.com', date: '27 Feb 2026', type: 'Malware', verdict: 'Malicious', conf: 89, reporter: 'sec_team' },
  { id: 4, url: 'http://promo-win-iphone16-free.xyz', date: '27 Feb 2026', type: 'Scam', verdict: 'Malicious', conf: 76, reporter: 'analyst_m' },
  { id: 5, url: 'https://github.com/openai/gpt-4', date: '26 Feb 2026', type: 'Legitimate', verdict: 'Benign', conf: 97, reporter: 'john_doe' },
  { id: 6, url: 'http://verify-your-account-now.tk/login', date: '26 Feb 2026', type: 'Phishing', verdict: 'Malicious', conf: 92, reporter: 'sec_team' },
  { id: 7, url: 'https://shop-discount-100percent.cc', date: '25 Feb 2026', type: 'Suspicious', verdict: 'Malicious', conf: 65, reporter: 'analyst_k' },
  { id: 8, url: 'https://docs.anthropic.com/claude/api', date: '25 Feb 2026', type: 'Legitimate', verdict: 'Benign', conf: 99, reporter: 'analyst_m' },
  { id: 9, url: 'http://free-robux-generator.io/claim', date: '24 Feb 2026', type: 'Scam', verdict: 'Malicious', conf: 87, reporter: 'john_doe' },
  { id: 10, url: 'https://mail.google.com/mail/u/0', date: '24 Feb 2026', type: 'Legitimate', verdict: 'Benign', conf: 99, reporter: 'sec_team' },
];

export const evaluatorOptions: EvaluatorOption[] = [
  { label: 'SEMD', tag: 'ML · 0.1', icon: 'bot', value: 'semd-0.1' },
  { label: 'SEMD', tag: 'ML · 0.2', icon: 'bot', value: 'semd-0.2' },
  { label: 'Thaiphishtank', value: 'thaiphishtank' },
  { label: 'URLhaus', value: 'urlhaus' },
  { label: 'Google Safebrowsing', value: 'google-safebrowsing' },
  { label: 'URLVOID', value: 'urlvoid' },
];

export const inputTypeOptions: InputTypeOption[] = [
  { 
    value: 'url', 
    icon: 'link', 
    label: 'URL', 
    desc: 'ใส่ URL เดี่ยว เช่น https://… หรือ http://…',
    supportsFile: false,
  },
  { 
    value: 'csv', 
    icon: 'file-spreadsheet', 
    label: 'CSV', 
    desc: 'id,url หรือ url คั่นด้วย comma',
    supportsFile: true,
    fileAccept: '.csv',
    exampleFormat: 'id,url\n1,https://example.com\n2,https://test.com',
  },
  { 
    value: 'txt', 
    icon: 'file-text', 
    label: 'TXT', 
    desc: 'URL แต่ละบรรทัด หรือคั่นด้วย space',
    supportsFile: true,
    fileAccept: '.txt',
    exampleFormat: 'https://example.com\nhttps://test.com\nhttps://another.com',
  },
];

export const reporterColors: Record<string, string> = {
  john_doe: '#FFCE69',
  analyst_k: '#D3DFFF',
  sec_team: '#D5FFC0',
  analyst_m: '#FFEDD5',
};
