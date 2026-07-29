import { FooterContentProvider } from '@/components/contenu/footer/FooterContentProvider';

export default function PiedDePageLayout({ children }: { children: React.ReactNode }) {
  return <FooterContentProvider>{children}</FooterContentProvider>;
}
