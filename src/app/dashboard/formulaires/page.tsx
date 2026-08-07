import { Suspense } from 'react';
import type { Metadata } from 'next';
import { FormulairesHub } from '@/components/formulaires/FormulairesHub';

export const metadata: Metadata = {
  title: 'Formulaires',
};

export default function FormulairesPage() {
  return (
    <Suspense fallback={null}>
      <FormulairesHub />
    </Suspense>
  );
}
