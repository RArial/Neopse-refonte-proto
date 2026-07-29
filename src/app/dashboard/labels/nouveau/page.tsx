import type { Metadata } from 'next';
import { LabelForm } from '@/components/labels/LabelForm';

export const metadata: Metadata = {
  title: 'Nouveau label',
};

export default function NouveauLabelPage() {
  return <LabelForm />;
}
