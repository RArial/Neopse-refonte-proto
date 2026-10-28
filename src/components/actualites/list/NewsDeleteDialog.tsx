'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface NewsDeleteDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export function NewsDeleteDialog({ open, title, children, onCancel, onConfirm }: NewsDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="news-delete-title" aria-describedby="news-delete-text" maxWidth="xs" fullWidth>
      <Box sx={{ display: 'grid', placeItems: 'center', pt: 3 }} aria-hidden="true">
        <Box sx={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'error.main', color: 'error.contrastText' }}>
          <DeleteOutlinedIcon />
        </Box>
      </Box>
      <DialogTitle id="news-delete-title" sx={{ textAlign: 'center', fontWeight: 700 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="news-delete-text" sx={{ textAlign: 'center' }}>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 1, px: 3, pb: 3 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel} autoFocus>
          J&apos;annule
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Je confirme
        </Button>
      </DialogActions>
    </Dialog>
  );
}
