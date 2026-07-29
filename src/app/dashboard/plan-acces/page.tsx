import type { Metadata } from 'next';
import { PlanAccesForm } from '@/components/plan-acces/PlanAccesForm';

export const metadata: Metadata = {
  title: 'Plan / Accès',
};

export default function PlanAccesPage() {
  return <PlanAccesForm />;
}
