import type { Attachment } from '@/components/pages-modules/AttachmentsField';
import type { DiaporamaImage, DiaporamaType } from '@/components/pages-modules/DiaporamaField';

export type { DiaporamaType };

export type PlanAccesImage = DiaporamaImage;

export type PlanAccesAttachment = Attachment;

export interface PlanAccesData {
  generalInfo: string;
  cityPostalCode: string;
  address: string;
  latitude: string;
  longitude: string;
  diaporamaType: DiaporamaType;
  images: PlanAccesImage[];
  attachments: PlanAccesAttachment[];
}

export const DEFAULT_PLAN_ACCES: PlanAccesData = {
  generalInfo: '',
  cityPostalCode: '',
  address: '',
  latitude: '',
  longitude: '',
  diaporamaType: 'aucune',
  images: [],
  attachments: [],
};
