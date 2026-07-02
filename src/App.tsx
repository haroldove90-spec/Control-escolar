/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolProvider, useSchool } from './SchoolContext';
import { HomePortal } from './components/HomePortal';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';

function SchoolApp() {
  const { currentRole } = useSchool();

  switch (currentRole) {
    case 'home':
      return <HomePortal />;
    case 'admin':
      return <AdminDashboard />;
    case 'estudiante':
      return <StudentDashboard />;
    default:
      return <HomePortal />;
  }
}

export default function App() {
  return (
    <SchoolProvider>
      <SchoolApp />
    </SchoolProvider>
  );
}
