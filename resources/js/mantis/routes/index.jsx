import { createBrowserRouter, Navigate } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  MainRoutes, 
  LoginRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;
