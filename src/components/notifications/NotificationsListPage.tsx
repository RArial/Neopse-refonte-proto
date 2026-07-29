'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { useNotifications } from '@/components/notifications/NotificationsProvider';

export function NotificationsListPage() {
  const { notifications, toggleRead } = useNotifications();

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Toutes les notifications
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Retrouvez l&apos;historique complet de vos notifications.
        </Typography>
      </Box>

      {notifications.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Aucune notification pour le moment.
          </Typography>
        </Box>
      ) : (
        <Box
          component="ul"
          aria-label="Liste de toutes les notifications"
          sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}
        >
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationCard notification={notification} onToggleRead={toggleRead} />
            </li>
          ))}
        </Box>
      )}
    </Box>
  );
}
