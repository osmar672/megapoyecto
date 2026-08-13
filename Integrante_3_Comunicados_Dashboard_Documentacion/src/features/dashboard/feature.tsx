import type { UserRole } from '../../core/types/domain';
import { DashboardPage } from './pages/DashboardPage';

const allowedRoles: UserRole[] = ['ADMIN', 'TEACHER', 'STUDENT_FAMILY'];

export const feature = {
  id: 'dashboard',
  routes: [
    {
      path: '/dashboard',
      component: DashboardPage,
      allowedRoles,
    },
  ],
  navigation: [
    {
      label: 'Inicio',
      path: '/dashboard',
      allowedRoles,
    },
  ],
};

export default feature;
