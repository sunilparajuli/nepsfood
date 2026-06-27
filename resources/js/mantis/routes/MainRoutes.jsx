import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import RequireAuth from './RequireAuth';
import { Navigate } from 'react-router-dom';

// custom pages
const TemplatesList = Loadable(lazy(() => import('pages/TemplatesList')));
const TemplateBuilder = Loadable(lazy(() => import('pages/TemplateBuilder')));
const SubmissionsList = Loadable(lazy(() => import('pages/SubmissionsList')));
const SubmissionDetail = Loadable(lazy(() => import('pages/SubmissionDetail')));
const NewSubmission = Loadable(lazy(() => import('pages/NewSubmission')));
const UsersList = Loadable(lazy(() => import('pages/UsersList')));
const RolesList = Loadable(lazy(() => import('pages/RolesList')));
const Settings = Loadable(lazy(() => import('pages/Settings')));
const NotificationSettings = Loadable(lazy(() => import('pages/NotificationSettings')));
const RecipeManager = Loadable(lazy(() => import('pages/RecipeManager')));
const Guidelines = Loadable(lazy(() => import('pages/Guidelines')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="/templates" replace />
    },
    {
      path: 'templates',
      element: <TemplatesList />
    },
    {
      path: 'templates/create',
      element: <TemplateBuilder />
    },
    {
      path: 'templates/:id/edit',
      element: <TemplateBuilder />
    },
    {
      path: 'submissions',
      element: <SubmissionsList />
    },
    {
      path: 'fill-form',
      element: <NewSubmission />
    },
    {
      path: 'submissions/:id',
      element: <SubmissionDetail />
    },
    {
      path: 'users',
      element: <UsersList />
    },
    {
      path: 'roles',
      element: <RolesList />
    },
    {
      path: 'recipes',
      element: <RecipeManager />
    },
    {
      path: 'guidelines',
      element: <Guidelines />
    },
    {
      path: 'settings',
      element: <Settings />
    },
    {
      path: 'notification-settings',
      element: <NotificationSettings />
    },
    {
      path: '*',
      element: <Navigate to="/templates" replace />
    }
  ]
};

export default MainRoutes;
