import type { Metadata } from 'next';
import { WidgetForm } from '@/components/widgets/WidgetForm';

export const metadata: Metadata = {
  title: 'Nouveau widget',
};

export default function NouveauWidgetPage() {
  return <WidgetForm />;
}
