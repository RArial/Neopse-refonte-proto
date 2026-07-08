import { ContenuProvider } from '@/components/contenu/ContenuProvider';

export default function ContenuLayout({ children }: { children: React.ReactNode }) {
  return <ContenuProvider>{children}</ContenuProvider>;
}
