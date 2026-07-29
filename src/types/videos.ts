export type VideoStatus = 'published' | 'draft' | 'archived';

export type VideoLinkType = 'youtube' | 'dailymotion' | 'vimeo' | 'autre-html';

export const VIDEO_LINK_TYPE_LABELS: Record<VideoLinkType, string> = {
  youtube: 'YouTube',
  dailymotion: 'Dailymotion',
  vimeo: 'Vimeo',
  'autre-html': 'Autre source (code HTML)',
};

export interface Video {
  id: string;
  name: string;
  publicationDate: string;
  status: VideoStatus;
}

export const VIDEOS_MOCK: Video[] = [
  { id: 'video-conseil-municipal', name: 'Conseil municipal — séance du 10 juin', publicationDate: '2026-06-10', status: 'published' },
  { id: 'video-visite-chantier', name: 'Visite du chantier de la médiathèque', publicationDate: '2026-07-01', status: 'published' },
  { id: 'video-portrait-associations', name: 'Portrait des associations locales', publicationDate: '2026-09-05', status: 'published' },
  { id: 'video-inauguration-mediatheque', name: 'Inauguration de la médiathèque', publicationDate: '', status: 'draft' },
  { id: 'video-bilan-annuel', name: "Bilan annuel de la collectivité", publicationDate: '', status: 'draft' },
  { id: 'video-fete-nationale-2025', name: 'Fête nationale 2025', publicationDate: '2025-07-14', status: 'archived' },
];

export interface VideoFormData {
  name: string;
  linkType: VideoLinkType;
  videoUrl: string;
  htmlCode: string;
  description: string;
  thumbnailUrl: string | null;
  publicationDate: string;
  featuredHome: boolean;
  status: VideoStatus;
}

export const DEFAULT_VIDEO_FORM: VideoFormData = {
  name: '',
  linkType: 'youtube',
  videoUrl: '',
  htmlCode: '',
  description: '',
  thumbnailUrl: null,
  publicationDate: '',
  featuredHome: false,
  status: 'draft',
};
