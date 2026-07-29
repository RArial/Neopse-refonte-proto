'use client';

import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface AttachmentsFieldProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  addLabel?: string;
}

export function AttachmentsField({ attachments, onChange, addLabel = "Ajouter une pièce jointe" }: AttachmentsFieldProps) {
  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;
    const added = Array.from(selected).map((file) => ({ id: randomId('attachment'), name: file.name, url: URL.createObjectURL(file) }));
    onChange([...attachments, ...added]);
    event.target.value = '';
  }

  function removeAttachment(id: string) {
    onChange(attachments.filter((attachment) => attachment.id !== id));
  }

  return (
    <Stack spacing={1.5}>
      <Button type="button" component="label" variant="outlined" color="inherit" startIcon={<AttachFileIcon fontSize="small" />} sx={{ alignSelf: 'flex-start' }}>
        {addLabel}
        <input type="file" multiple hidden onChange={handleFilesSelected} />
      </Button>

      {attachments.length > 0 && (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {attachments.map((attachment) => (
            <Box
              key={attachment.id}
              component="li"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.75, borderRadius: 1, bgcolor: 'action.hover' }}
            >
              <Typography variant="body2" noWrap sx={{ maxWidth: 400 }}>
                {attachment.name}
              </Typography>
              <IconButton aria-label={`Retirer la pièce jointe ${attachment.name}`} size="small" onClick={() => removeAttachment(attachment.id)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
}
