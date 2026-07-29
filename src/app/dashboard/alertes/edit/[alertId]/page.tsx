import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlertForm } from '@/components/alertes/AlertForm';
import { ALERTS_MOCK } from '@/types/alertes';

export const metadata: Metadata = {
  title: 'Modifier une alerte',
};

interface EditAlertPageProps {
  params: Promise<{ alertId: string }>;
}

export default async function EditAlertPage({ params }: EditAlertPageProps) {
  const { alertId } = await params;
  const alert = ALERTS_MOCK.find((candidate) => candidate.id === alertId);

  if (!alert) notFound();

  return <AlertForm mode="edit" initialAlert={alert} />;
}
