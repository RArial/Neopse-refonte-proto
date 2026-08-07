import type { Metadata } from 'next';
import { FormBuilder } from '@/components/formulaires/FormBuilder';

export const metadata: Metadata = {
  title: 'Nouveau formulaire',
};

export default function NouveauFormulairePage() {
  return <FormBuilder mode="create" />;
}
