import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuestionDetail } from '@/components/questions-reponses/QuestionDetail';
import { QUESTIONS_MOCK } from '@/types/questionsReponses';

interface QuestionDetailPageProps {
  params: Promise<{ questionId: string }>;
}

export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = QUESTIONS_MOCK.find((candidate) => candidate.id === questionId);
  return { title: question ? question.subject : 'Question introuvable' };
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { questionId } = await params;
  const question = QUESTIONS_MOCK.find((candidate) => candidate.id === questionId);

  if (!question) notFound();

  return <QuestionDetail question={question} />;
}
