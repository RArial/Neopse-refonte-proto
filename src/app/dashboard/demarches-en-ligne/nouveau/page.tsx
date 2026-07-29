import type { Metadata } from 'next';
import { StepForm } from '@/components/demarches-en-ligne/StepForm';

export const metadata: Metadata = {
  title: 'Nouvelle démarche',
};

export default function NouveauStepPage() {
  return <StepForm />;
}
