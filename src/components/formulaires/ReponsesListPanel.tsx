'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { FormSummary } from '@/types/formulaires';

interface ReponsesListPanelProps {
  forms: FormSummary[];
}

export function ReponsesListPanel({ forms }: ReponsesListPanelProps) {
  if (forms.length === 0) {
    return (
      <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Aucun formulaire pour l’instant.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Table aria-label="Réponses par formulaire">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Nom</TableCell>
            <TableCell>Nouvelles réponses</TableCell>
            <TableCell>Total des réponses</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.map((form) => {
            const newCount = form.responses.filter((response) => response.isNew).length;
            return (
              <TableRow key={form.id}>
                <TableCell sx={{ fontWeight: 700 }}>{form.name}</TableCell>
                <TableCell>
                  {newCount > 0 ? (
                    <Chip size="small" label={`${newCount} nouvelle${newCount > 1 ? 's' : ''}`} color="secondary" sx={{ fontWeight: 700 }} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucune
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{form.responses.length}</TableCell>
                <TableCell align="right">
                  <IconButton
                    component={Link}
                    href={`/dashboard/formulaires/${form.id}/reponses`}
                    size="small"
                    aria-label={`Voir les réponses de « ${form.name} »`}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
