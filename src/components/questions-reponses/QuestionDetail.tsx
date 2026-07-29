'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { AcceptQuestionDialog } from '@/components/questions-reponses/AcceptQuestionDialog';
import { RefuseQuestionDialog } from '@/components/questions-reponses/RefuseQuestionDialog';
import { RichTextField } from '@/components/ui/RichTextField';
import { QUESTION_CATEGORIES_SEED, QUESTION_STATUS_LABELS, type Question, type QuestionStatus } from '@/types/questionsReponses';

const STATUS_CHIP_META: Record<QuestionStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  pending: { label: QUESTION_STATUS_LABELS.pending, color: 'warning' },
  published: { label: QUESTION_STATUS_LABELS.published, color: 'success' },
  refused: { label: QUESTION_STATUS_LABELS.refused, color: 'default' },
};

function categoryLabel(categoryId: string) {
  return QUESTION_CATEGORIES_SEED.find((category) => category.id === categoryId)?.name ?? 'Sans catégorie';
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: 'pre-wrap' }}>
        {value}
      </Typography>
    </Box>
  );
}

interface QuestionDetailProps {
  question: Question;
}

export function QuestionDetail({ question: initialQuestion }: QuestionDetailProps) {
  const router = useRouter();
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [refuseOpen, setRefuseOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const statusChip = STATUS_CHIP_META[question.status];
  const isPending = question.status === 'pending';

  function handleAccept(data: { publicAnswer: string; responderName: string; responderFunction: string }) {
    setQuestion((prev) => ({ ...prev, status: 'published', refusalReason: '', ...data }));
    setAcceptOpen(false);
    setSuccessMessage(`« ${question.subject} » a été publiée avec sa réponse.`);
    window.setTimeout(() => router.push('/dashboard/questions-reponses'), 1400);
  }

  function handleRefuse(refusalReason: string) {
    setQuestion((prev) => ({ ...prev, status: 'refused', refusalReason }));
    setRefuseOpen(false);
    setSuccessMessage(`« ${question.subject} » a été refusée.`);
    window.setTimeout(() => router.push('/dashboard/questions-reponses'), 1400);
  }

  return (
    <Box component="section" sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 2, md: 3.5 },
          py: 1.5,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ maxWidth: 880, mx: 'auto', alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Typography variant="body2" color="text.secondary">
            {isPending ? 'Cette question est en attente de traitement.' : `Décision prise : ${statusChip.label.toLowerCase()}.`}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseOutlinedIcon fontSize="small" />}
              onClick={() => setRefuseOpen(true)}
              disabled={!isPending}
            >
              Refuser la question
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckOutlinedIcon fontSize="small" />}
              onClick={() => setAcceptOpen(true)}
              disabled={!isPending}
            >
              Accepter la question
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 16 }} />} aria-label="Fil d'Ariane" sx={{ mb: 1.5, fontSize: 13 }}>
          <Link component={NextLink} href="/dashboard/questions-reponses" underline="hover" color="text.secondary">
            Questions/réponses
          </Link>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {question.subject}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {question.subject}
          </Typography>
          <Chip size="small" label={statusChip.label} color={statusChip.color} variant="outlined" sx={{ fontWeight: 600 }} />
        </Stack>

        <Stack
          spacing={2.5}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, md: 2.5 }, mb: 2.5 }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <DetailField label="Catégorie" value={categoryLabel(question.categoryId)} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DetailField label="Date de réception" value={formatDate(question.createdAt)} />
            </Box>
          </Stack>
          <DetailField label="Sujet" value={question.subject} />
          <DetailField label="Message" value={question.message} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <DetailField label="Nom du participant" value={question.participantName} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DetailField label="Adresse e-mail" value={question.participantEmail} />
            </Box>
          </Stack>
        </Stack>

        {question.status === 'published' && (
          <Stack spacing={1.5} sx={{ border: '1px solid', borderColor: 'success.main', borderRadius: 2, p: { xs: 2, md: 2.5 } }}>
            <RichTextField label="Réponse publique" value={question.publicAnswer} readOnly />
            <Typography variant="body2" color="text.secondary">
              {question.responderName}
              {question.responderFunction ? ` — ${question.responderFunction}` : ''}
            </Typography>
          </Stack>
        )}

        {question.status === 'refused' && (
          <Stack spacing={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, md: 2.5 } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Motif de refus
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {question.refusalReason}
            </Typography>
          </Stack>
        )}
      </Box>

      <AcceptQuestionDialog
        open={acceptOpen}
        questionSubject={question.subject}
        onClose={() => setAcceptOpen(false)}
        onConfirm={handleAccept}
      />
      <RefuseQuestionDialog
        open={refuseOpen}
        questionSubject={question.subject}
        onClose={() => setRefuseOpen(false)}
        onConfirm={handleRefuse}
      />

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
