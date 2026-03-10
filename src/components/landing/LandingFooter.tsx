import React from 'react';
import { Text, Container } from '@/components/ui';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-dark text-light/60 py-8">
      <Container size="lg" className="text-center text-[13px]">
        <span className="text-primary font-bold">SEMD</span>
        {' — '}
        Suspicious URL Evaluation for Malicious Detection
        {' · '}
        Powered by Machine Learning
        {' · '}
        © 2026
      </Container>
    </footer>
  );
};
