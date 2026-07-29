'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Icons, type IconName } from '@/components/ui/Icons';
import { EventSection } from '@/components/agenda/EventSection';
import { InformationsGeneralesSection } from '@/components/agenda/sections/InformationsGeneralesSection';
import { VignetteSection } from '@/components/agenda/sections/VignetteSection';
import { DatesHorairesSection } from '@/components/agenda/sections/DatesHorairesSection';
import { LocalisationSection } from '@/components/agenda/sections/LocalisationSection';
import { OrganisateurSection } from '@/components/agenda/sections/OrganisateurSection';
import { DiaporamaSection } from '@/components/agenda/sections/DiaporamaSection';
import { VideoSection } from '@/components/agenda/sections/VideoSection';
import { PiecesJointesSection } from '@/components/agenda/sections/PiecesJointesSection';
import { CodeHtmlSection } from '@/components/agenda/sections/CodeHtmlSection';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_EVENT_FORM, type AgendaEvent, type EventFormData, type EventStatus } from '@/types/agenda';

interface SectionConfig {
  id: string;
  icon: IconName;
  navLabel: string;
  title: string;
}

const ESSENTIAL_SECTIONS: SectionConfig[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales', title: "Informations générales concernant l'événement" },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette', title: "Vignette de l'événement" },
  { id: 'dates-horaires', icon: 'Calendar', navLabel: 'Dates et horaires', title: "Dates et horaires de l'événement" },
  { id: 'localisation', icon: 'MapPin', navLabel: 'Localisation', title: "Localisation de l'événement" },
];

const COMPLEMENTARY_SECTIONS: SectionConfig[] = [
  { id: 'organisateur', icon: 'Users', navLabel: 'Organisateur', title: "Organisateur de l'événement" },
  { id: 'diaporama', icon: 'Layers', navLabel: "Diaporama d'images", title: "Diaporama d'images" },
  { id: 'video', icon: 'Play', navLabel: 'Vidéo', title: 'Vidéo' },
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes', title: 'Pièces jointes' },
  { id: 'code-html', icon: 'Code', navLabel: 'Code HTML', title: 'Code HTML' },
];

const ALL_SECTIONS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS];

const STATUS_CHIP_META: Record<EventStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

function buildInitialData(initialEvent?: AgendaEvent): EventFormData {
  if (initialEvent) {
    return {
      ...DEFAULT_EVENT_FORM,
      name: initialEvent.name,
      dateStart: initialEvent.dateStart,
      dateEnd: initialEvent.dateEnd ?? '',
      publicationDate: initialEvent.publicationDate,
      status: initialEvent.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_EVENT_FORM, name: copyName } : DEFAULT_EVENT_FORM;
}

function SommaireItem({ section, active, onClick }: { section: SectionConfig; active: boolean; onClick: () => void }) {
  const IconEl = Icons[section.icon];
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        border: 0,
        bgcolor: 'transparent',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        color: active ? 'text.primary' : 'text.secondary',
        fontWeight: active ? 700 : 500,
        fontSize: 13.5,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      {IconEl && <IconEl size={15} />}
      <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {section.navLabel}
      </Box>
      <Box
        aria-hidden="true"
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: active ? 'primary.main' : 'transparent',
          border: active ? 'none' : '1.5px solid',
          borderColor: 'divider',
        }}
      />
    </Box>
  );
}

interface EventFormProps {
  mode: 'create' | 'edit';
  initialEvent?: AgendaEvent;
}

