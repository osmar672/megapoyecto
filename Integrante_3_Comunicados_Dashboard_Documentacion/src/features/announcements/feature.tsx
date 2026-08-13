import type { UserRole } from '../../core/types/domain';
import { AnnouncementsPage } from './pages/AnnouncementsPage';

const allowedRoles: UserRole[] = ['ADMIN', 'TEACHER', 'STUDENT_FAMILY'];

export const feature = {
  id: 'announcements',
  routes: [
    {
      path: '/announcements',
      component: AnnouncementsPage,
      allowedRoles,
    },
  ],
  navigation: [
    {
      label: 'Comunicados',
      path: '/announcements',
      allowedRoles,
    },
  ],
};

export default feature;
