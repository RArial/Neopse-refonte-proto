import type { Metadata } from 'next';
import { QuestionsPageSettingsForm } from '@/components/questions-reponses/settings/QuestionsPageSettingsForm';

export const metadata: Metadata = {
  title: 'Gérer la page questions/réponses',
};

export default function QuestionsReponsesParametresPage() {
  return <QuestionsPageSettingsForm />;
}
