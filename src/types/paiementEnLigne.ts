import type { Attachment } from '@/components/pages-modules/AttachmentsField';

export interface PaiementEnLigneData {
  text: string;
  buttonLabel: string;
  destinationUrl: string;
  attachments: Attachment[];
  widgetThumbnailUrl: string | null;
  showWidgetButton: boolean;
}

export const DEFAULT_PAIEMENT_EN_LIGNE: PaiementEnLigneData = {
  text: '',
  buttonLabel: '',
  destinationUrl: '',
  attachments: [],
  widgetThumbnailUrl: null,
  showWidgetButton: false,
};
