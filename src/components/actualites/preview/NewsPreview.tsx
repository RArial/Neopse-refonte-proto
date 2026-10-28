'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNews } from '@/components/actualites/NewsProvider';
import { NewsRichTextView } from '@/components/actualites/preview/NewsRichTextView';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { formatLongDate } from '@/lib/actualites/dates';
import { NEWS_FORM_OPTIONS } from '@/lib/actualites/formMocks';
import { deriveNewsStatus } from '@/lib/actualites/news';
import { videoEmbedUrl } from '@/lib/actualites/video';
import { DEFAULT_DIAPORAMA_DISPLAY, DIAPORAMA_DISPLAY_OPTIONS, LAYOUT_OPTIONS, type ContentBlockData } from '@/types/actualites';

function safeHref(url: string | undefined): string | undefined {
  return url && /^https?:\/\//i.test(url) ? url : undefined;
}

function PreviewBlock({ block }: { block: ContentBlockData }) {
  switch (block.kind) {
    case 'text':
      return (
        <Stack spacing={1}>
          {block.heading && (
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
              {block.heading}
            </Typography>
          )}
          <NewsRichTextView html={block.body} />
        </Stack>
      );
    case 'images': {
      const url = block.imageUrls[0];
      if (!url) return null;
      const href = safeHref(block.linkUrl);
      const image = (
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 1, overflow: 'hidden' }}>
          <MediaThumb src={url} sizes="800px" />
        </Box>
      );
      return (
        <Box component="figure" sx={{ m: 0, width: `${block.widthPercent ?? 100}%` }}>
          {href ? (
            <Link href={href} target={block.linkNewTab ? '_blank' : undefined} rel={block.linkNewTab ? 'noopener noreferrer' : undefined}>
              {image}
            </Link>
          ) : (
            image
          )}
          {block.caption && (
            <Typography component="figcaption" variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {block.caption}
            </Typography>
          )}
        </Box>
      );
    }
    case 'diaporama':
      if (block.imageUrls.length === 0) return null;
      return (
        <Stack spacing={1}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1 }}>
            {block.imageUrls.map((url) => (
              <Box key={url} sx={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 1, overflow: 'hidden' }}>
                <MediaThumb src={url} sizes="240px" />
              </Box>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Diaporama : {DIAPORAMA_DISPLAY_OPTIONS.find((option) => option.value === (block.display ?? DEFAULT_DIAPORAMA_DISPLAY))?.label}
          </Typography>
        </Stack>
      );
    case 'attachments':
      if (block.attachments.length === 0) return null;
      return (
        <Stack spacing={1}>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
            {block.title ?? 'Liste de pièces jointes'}
          </Typography>
          {block.attachments.map((attachment) => (
            <Stack key={attachment.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AttachFileIcon fontSize="small" aria-hidden="true" />
              <Typography variant="body2">{attachment.name}</Typography>
            </Stack>
          ))}
        </Stack>
      );
    case 'video': {
      const embed = videoEmbedUrl(block.url);
      if (!embed) return null;
      return (
        <Box sx={{ position: 'relative', aspectRatio: '16 / 9' }}>
          <Box component="iframe" src={embed} title="Vidéo" allow="encrypted-media; picture-in-picture; fullscreen" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        </Box>
      );
    }
    case 'html':
      return block.code.trim() ? <Alert severity="info">Bloc de code HTML : il n&apos;est pas interprété dans l&apos;aperçu du prototype.</Alert> : null;
    case 'form': {
      const form = NEWS_FORM_OPTIONS.find((option) => option.id === block.formId);
      return form ? <Alert severity="info">Formulaire « {form.label} » affiché à cet emplacement sur le site.</Alert> : null;
    }
  }
}

export function NewsPreview({ articleId }: { articleId: string }) {
  const news = useNews();
  if (!news.hydrated) {
    return (
      <Box sx={{ maxWidth: 880, mx: 'auto', p: 4 }} aria-busy="true" aria-label="Chargement de l'aperçu…">
        <Skeleton variant="text" height={56} />
        <Skeleton variant="rounded" height={320} />
      </Box>
    );
  }
  const article = news.articles.find((candidate) => candidate.id === articleId);
  if (!article) {
    return (
      <Box component="main" id="main-content" sx={{ maxWidth: 880, mx: 'auto', p: 4 }}>
        <Alert severity="warning">Cette actualité est introuvable dans la session : rouvrez l&apos;aperçu depuis l&apos;éditeur.</Alert>
      </Box>
    );
  }

  const status = deriveNewsStatus(article, news.today);
  // Vignette cadrée sur le centre de la zone retenue ; l'aperçu ne reproduit pas la rotation.
  const crop = article.thumbnail?.crop;
  const objectPosition = crop ? `${((crop.x + crop.width / 2) * 100).toFixed(1)}% ${((crop.y + crop.height / 2) * 100).toFixed(1)}%` : 'center';

  return (
    <Box component="main" id="main-content" sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
      {status !== 'published' && (
        <Alert severity="info" square sx={{ justifyContent: 'center' }}>
          Aperçu : cette actualité est {status === 'scheduled' ? `programmée pour le ${formatLongDate(article.publishedAt)}` : 'inactive'} et n&apos;est pas visible sur le site.
        </Alert>
      )}
      <Box component="article" sx={{ maxWidth: 880, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <Typography variant="body2" color="text.secondary">
          Actualités · {formatLongDate(article.publishedAt)}
        </Typography>
        <Typography component="h1" variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2, fontSize: { xs: 28, md: 40 } }}>
          {article.title}
        </Typography>
        {article.lead && (
          <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, mb: 3 }}>
            {article.lead}
          </Typography>
        )}
        {article.thumbnail && (
          <Box sx={{ position: 'relative', aspectRatio: '4 / 3', maxHeight: 480, borderRadius: 2, overflow: 'hidden', mb: 4, '& img': { objectPosition } }}>
            <MediaThumb src={article.thumbnail.url} sizes="880px" />
          </Box>
        )}
        <Stack spacing={4}>
          {article.content.map((row) => {
            const layout = LAYOUT_OPTIONS.find((option) => option.key === row.layout) ?? LAYOUT_OPTIONS[0];
            return (
              <Box key={row.id} sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: layout.widths.map((width) => `${width}fr`).join(' ') } }}>
                {row.columns.map((blocks, index) => (
                  <Stack key={index} spacing={3} sx={{ minWidth: 0 }}>
                    {blocks.map((block) => (
                      <PreviewBlock key={block.id} block={block} />
                    ))}
                  </Stack>
                ))}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
