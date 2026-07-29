import type { Metadata } from 'next';
import { PollForm } from '@/components/sondages/PollForm';

export const metadata: Metadata = {
  title: 'Nouveau sondage',
};

export default function NouveauPollPage() {
  return <PollForm />;
}
