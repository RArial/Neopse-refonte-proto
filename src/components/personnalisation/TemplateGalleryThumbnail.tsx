import Image from 'next/image';
import type { TemplateDefinition } from '@/lib/personnalisation/templates';

interface TemplateGalleryThumbnailProps {
  template: TemplateDefinition;
}

/** Vignette réelle d'une maquette dans l'onglet de sélection : contrairement à `TemplateThumbnail`
 * (utilisée pour différencier les variantes par leurs couleurs sur le hub), ici la mise en page
 * elle-même est ce qui distingue les maquettes — une image fixe suffit. */
export function TemplateGalleryThumbnail({ template }: TemplateGalleryThumbnailProps) {
  return (
    <Image
      src={template.imageSrc}
      alt={`Aperçu de la maquette ${template.name}`}
      fill
      sizes="140px"
      style={{ objectFit: 'cover', objectPosition: 'top center' }}
    />
  );
}
