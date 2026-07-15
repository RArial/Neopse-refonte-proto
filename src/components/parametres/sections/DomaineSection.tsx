'use client';

import { useId, useState, type FormEvent } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import { EditDomainDialog } from '@/components/parametres/sections/EditDomainDialog';
import type { DomainPriority, DomainRecord, DomainSource } from '@/types/parametres';

interface DomaineSectionProps {
  domains: DomainRecord[];
  onAddDomain: (domain: DomainRecord) => void;
  onEditDomain: (id: string, address: string) => void;
}

const STATUS_LABEL: Record<DomainRecord['status'], string> = {
  actif: 'Actif',
  en_attente: 'En attente de validation',
  expire: 'Expiré',
};

const STATUS_COLOR: Record<DomainRecord['status'], 'success' | 'warning' | 'error'> = {
  actif: 'success',
  en_attente: 'warning',
  expire: 'error',
};

const PRIORITY_LABEL: Record<DomainPriority, string> = {
  principal: 'Principal',
  redirection: 'Redirection',
};

const DNS_ZONE_RECORDS = '@ 10800 IN A 46.105.156.177\nwww 10800 IN A 46.105.156.177';

interface TldOption {
  code: string;
  price: number;
  description: string;
}

const TLD_OPTIONS: TldOption[] = [
  { code: '.alsace', price: 60, description: 'Extension régionale identifiant l’Alsace.' },
  { code: '.biz', price: 40, description: 'Extension générique orientée usage professionnel.' },
  { code: '.bzh', price: 60, description: 'Extension régionale identifiant la Bretagne.' },
  { code: '.club', price: 40, description: 'Extension générique pour communautés et clubs.' },
  { code: '.com', price: 35, description: 'Extension générique internationale la plus répandue.' },
  { code: '.company', price: 40, description: 'Extension générique pour les entreprises.' },
  { code: '.design', price: 60, description: 'Extension générique dédiée aux métiers du design.' },
  { code: '.eu', price: 35, description: 'Extension réservée à l’Union européenne.' },
  { code: '.expert', price: 60, description: 'Extension générique pour les professionnels experts.' },
  { code: '.fr', price: 35, description: 'Extension nationale française.' },
  { code: '.gf', price: 300, description: 'Extension nationale de la Guyane.' },
  { code: '.gp', price: 300, description: 'Extension nationale de la Guadeloupe.' },
  { code: '.info', price: 40, description: 'Extension générique pour les sites d’information.' },
  { code: '.mq', price: 300, description: 'Extension nationale de la Martinique.' },
  { code: '.net', price: 35, description: 'Extension générique historiquement liée aux réseaux.' },
  { code: '.online', price: 60, description: 'Extension générique pour la présence en ligne.' },
  { code: '.org', price: 35, description: 'Extension générique pour les organisations.' },
  { code: '.pro', price: 40, description: 'Extension générique réservée aux professionnels.' },
  { code: '.re', price: 60, description: 'Extension nationale de La Réunion.' },
  { code: '.site', price: 40, description: 'Extension générique généraliste pour tout site web.' },
  { code: '.xyz', price: 40, description: 'Extension générique polyvalente.' },
  { code: '.yt', price: 60, description: 'Extension nationale de Mayotte.' },
];

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function oneYearFromNowIso() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export function DomaineSection({ domains, onAddDomain, onEditDomain }: DomaineSectionProps) {
  const [adding, setAdding] = useState(false);
  const [source, setSource] = useState<DomainSource>('neopse');
  const [prefix, setPrefix] = useState('');
  const [extension, setExtension] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<DomainPriority>('redirection');
  const [editingDomain, setEditingDomain] = useState<DomainRecord | null>(null);
  const formId = useId();

  function resetForm() {
    setSource('neopse');
    setPrefix('');
    setExtension('');
    setAddress('');
    setPriority('redirection');
    setAdding(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (source === 'neopse') {
      if (!prefix.trim() || !extension) return;

      onAddDomain({
        id: `dom-${Date.now()}`,
        address: `${prefix.trim()}${extension}`,
        registrar: 'NEOPSE (Intégré)',
        expiresAt: oneYearFromNowIso(),
        status: 'en_attente',
        priority,
      });
    } else {
      if (!address.trim()) return;

      onAddDomain({
        id: `dom-${Date.now()}`,
        address: address.trim(),
        registrar: 'Externe',
        expiresAt: oneYearFromNowIso(),
        status: 'en_attente',
        priority,
      });
    }

    resetForm();
  }

  return (
    <Stack spacing={2.5}>
      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small" aria-label="Noms de domaine associés au site">
          <TableHead>
            <TableRow>
              <TableCell>Adresse URL</TableCell>
              <TableCell>Source d&apos;enregistrement</TableCell>
              <TableCell>Date d&apos;expiration</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Priorité</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell sx={{ fontWeight: 600 }}>{domain.address}</TableCell>
                <TableCell>{domain.registrar}</TableCell>
                <TableCell>{formatDate(domain.expiresAt)}</TableCell>
                <TableCell>
                  <Chip size="small" label={STATUS_LABEL[domain.status]} color={STATUS_COLOR[domain.status]} variant="outlined" />
                </TableCell>
                <TableCell>{PRIORITY_LABEL[domain.priority]}</TableCell>
                <TableCell align="right">
                  <Tooltip title={`Modifier ${domain.address}`}>
                    <IconButton
                      size="small"
                      aria-label={`Modifier le nom de domaine ${domain.address}`}
                      onClick={() => setEditingDomain(domain)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditDomainDialog
        open={editingDomain !== null}
        domain={editingDomain}
        onClose={() => setEditingDomain(null)}
        onConfirm={onEditDomain}
      />

      {adding ? (
        <Box component="form" id={formId} onSubmit={handleSubmit} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Informations générales concernant le nom de domaine
            </Typography>
          </Box>

          <Stack spacing={2.5} sx={{ p: 2.5 }}>
            <FormControl component="fieldset">
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
                  Source d&apos;enregistrement du nom de domaine
                </FormLabel>
                <Tooltip title="NEOPSE héberge et configure automatiquement le domaine. Externe correspond à un domaine déjà enregistré chez un autre bureau d'enregistrement (OVH, Gandi…).">
                  <IconButton size="small" aria-label="Informations sur la source d'enregistrement du nom de domaine" sx={{ p: 0.25 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <RadioGroup
                row
                aria-label="Source d'enregistrement du nom de domaine"
                value={source}
                onChange={(event) => setSource(event.target.value as DomainSource)}
              >
                <FormControlLabel value="neopse" control={<Radio />} label="NEOPSE" />
                <FormControlLabel value="externe" control={<Radio />} label="Externe" />
              </RadioGroup>
            </FormControl>

            {source === 'neopse' ? (
              <Box>
                <Box sx={{ px: 2, py: 1, mb: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Source d&apos;enregistrement NEOPSE
                  </Typography>
                </Box>

                <Alert severity="info" icon={<InfoOutlinedIcon fontSize="inherit" />} sx={{ mb: 2.5 }}>
                  Mon site Internet est actuellement rattaché au « PACK FREE ». Je peux donc ajouter un nom de domaine à
                  mon site en le commandant selon le tarif affiché (par extension).
                </Alert>

                <TextField
                  label="Préfixe du nom de domaine"
                  value={prefix}
                  onChange={(event) => setPrefix(event.target.value)}
                  placeholder="mairie-neopse"
                  required
                  fullWidth
                  size="small"
                  sx={{ mb: 2.5 }}
                />

                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Extension du nom de domaine
                  </FormLabel>
                  <RadioGroup
                    aria-label="Extension du nom de domaine"
                    value={extension}
                    onChange={(event) => setExtension(event.target.value)}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      columnGap: 2,
                      rowGap: 0.5,
                    }}
                  >
                    {TLD_OPTIONS.map((tld) => (
                      <Stack key={tld.code} direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
                        <FormControlLabel
                          value={tld.code}
                          control={<Radio size="small" />}
                          label={`${tld.code} (${currencyFormatter.format(tld.price)})`}
                        />
                        <Tooltip title={tld.description}>
                          <IconButton
                            size="small"
                            aria-label={`Informations sur l'extension ${tld.code}`}
                            sx={{ p: 0.25 }}
                          >
                            <InfoOutlinedIcon fontSize="small" color="action" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : (
              <Box>
                <Box sx={{ px: 2, py: 1, mb: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Source d&apos;enregistrement externe
                  </Typography>
                </Box>

                <Alert severity="info" icon={<InfoOutlinedIcon fontSize="inherit" />} sx={{ mb: 2.5 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Pour ajouter un nom de domaine géré par un bureau d&apos;enregistrement externe, il est nécessaire de
                    modifier préalablement les paramètres suivants dans sa « zone DNS » :
                  </Typography>
                  <Box
                    component="pre"
                    sx={{ m: 0, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', overflowX: 'auto' }}
                  >
                    {DNS_ZONE_RECORDS}
                  </Box>
                </Alert>

                <TextField
                  label="Nom de domaine"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="www.exemple.fr"
                  required
                  fullWidth
                  size="small"
                  helperText="Renseignez le domaine dont la zone DNS a été mise à jour ci-dessus. Sa date d'expiration sera récupérée automatiquement après vérification."
                />
              </Box>
            )}

            <TextField
              select
              label="Priorité"
              value={priority}
              onChange={(event) => setPriority(event.target.value as DomainPriority)}
              fullWidth
              size="small"
            >
              <MenuItem value="principal">Principal</MenuItem>
              <MenuItem value="redirection">Redirection</MenuItem>
            </TextField>

            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button type="button" variant="outlined" color="inherit" onClick={resetForm}>
                Retour
              </Button>
              <Button type="submit" variant="contained">
                {source === 'externe' ? 'Je vérifie les paramètres DNS' : 'Je vérifie la disponibilité'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Button
          type="button"
          variant="outlined"
          startIcon={<Icons.Plus size={16} />}
          onClick={() => setAdding(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Ajouter un nom de domaine
        </Button>
      )}
    </Stack>
  );
}
