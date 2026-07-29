'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import { formatRelativeTime } from '@/lib/personnalisation/relativeTime';
import { NOTIFICATION_CATEGORIES, type NotificationItem } from '@/types/notification';

interface NotificationCardProps {
  notification: NotificationItem;
  onToggleRead: (id: string) => void;
  onNavigate?: () => void;
  dense?: boolean;
}

export function NotificationCard({ notification, onToggleRead, onNavigate, dense = false }: NotificationCardProps) {
  const category = NOTIFICATION_CATEGORIES[notification.category];
  const CategoryIcon = Icons[category.icon];
  const avatarSize = dense ? 32 : 40;

  const content = (
    <>
      <Box
        aria-hidden="true"
        sx={{
          width: avatarSize,
          height: avatarSize,
          flex: `0 0 ${avatarSize}px`,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: category.colorSoft,
          color: category.colorDeep,
        }}
      >
        <CategoryIcon size={dense ? 16 : 18} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant={dense ? 'body2' : 'subtitle2'} sx={{ fontWeight: notification.read ? 400 : 700 }}>
          {notification.title}
          <Typography component="span" sx={{ color: category.colorDeep, fontWeight: 700, fontSize: 'inherit' }}>
            {' — '}
            {category.label}
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
          {formatRelativeTime(notification.date)}
        </Typography>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: dense ? 1.5 : 2,
        pr: dense ? 6 : 7,
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '3px solid',
        borderLeftColor: category.color,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      {notification.href ? (
        <Box
          component={Link}
          href={notification.href}
          onClick={onNavigate}
          sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}
        >
          {content}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: 0 }}>{content}</Box>
      )}
      <Tooltip title={notification.read ? 'Marquer comme non lue' : 'Marquer comme lue'}>
        <IconButton
          size="small"
          aria-label={`Marquer « ${notification.title} » comme ${notification.read ? 'non lue' : 'lue'}`}
          onClick={() => onToggleRead(notification.id)}
          sx={{ position: 'absolute', top: dense ? 8 : 12, right: dense ? 8 : 12 }}
        >
          <Icons.Eye size={dense ? 16 : 18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
