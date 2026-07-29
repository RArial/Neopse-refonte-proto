import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { CONTACTS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Contacts',
};

export default function ContactPage() {
  return (
    <ContentListPage
      title="Contacts"
      description="Publiez un annuaire de contacts utiles pour vos usagers."
      addLabel="Ajouter un contact"
      addHref="/dashboard/contacts/nouveau"
      itemNounSingular="un contact"
      itemNounPlural="des contacts"
      initialItems={CONTACTS_MOCK}
      showEmail
      editHrefBase="/dashboard/contacts"
      secondaryActions={[{ label: 'Gérer la page contact', href: '/dashboard/contacts/parametres' }]}
    />
  );
}