export function EventForm({ mode, initialEvent }: EventFormProps) {
  const router = useRouter();
  const [data, setData] = useState<EventFormData>(() => buildInitialData(initialEvent));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ESSENTIAL_SECTIONS.forEach((section) => { initial[section.id] = true; });
    COMPLEMENTARY_SECTIONS.forEach((section) => { initial[section.id] = false; });
    return initial;
  });
  const [activeSectionId, setActiveSectionId] = useState(ESSENTIAL_SECTIONS[0].id);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef, railSx } = useStickyFormLayout();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const id = topMost.target.getAttribute('data-section-id');
        if (id) setActiveSectionId(id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    );
    ALL_SECTIONS.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function handleChange(patch: Partial<EventFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleNavClick(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: true }));
    setActiveSectionId(id);
    requestAnimationFrame(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function notify(message: string) {
    setSuccessMessage(message);
  }

  function commit(status: EventStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      handleNavClick('informations-generales');
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/agenda'), 1400);
  }

  function renderSection(section: SectionConfig, children: ReactNode) {
    return (
      <Box
        key={section.id}
        ref={(el: HTMLDivElement | null) => {
          sectionRefs.current[section.id] = el;
        }}
        data-section-id={section.id}
      >
        <EventSection
          id={section.id}
          icon={section.icon}
          title={section.title}
          expanded={Boolean(expanded[section.id])}
          onToggle={(value) => setExpanded((prev) => ({ ...prev, [section.id]: value }))}
        >
          {children}
        </EventSection>
      </Box>
    );
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvel événement' : data.name || "Modifier l'événement";

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1400, width: '100%', mx: 'auto' }}>
      <Stack
        ref={headerRef}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          mb: 2,
          pt: 1,
          pb: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Button
            component={Link}
            href="/dashboard/agenda"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour à l&apos;agenda
          </Button>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              {pageTitle}
            </Typography>
            {(mode === 'edit' || isDuplicate) && (
              <Chip size="small" label={statusChip.label.toUpperCase()} color={statusChip.color} variant="outlined" sx={{ fontWeight: 700 }} />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={() => notify("Aperçu de l'événement — bientôt disponible.")}
          >
            Aperçu
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={() => commit('draft')}>
            Enregistrer le brouillon
          </Button>
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={() => commit('published')}>
            Publier l&apos;événement
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 2, ...railSx }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
            <Typography
              variant="overline"
              sx={{ display: 'block', px: 1, color: 'text.disabled', fontWeight: 700, letterSpacing: '.08em' }}
            >
              Sommaire
            </Typography>

            <Typography
              variant="caption"
              sx={{ display: 'block', px: 1, mt: 1.5, mb: 0.5, color: 'text.disabled', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}
            >
              Essentiel
            </Typography>
            <Stack component="nav" aria-label="Sections essentielles" spacing={0.25}>
              {ESSENTIAL_SECTIONS.map((section) => (
                <SommaireItem key={section.id} section={section} active={activeSectionId === section.id} onClick={() => handleNavClick(section.id)} />
              ))}
            </Stack>

            <Typography
              variant="caption"
              sx={{ display: 'block', px: 1, mt: 2, mb: 0.5, color: 'text.disabled', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}
            >
              Complémentaire
            </Typography>
            <Stack component="nav" aria-label="Sections complémentaires" spacing={0.25}>
              {COMPLEMENTARY_SECTIONS.map((section) => (
                <SommaireItem key={section.id} section={section} active={activeSectionId === section.id} onClick={() => handleNavClick(section.id)} />
              ))}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
              <Icons.Eye size={16} />
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Affichage</Typography>
            </Stack>
            <TextField
              label="Date de publication"
              type="date"
              value={data.publicationDate}
              onChange={(event) => handleChange({ publicationDate: event.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Paper>
        </Box>

        <Stack spacing={2}>
          {renderSection(
            ESSENTIAL_SECTIONS[0],
            <InformationsGeneralesSection data={data} onChange={handleChange} />,
          )}
          {nameError && (
            <Alert severity="error" role="alert" sx={{ mt: -1 }}>
              Le nom de l&apos;événement est obligatoire.
            </Alert>
          )}
          {renderSection(ESSENTIAL_SECTIONS[1], <VignetteSection data={data} onChange={handleChange} />)}
          {renderSection(ESSENTIAL_SECTIONS[2], <DatesHorairesSection data={data} onChange={handleChange} />)}
          {renderSection(ESSENTIAL_SECTIONS[3], <LocalisationSection data={data} onChange={handleChange} />)}

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pt: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              Informations complémentaires
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Stack>

          {renderSection(COMPLEMENTARY_SECTIONS[0], <OrganisateurSection data={data} onChange={handleChange} />)}
          {renderSection(COMPLEMENTARY_SECTIONS[1], <DiaporamaSection data={data} onChange={handleChange} onNotify={notify} />)}
          {renderSection(COMPLEMENTARY_SECTIONS[2], <VideoSection data={data} onChange={handleChange} />)}
          {renderSection(COMPLEMENTARY_SECTIONS[3], <PiecesJointesSection onNotify={notify} />)}
          {renderSection(COMPLEMENTARY_SECTIONS[4], <CodeHtmlSection data={data} onChange={handleChange} />)}
        </Stack>
      </Box>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
