import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CommandeDetail } from '@/components/commandes/CommandeDetail';
import { getCommandeById } from '@/types/commandes';

interface CommandeDetailPageProps {
  params: Promise<{ commandeId: string }>;
}

export async function generateMetadata({ params }: CommandeDetailPageProps): Promise<Metadata> {
  const { commandeId } = await params;
  const commande = getCommandeById(commandeId);
  return { title: commande ? `Commande ${commande.orderNumber}` : 'Commande introuvable' };
}

export default async function CommandeDetailPage({ params }: CommandeDetailPageProps) {
  const { commandeId } = await params;
  const commande = getCommandeById(commandeId);

  if (!commande) notFound();

  return <CommandeDetail commande={commande} />;
}
