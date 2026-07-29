'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  QUESTIONS_MOCK,
  QUESTION_CATEGORIES_SEED,
  QUESTION_STATUS_LABELS,
  type Question,
  type QuestionStatus,
} from '@/types/questionsReponses';

const TAB_ORDER: QuestionStatus[] = ['pending', 'published', 'refused'];

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

function categoryLabel(categoryId: string) {
  return QUESTION_CATEGORIES_SEED.find((category) => category.id === categoryId)?.name ?? 'Sans catégorie';
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function QuestionsList() {
  const [questions] = useState<Question[]>(QUESTIONS_MOCK);
  const [tab, setTab] = useState<QuestionStatus>('pending');
  const [query, setQuery] = useState('');

  const counts = useMemo(
    () => ({
      pending: questions.filter((question) => question.status === 'pending').length,
      published: questions.filter((question) => question.status === 'published').length,
      refused: questions.filter((question) => question.status === 'refused').length,
    }),
    [questions],
  );

  const filteredQuestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return questions.filter((question) => {
      if (question.status !== tab) return false;
      if (trimmed && !question.subject.toLowerCase().includes(trimmed) && !question.participantName.toLowerCase().includes(trimmed)) {
        return false;
      }
      return true;
    });
  }, [questions, tab, query]);

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Questions/réponses
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Retrouvez les questions posées par les habitants et publiez vos réponses.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/dashboard/questions-reponses/parametres"
          variant="outlined"
          color="inherit"
          startIcon={<SettingsOutlinedIcon fontSize="small" />}
        >
          Gérer la page questions/réponses
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: QuestionStatus) => setTab(value)} aria-label="Filtrer les questions" sx={{ minHeight: 44 }}>
          {TAB_ORDER.map((status) => (
            <Tab
              key={status}
              value={status}
              label={<TabLabel text={QUESTION_STATUS_LABELS[status]} count={counts[status]} />}
              sx={{ minHeight: 44, textTransform: 'none' }}
            />
          ))}
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une question…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une question' },
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
        <Table aria-label={`Questions — ${QUESTION_STATUS_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Sujet</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Participant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune question ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question) => {
                return (
                  <TableRow key={question.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{question.subject}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{categoryLabel(question.categoryId)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{question.participantName}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDate(question.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={`Voir « ${question.subject} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/questions-reponses/${question.id}`}
                          size="small"
                          aria-label={`Voir la question « ${question.subject} »`}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
