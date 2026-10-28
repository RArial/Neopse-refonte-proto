'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { NewsBulkBar } from '@/components/actualites/list/NewsBulkBar';
import { NewsDeleteDialog } from '@/components/actualites/list/NewsDeleteDialog';
import { NewsStatusBadge } from '@/components/actualites/list/NewsStatusBadge';
import { useNews } from '@/components/actualites/NewsProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';
import { formatLongDate, formatRelativeDay } from '@/lib/actualites/dates';
import { compareByDate, compareForList, deriveNewsStatus, newsSearchText, normalizeSearch } from '@/lib/actualites/news';
import { MAX_FAVORITE_NEWS, type NewsArticle, type NewsStatus } from '@/types/actualites';

type NewsFilter = 'all' | NewsStatus | 'favorites';

const FILTERS: { value: NewsFilter; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'published', label: 'Publiées' },
  { value: 'scheduled', label: 'Programmées' },
  { value: 'inactive', label: 'Inactives' },
  { value: 'favorites', label: 'Favorites' },
];

function isNewsFilter(value: string | null): value is NewsFilter {
  return FILTERS.some((filter) => filter.value === value);
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count > 1 ? pluralForm : singular}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

type PendingDelete = { kind: 'single'; article: NewsArticle } | { kind: 'bulk'; ids: string[] };

