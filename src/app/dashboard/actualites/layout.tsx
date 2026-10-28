import { NewsProvider } from '@/components/actualites/NewsProvider';

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return <NewsProvider>{children}</NewsProvider>;
}
