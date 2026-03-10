'use client';

import React from 'react';
import { Card, Text, Heading } from '@/components/ui';

interface StatCard {
  value: string;
  label: string;
}

interface StatsStripProps {
  stats: StatCard[];
}

export const StatsStrip: React.FC<StatsStripProps> = ({ stats }) => {
  return (
    <div className="flex gap-4 mb-5">
      {stats.map((stat, index) => (
        <Card
          key={index}
          variant="default"
          animated={false}
          className="bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl px-5 py-4 text-center min-w-[96px]"
        >
          <Heading as="h4" variant="section" className="font-display text-2xl font-extrabold text-brown leading-none">
            {stat.value}
          </Heading>
          <Text variant="caption" className="text-brown-mid/70 font-medium mt-1 uppercase tracking-wider">
            {stat.label}
          </Text>
        </Card>
      ))}
    </div>
  );
};

export default StatsStrip;