export function NewsList() {
  const news = useNews();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const filter: NewsFilter = isNewsFilter(filterParam) ? filterParam : 'all';
  const search = searchParams.get('search') ?? '';
  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const { today } = news;

  const withStatus = useMemo(
    () => news.articles.map((article) => ({ article, status: deriveNewsStatus(article, today) })),
    [news.articles, today],
  );

  const counts = useMemo(() => {
    const result: Record<NewsFilter, number> = { all: withStatus.length, published: 0, scheduled: 0, inactive: 0, favorites: 0 };
    withStatus.forEach(({ article, status }) => {
      result[status] += 1;
      if (article.favorite) result.favorites += 1;
    });
    return result;
  }, [withStatus]);

  const rows = useMemo(() => {
    const query = normalizeSearch(search.trim());
    const filtered = withStatus.filter(({ article, status }) => {
      if (filter === 'favorites' && !article.favorite) return false;
      if (filter !== 'all' && filter !== 'favorites' && status !== filter) return false;
      return !query || normalizeSearch(newsSearchText(article)).includes(query);
    });
    // Une recherche trie par date seule ; sinon les favoris remontent en tête.
    const compare = query ? compareByDate : compareForList;
    return filtered.sort((a, b) => compare(a.article, b.article));
  }, [withStatus, filter, search]);

  const visibleIds = rows.map(({ article }) => article.id);
  const selectedVisible = selected.filter((id) => visibleIds.includes(id));
  const allSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;

  function updateUrl(next: { filter?: NewsFilter; search?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextFilter = next.filter ?? filter;
    const nextSearch = next.search ?? search;
    if (nextFilter === 'all') params.delete('filter');
    else params.set('filter', nextFilter);
    if (nextSearch.trim()) params.set('search', nextSearch.trim());
    else params.delete('search');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setSelected([]);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl({ search: searchInput });
  }

  function toggleRow(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function toggleAll() {
    setSelected(allSelected ? [] : visibleIds);
  }

  function toggleFavorite(article: NewsArticle) {
    const ok = news.setFavorite(article.id, !article.favorite);
    if (!ok) news.notify(`Vous avez déjà ${MAX_FAVORITE_NEWS} actualités en favori. Retirez-en une pour en ajouter une autre.`, 'error');
  }

  function duplicateOne(article: NewsArticle) {
    const [copyId] = news.duplicate([article.id]);
    news.notify("L'actualité a bien été dupliquée.");
    router.push(`/dashboard/actualites/edit/${copyId}`);
  }

  function bulk(action: 'publish' | 'deactivate' | 'duplicate') {
    const ids = selected;
    const n = ids.length;
    if (action === 'publish') {
      news.publishNow(ids);
      news.notify(`${plural(n, 'actualité publiée', 'actualités publiées')} avec succès`);
    } else if (action === 'deactivate') {
      news.deactivate(ids);
      news.notify(`${plural(n, 'actualité mise', 'actualités mises')} en inactive`);
    } else {
      news.duplicate(ids);
      news.notify(`${plural(n, 'actualité dupliquée', 'actualités dupliquées')}`);
    }
    setSelected([]);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'single') {
      news.remove([pendingDelete.article.id]);
      news.notify("L'actualité a bien été supprimée.");
    } else {
      news.remove(pendingDelete.ids);
      news.notify(`${plural(pendingDelete.ids.length, 'actualité supprimée', 'actualités supprimées')}`);
    }
    setSelected((prev) => prev.filter((id) => (pendingDelete.kind === 'single' ? id !== pendingDelete.article.id : !pendingDelete.ids.includes(id))));
    setPendingDelete(null);
  }

  const filterLabel = FILTERS.find((item) => item.value === filter)?.label ?? 'Toutes';

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, pb: 14, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Actualités
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {news.hydrated
              ? `${plural(counts.all, 'actualité', 'actualités')} — ${plural(counts.published, 'publiée', 'publiées')}, ${plural(counts.scheduled, 'programmée', 'programmées')}, ${plural(counts.inactive, 'inactive', 'inactives')}`
              : ' '}
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/actualites/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Nouvelle actualité
        </Button>
      </Stack>

      <Tabs
        value={filter}
        onChange={(_, value: NewsFilter) => updateUrl({ filter: value })}
        aria-label="Filtrer les actualités"
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ minHeight: 44, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {FILTERS.map((item) => (
          <Tab key={item.value} value={item.value} label={<TabLabel text={item.label} count={counts[item.value]} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        ))}
      </Tabs>

      <Box component="form" role="search" onSubmit={handleSearch} sx={{ my: 2 }}>
        <TextField
          size="small"
          type="search"
          placeholder="Rechercher une actualité…"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          sx={{ width: { xs: '100%', sm: 340 } }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une actualité (titre et contenu), valider avec Entrée' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label={`Actualités — ${filterLabel}${search ? `, recherche « ${search} »` : ''}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={selectedVisible.length > 0 && !allSelected}
                  onChange={toggleAll}
                  disabled={visibleIds.length === 0}
                  slotProps={{ input: { 'aria-label': 'Tout sélectionner' } }}
                />
              </TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Date de publication</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">
                <StarBorderIcon fontSize="small" aria-hidden="true" sx={{ verticalAlign: 'middle' }} />
                <span className="sr-only">Favori</span>
              </TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!news.hydrated ? (
              [0, 1, 2, 3].map((index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton variant="rounded" height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Stack spacing={1} sx={{ alignItems: 'center', py: 5, color: 'text.secondary' }}>
                    {search ? <SearchOffIcon aria-hidden="true" /> : <InboxOutlinedIcon aria-hidden="true" />}
                    <Typography variant="body2">{search ? 'Aucune actualité.' : 'Aucune actualité dans ce filtre.'}</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ article, status }) => {
                const isSelected = selected.includes(article.id);
                return (
                  <TableRow key={article.id} selected={isSelected} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} onChange={() => toggleRow(article.id)} slotProps={{ input: { 'aria-label': `Sélectionner « ${article.title} »` } }} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', width: 40, height: 40, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden', bgcolor: 'action.hover', display: 'grid', placeItems: 'center' }}>
                          {article.thumbnail ? <MediaThumb src={article.thumbnail.url} sizes="40px" /> : <ImageOutlinedIcon fontSize="small" sx={{ color: 'grey.500' }} aria-hidden="true" />}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {article.title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2">{formatLongDate(article.publishedAt)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatRelativeDay(article.publishedAt, today)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <NewsStatusBadge
                        status={status}
                        publishedAt={article.publishedAt}
                        title={article.title}
                        today={today}
                        onPublishNow={() => {
                          news.publishNow([article.id]);
                          news.notify("L'actualité a bien été publiée.");
                        }}
                        onDeactivate={() => {
                          news.deactivate([article.id]);
                          news.notify("L'actualité a bien été mise en inactive.");
                        }}
                        onSchedule={(date) => {
                          news.schedule([article.id], date);
                          news.notify("L'actualité a bien été programmée.");
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={article.favorite ? 'Retirer des favoris' : 'Mettre en favori'}>
                        <IconButton
                          onClick={() => toggleFavorite(article)}
                          aria-label={`${article.favorite ? 'Retirer des favoris' : 'Mettre en favori'} « ${article.title} »`}
                          aria-pressed={article.favorite}
                        >
                          {article.favorite ? <StarIcon sx={{ color: 'warning.main' }} /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.25} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="Modifier">
                          <IconButton component={Link} href={`/dashboard/actualites/edit/${article.id}`} aria-label={`Modifier « ${article.title} »`}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Dupliquer">
                          <IconButton onClick={() => duplicateOne(article)} aria-label={`Dupliquer « ${article.title} »`}>
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            onClick={() => setPendingDelete({ kind: 'single', article })}
                            aria-label={`Supprimer « ${article.title} »`}
                            sx={{ '&:hover, &.Mui-focusVisible': { color: 'error.main' } }}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selected.length > 0 && (
        <NewsBulkBar
          count={selected.length}
          onPublish={() => bulk('publish')}
          onDeactivate={() => bulk('deactivate')}
          onDuplicate={() => bulk('duplicate')}
          onDelete={() => setPendingDelete({ kind: 'bulk', ids: selected })}
          onClose={() => setSelected([])}
        />
      )}

      <NewsDeleteDialog
        open={pendingDelete !== null}
        title={pendingDelete?.kind === 'bulk' ? 'Supprimer la sélection' : 'Supprimer une actualité'}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      >
        {pendingDelete?.kind === 'bulk' ? (
          <>
            Êtes-vous sûr(e) de vouloir supprimer <strong>{plural(pendingDelete.ids.length, 'actualité', 'actualités')}</strong> ?
          </>
        ) : (
          <>
            Êtes-vous sûr(e) de vouloir supprimer l&apos;actualité <strong>{pendingDelete?.article.title}</strong> ?
          </>
        )}
      </NewsDeleteDialog>
    </Box>
  );
}
