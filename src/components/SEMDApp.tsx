'use client';

import React, { useState, useCallback } from 'react';
import { View, CheckInput, Verdict, CheckResult } from '@/libs/utils/types';
import { evaluatorOptions } from '@/libs/utils/mockData';
import {
  LandingNavbar,
  HeroSection,
  ProblemSection,
  HowItWorksSection,
  DemoTableSection,
  FeaturesSection,
  StatsSection,
  UseCasesSection,
  LandingFooter
} from '@/components/landing';
import { LoadingView } from '@/components/loading/LoadingView';
import { ResultView } from '@/components/result/ResultView';

const getVerdictFromUrl = (url: string): { verdict: Verdict; confidence: number } => {
  const isDanger = /(phish|malware|hack|free.*robux|win.*iphone|verify.*account|login\.(net|tk|xyz|io)|bank.*secure)/i.test(url);
  const isWarn = /(discount|promo|shop.*cc|suspicious)/i.test(url);

  if (isDanger) {
    return { verdict: 'Malicious', confidence: Math.floor(Math.random() * 15) + 82 };
  }
  if (isWarn) {
    return { verdict: 'Malicious', confidence: Math.floor(Math.random() * 20) + 60 };
  }
  return { verdict: 'Benign', confidence: Math.floor(Math.random() * 5) + 94 };
};

const getModelLabel = (evaluatorValue: string): string => {
  const option = evaluatorOptions.find(opt => opt.value === evaluatorValue);
  if (option) {
    return option.tag ? `${option.label} (${option.tag})` : option.label;
  }
  return 'SEMD (ML · 0.2)';
};

export const SEMDApp: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [checkInput, setCheckInput] = useState<CheckInput | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleCheck = useCallback((input: CheckInput) => {
    setCheckInput(input);
    setView('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    if (checkInput) {
      const { verdict, confidence } = getVerdictFromUrl(checkInput.url);
      setResult({
        url: checkInput.url,
        verdict,
        confidence,
        model: getModelLabel(checkInput.evaluator),
        timestamp: new Date(),
      });
      setView('result');
    }
  }, [checkInput]);

  const handleBack = useCallback(() => {
    setView('landing');
    setCheckInput(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (view === 'loading' && checkInput) {
    return (
      <>
        <LandingNavbar />
        <LoadingView
          url={checkInput.url}
          model={getModelLabel(checkInput.evaluator)}
          onComplete={handleLoadingComplete}
        />
      </>
    );
  }

  if (view === 'result' && result) {
    return (
      <>
        <LandingNavbar />
        <ResultView
          url={result.url}
          verdict={result.verdict}
          confidence={result.confidence}
          model={result.model}
          onBack={handleBack}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection onCheck={handleCheck} />
      <ProblemSection />
      <HowItWorksSection />
      <DemoTableSection />
      <FeaturesSection />
      <StatsSection />
      <UseCasesSection />
      <LandingFooter />
    </main>
  );
};
