'use client';

import React from 'react';
import { Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Card } from '@/components/ui';

interface URLRow {
  id: number;
  url: string;
  type: 'Malicious' | 'Safe';
  status: 'Checked' | 'Pending';
}

const mockData: URLRow[] = [
  { id: 1, url: 'https://www.g0Ogle.conn', type: 'Malicious', status: 'Checked' },
  { id: 2, url: 'http://www.d0c3r.conn', type: 'Malicious', status: 'Pending' },
  { id: 3, url: 'video.barnesandnoble.com/...', type: 'Safe', status: 'Checked' },
  { id: 4, url: 'nicolatessari.it/index.php', type: 'Malicious', status: 'Checked' },
];

export const URLTablePreview: React.FC = () => {
  return (
    <Card 
      variant="default" 
      animated={false}
      className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden w-full max-w-[480px] shadow-xl p-0"
    >
      <Table className="text-[12.5px] border-0">
        <TableHeader className="bg-brown/5 border-b border-brown/10">
          <TableRow className="border-0">
            <TableHead className="px-3.5 py-2.5 text-left font-semibold text-brown-mid text-[11px] uppercase tracking-wider h-auto">
              #
            </TableHead>
            <TableHead className="px-3.5 py-2.5 text-left font-semibold text-brown-mid text-[11px] uppercase tracking-wider h-auto">
              URL
            </TableHead>
            <TableHead className="px-3.5 py-2.5 text-left font-semibold text-brown-mid text-[11px] uppercase tracking-wider h-auto">
              Type
            </TableHead>
            <TableHead className="px-3.5 py-2.5 text-left font-semibold text-brown-mid text-[11px] uppercase tracking-wider h-auto">
              Verify
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((row) => (
            <TableRow key={row.id} className="border-b border-brown/5 last:border-b-0 hover:bg-transparent">
              <TableCell className="px-3.5 py-2.5 text-brown text-xs">{row.id}</TableCell>
              <TableCell className="px-3.5 py-2.5 font-mono text-[11px] text-brown-mid">
                {row.url}
              </TableCell>
              <TableCell className="px-3.5 py-2.5">
                <Badge 
                  variant={row.type === 'Malicious' ? 'danger' : 'success'} 
                  animated={false}
                  className="text-[11px]"
                >
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="px-3.5 py-2.5">
                <Badge 
                  variant={row.status === 'Checked' ? 'success' : 'warning'} 
                  animated={false}
                  className="text-[11px]"
                >
                  {row.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default URLTablePreview;
