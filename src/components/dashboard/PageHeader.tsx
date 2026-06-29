import { Icons } from '@/components/ui/Icons';

export function PageHeader() {
  return (
    <div className="title-row">
      <div>
        <h1 className="page-title">
          Démo arborescence
          <span className="chev" aria-hidden="true">
            <Icons.ChevronDown size={20} />
          </span>
        </h1>
        <p className="page-sub">Vue d&apos;ensemble de votre site — aujourd&apos;hui, 15 juin 2026</p>
      </div>
    </div>
  );
}
