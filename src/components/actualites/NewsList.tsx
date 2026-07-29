'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { NEWS_ARTICLES, type NewsArticle } from '@/types/actualites';

type TabView = 'published' | 'scheduled' | 'draft' | 'favorites' | 'archived';

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function formatFrLongDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);

  const counts = useMemo(
    () => ({
      all: articles.length,
      published: articles.filter((a) => a.status === 'published').length,
      scheduled: articles.filter((a) => a.status === 'scheduled').length,
      draft: articles.filter((a) => a.status === 'draft').length,
      favorites: articles.filter((a) => a.favorite && a.status !== 'archived').length,
      archived: articles.filter((a) => a.status === 'archived').length,
    }),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (tab === 'archived') {
        if (article.status !== 'archived') return false;
      } else {
        if (article.status === 'archived') return false;
        if (tab === 'favorites' && !article.favorite) return false;
        if (tab !== 'favorites' && article.status !== tab) return false;
      }
      if (trimmed && !article.title.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [articles, tab, query]);

  function toggleFavorite(article: NewsArticle) {
    setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, favorite: !a.favorite } : a)));
  }

  function duplicateArticle(article: NewsArticle) {
    const copy: NewsArticle = { ...article, id: `${article.id}-copie-${Date.now()}`, title: `${article.title} (copie)`, favorite: false };
    setArticles((prev) => [copy, ...prev]);
    setSnackbarMessage(`« ${article.title} » a été dupliquée.`);
  }

  function archiveArticle(article: NewsArticle) {
    setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, status: 'archived' } : a)));
    setSnackbarMessage(`« ${article.title} » a été archivée.`);
  }

  function restoreArticle(article: NewsArticle) {
    setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, status: 'draft' } : a)));
    setSnackbarMessage(`« ${article.title} » a été rétablie en brouillon.`);
  }

  function confirmDelete() {
    if (!articleToDelete) return;
    setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
    setSnackbarMessage(`« ${articleToDelete.title} » a été supprimée définitivement.`);
    setArticleToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Actualités
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {counts.all} actualité{counts.all > 1 ? 's' : ''} — {counts.published} publiée{counts.published > 1 ? 's' : ''},{' '}
            {counts.scheduled} programmée{counts.scheduled > 1 ? 's' : ''}, {counts.draft} brouillon{counts.draft > 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/actualites/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Nouvelle actualité
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les actualités" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text="Publiées" count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text="Programmées" count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text="Brouillons" count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="favorites" label={<TabLabel text="Favorites" count={counts.favorites} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text="Archivées" count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une actualité…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une actualité' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label={`Actualités — ${tab}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Actualité</TableCell>
              <TableCell>Publication</TableCell>
              <TableCell align="center">Favorite</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune actualité ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {article.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatFrLongDate(article.publicationDate)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={article.favorite ? 'Retirer des favorites' : 'Marquer comme favorite'}>
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(article)}
                        aria-label={article.favorite ? `Retirer « ${article.title} » des favorites` : `Marquer « ${article.title} » comme favorite`}
                        aria-pressed={article.favorite}
                      >
                        {article.favorite ? <StarIcon fontSize="small" sx={{ color: 'warning.main' }} /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${article.title} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/actualites/edit/${article.id}`}
                          size="small"
                          aria-label={`Modifier « ${article.title} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {article.status !== 'archived' ? (
                        <>
                          <Tooltip title={`Dupliquer « ${article.title} »`}>
                            <IconButton size="small" onClick={() => duplicateArticle(article)} aria-label={`Dupliquer « ${article.title} »`}>
                              <ContentCopyOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Archiver « ${article.title} »`}>
                            <IconButton size="small" onClick={() => archiveArticle(article)} aria-label={`Archiver « ${article.title} »`}>
                              <Inventory2OutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title={`Rétablir « ${article.title} »`}>
                            <IconButton size="small" onClick={() => restoreArticle(article)} aria-label={`Rétablir « ${article.title} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${article.title} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setArticleToDelete(article)}
                              aria-label={`Supprimer définitivement « ${article.title} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={articleToDelete !== null} onClose={() => setArticleToDelete(null)} aria-labelledby="delete-article-title">
        <DialogTitle id="delete-article-title">Supprimer définitivement « {articleToDelete?.title} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setArticleToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
