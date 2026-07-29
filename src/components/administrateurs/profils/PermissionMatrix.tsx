'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import { PERMISSION_GROUPS, RIGHT_LABEL, RIGHT_ORDER, type PermissionGrants, type PermissionRight } from '@/types/profils';

interface PermissionMatrixProps {
  grants: PermissionGrants;
  onToggle: (moduleId: string, right: PermissionRight, checked: boolean) => void;
}

export function PermissionMatrix({ grants, onToggle }: PermissionMatrixProps) {
  return (
    <Stack spacing={2.5}>
      {PERMISSION_GROUPS.map((group) => {
        const IconEl = Icons[group.icon];
        return (
          <Paper key={group.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: 'center', px: 2.5, py: 1.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
            >
              {IconEl && <IconEl size={16} />}
              <Typography component="h2" sx={{ fontWeight: 700, fontSize: 14 }}>
                {group.label}
              </Typography>
            </Stack>
            <Table size="small" aria-label={`Droits — ${group.label}`}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '40%' }}>Nom du module</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Droits du module</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.modules.map((module) => {
                  const moduleGrants = grants[module.id] ?? [];
                  return (
                    <TableRow key={module.id}>
                      <TableCell sx={{ verticalAlign: 'middle' }}>{module.label}</TableCell>
                      <TableCell>
                        {module.lockedNote ? (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block' }}>
                            {module.lockedNote}
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2.5, rowGap: 0 }}>
                            {RIGHT_ORDER.filter((right) => module.rights.includes(right)).map((right) => (
                              <FormControlLabel
                                key={right}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={moduleGrants.includes(right)}
                                    onChange={(event) => onToggle(module.id, right, event.target.checked)}
                                  />
                                }
                                label={<Typography variant="body2">{RIGHT_LABEL[right]}</Typography>}
                                sx={{ mr: 0 }}
                              />
                            ))}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        );
      })}
    </Stack>
  );
}
