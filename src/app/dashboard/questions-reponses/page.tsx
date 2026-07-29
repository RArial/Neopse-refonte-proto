import type { Metadata } from 'next';
import { QuestionsList } from '@/components/questions-reponses/QuestionsList';

export const metadata: Metadata = {
  title: 'Questions/réponses',
};

export default function QuestionsReponsesPage() {
  return <QuestionsList />;
}
