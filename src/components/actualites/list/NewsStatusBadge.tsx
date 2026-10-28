'use client';

import { useId, useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
import { addDaysIso, formatShortDate } from '@/lib/actualites/dates';
import type { NewsStatus } from '@/types/actualites';

type PaletteKey = 'success' | 'warning' | 'grey';

const STATUS_META: Record<NewsStatus, { label: string; palette: PaletteKey }> = {
  published: { label: 'Publiée', palette: 'success' },
  scheduled: { label: 'Programmée', palette: 'warning' },
  inactive: { label: 'Inactive', palette: 'grey' },
};

interface NewsStatusBadgeProps {
  status: NewsStatus;
  publishedAt: string;
  title: string;
  today: string;
  onPublishNow: () => void;
  onDeactivate: () => void;
  onSchedule: (date: string) => void;
}

export function NewsStatusBadge({ status, publishedAt, title, today, onPublishNow, onDeactivate, onSchedule }: NewsStatusBadgeProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const tomorrow = addDaysIso(today, 1);
  const [scheduleDate, setScheduleDate] = useState(tomorrow);
  const dateId = useId();
  const meta = STATUS_META[status];
  const label = status === 'scheduled' ? `${meta.label} · ${formatShortDate(publishedAt)}` : meta.label;
  const scheduleValid = scheduleDate >= tomorrow;

  function close() {
    setAnchorEl(null);
  }

  return (
    <>
      <ButtonBase
        onClick={(event) => {
          setScheduleDate(tomorrow);
          setAnchorEl(event.currentTarget);
        }}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        aria-label={`Statut : ${label}. Modifier le statut de « ${title} »`}
        sx={(theme) => {
          const tone = meta.palette === 'grey' ? theme.palette.grey[600] : theme.palette[meta.palette].main;
          return {
            gap: 0.75,
            minHeight: 32,
            px: 1.25,
            borderRadius: 4,
            border: '1px solid',
            borderColor: alpha(tone, 0.5),
            bgcolor: alpha(tone, 0.1),
            color: 'text.primary',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: alpha(tone, 0.18) },
            '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          };
        }}
      >
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: meta.palette === 'grey' ? theme.palette.grey[600] : theme.palette[meta.palette].main,
          })}
        />
        {label}
        <ExpandMoreIcon sx={{ fontSize: 18 }} aria-hidden="true" />
      </ButtonBase>

      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { minWidth: 280, mt: 0.5 } } }}
      >
        <MenuList autoFocusItem dense aria-label={`Statut de « ${title} »`}>
          <MenuItem
            onClick={() => {
              onPublishNow();
              close();
            }}
          >
            <ListItemIcon>
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Publier maintenant</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDeactivate();
              close();
            }}
          >
            <ListItemIcon>
              <RemoveCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mettre en inactive</ListItemText>
          </MenuItem>
        </MenuList>
        <Divider />
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Typography component="label" htmlFor={dateId} variant="caption" sx={{ display: 'block', fontWeight: 700, letterSpacing: '.06em', color: 'text.secondary', mb: 1 }}>
            PROGRAMMER
          </Typography>
          <TextField
            id={dateId}
            type="date"
            size="small"
            fullWidth
            value={scheduleDate}
            onChange={(event) => setScheduleDate(event.target.value)}
            error={!scheduleValid}
            helperText={scheduleValid ? undefined : 'Choisissez une date à partir de demain.'}
            slotProps={{ htmlInput: { min: tomorrow } }}
          />
          <Button
            fullWidth
            size="small"
            variant="contained"
            disabled={!scheduleValid}
            sx={{ mt: 1.5 }}
            onClick={() => {
              onSchedule(scheduleDate);
              close();
            }}
          >
            Programmer à cette date
          </Button>
        </Box>
      </Popover>
    </>
  );
}
