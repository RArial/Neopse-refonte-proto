'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import type { ContrastIssue } from '@/types/personnalisation';

interface ContrastWarningsProps {
  issues: ContrastIssue[];
}

export function ContrastWarnings({ issues }: ContrastWarningsProps) {
  const { resetToAuto, focusContrastIssue } = usePersonnalisation();
  const [open, setOpen] = useState(true);

  if (issues.length === 0) return null;

  return (
    <Alert
      severity="warning"
      variant="outlined"
      icon={false}
      sx={{ py: 0.5, '& .MuiAlert-message': { width: '100%', overflow: 'visible' } }}
      action={
        <IconButton
          size="small"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Réduire les avertissements de contraste' : 'Afficher les avertissements de contraste'}
        >
          <ExpandMoreIcon fontSize="small" sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </IconButton>
      }
    >
      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
        {issues.length} problème{issues.length > 1 ? 's' : ''} de contraste (RGAA)
      </Typography>
      <Collapse in={open}>
        <Stack sx={{ mt: 0.5 }}>
          {issues.map((issue, index) => (
            <Stack
              key={`${issue.section}-${issue.propertyKey}`}
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.75,
                borderTop: index === 0 ? 'none' : '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => focusContrastIssue(issue)}
                sx={{
                  minWidth: 0,
                  flex: 1,
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  '&:hover [data-label]': { textDecoration: 'underline' },
                }}
              >
                <Typography
                  data-label
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={`${issue.sectionLabel} — ${issue.propertyLabel}`}
                >
                  {issue.sectionLabel} — {issue.propertyLabel}
                </Typography>
                <Typography variant="caption" color={issue.severity === 'critical' ? 'error' : 'text.secondary'} sx={{ display: 'block' }}>
                  {issue.ratio.toFixed(2)}:1 {issue.severity === 'critical' ? '· très insuffisant' : '· < 4.5:1 requis'}
                </Typography>
              </Box>
              {issue.canResetToAuto && (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<RestartAltIcon fontSize="small" />}
                  onClick={() => resetToAuto(issue.section, issue.propertyKey)}
                  sx={{ flexShrink: 0 }}
                >
                  Auto
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Alert>
  );
}
