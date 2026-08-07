'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { FormSummary } from '@/types/formulaires';

interface FormulairesListPanelProps {
  forms: FormSummary[];
}

export function FormulairesListPanel({ forms }: FormulairesListPanelProps) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <Button component={Link} href="/dashboard/formulaires/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Créer un formulaire
        </Button>
      </Stack>

      {forms.length === 0 ? (
        <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Aucun formulaire pour l’instant.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table aria-label="Liste des formulaires">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>Nom</TableCell>
                <TableCell>Champs</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{form.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{form.fieldsCount} champs</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={form.status === 'published' ? 'Actif' : 'Brouillon'}
                      color={form.status === 'published' ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton component={Link} href={`/dashboard/formulaires/${form.id}`} size="small" aria-label={`Modifier « ${form.name} »`}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
