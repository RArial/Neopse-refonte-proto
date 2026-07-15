'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TEMPLATES } from '@/lib/personnalisation/templates';
import { TemplateGalleryThumbnail } from '@/components/personnalisation/TemplateGalleryThumbnail';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function TemplateGrid() {
  const { draftTemplateId, setTemplate } = usePersonnalisation();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
      {TEMPLATES.map((template) => {
        const selected = template.id === draftTemplateId;
        return (
          <ButtonBase
            key={template.id}
            onClick={() => setTemplate(template.id)}
            aria-pressed={selected}
            sx={{ display: 'block', textAlign: 'left', borderRadius: 2 }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                borderRadius: 2,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? 'primary.main' : 'divider',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  width: '100%',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 1,
                }}
              >
                <TemplateGalleryThumbnail template={template} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {template.name}
              </Typography>
            </Paper>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
