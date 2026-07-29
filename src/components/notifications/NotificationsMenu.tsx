'use client';

import { useCallback, useId, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { useNotifications } from '@/components/notifications/NotificationsProvider';

const MAX_VISIBLE_NOTIFICATIONS = 5;

export function NotificationsMenu() {
  const { notifications, unreadCount, markAllAsRead, toggleRead } = useNotifications();
  const popoverId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = anchorEl !== null;

  const closeMenu = useCallback(() => setAnchorEl(null), []);

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    markAllAsRead();
  }

  const visibleNotifications = notifications.slice(0, MAX_VISIBLE_NOTIFICATIONS);

  return (
    <>
      <button
        className="icon-btn"
        type="button"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} non lues` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={handleOpen}
      >
        <Icons.Bell size={18} />
        {unreadCount > 0 && (
          <span className="badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 400, maxWidth: '90vw' } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {visibleNotifications.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucune notification pour le moment.
            </Typography>
          </Box>
        ) : (
          <Box
            component="ul"
            aria-label="Liste des notifications"
            sx={{ listStyle: 'none', m: 0, p: 1, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 420, overflowY: 'auto' }}
          >
            {visibleNotifications.map((notification) => (
              <li key={notification.id}>
                <NotificationCard notification={notification} onToggleRead={toggleRead} onNavigate={closeMenu} dense />
              </li>
            ))}
          </Box>
        )}
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button component={Link} href="/dashboard/notifications" onClick={closeMenu} fullWidth size="small">
            Voir tout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
