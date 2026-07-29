import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { RESERVED_CONTENTS } from '@/types/espaceReserve';

export const metadata: Metadata = {
  title: 'Espace Réservé',
};

export default function ReservedContentPage() {
  return (
    <ContentListPage
      title="Espace Réservé"
      description="Publiez des contenus visibles uniquement après identification des usagers."
      addLabel="Ajouter un contenu"
      addHref="/dashboard/espace-reserve/nouveau"
      itemNounSingular="un contenu"
      itemNounPlural="des contenus"
      initialItems={RESERVED_CONTENTS}
      editHrefBase="/dashboard/espace-reserve/edit"
      secondaryActions={[
        { label: 'Membres autorisés', href: '/dashboard/espace-reserve/membres' },
        { label: 'Gérer la page « Espace Réservé »', href: '/dashboard/espace-reserve/parametres' },
      ]}
    />
  );
}
