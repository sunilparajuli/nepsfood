// assets
import { 
  DashboardOutlined, FormOutlined, UnorderedListOutlined, 
  FolderOpenOutlined, SettingOutlined, UserOutlined, TeamOutlined, FilePdfOutlined, BellOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  FormOutlined,
  UnorderedListOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  FilePdfOutlined,
  BellOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'templates',
      title: 'Form Templates',
      type: 'item',
      url: '/templates',
      icon: icons.FormOutlined,
      breadcrumbs: false
    },
    {
      id: 'submissions',
      title: 'Submissions',
      type: 'item',
      url: '/submissions',
      icon: icons.UnorderedListOutlined,
      breadcrumbs: false
    },
    {
      id: 'new-submission',
      title: 'Fill Form',
      type: 'item',
      url: '/fill-form',
      icon: icons.FormOutlined,
      breadcrumbs: false
    },
    {
      id: 'recipes',
      title: 'Recipes & Files',
      type: 'item',
      url: '/recipes',
      icon: icons.FolderOpenOutlined,
      breadcrumbs: false
    },
    {
      id: 'guidelines',
      title: 'Data Entry Guidelines',
      type: 'item',
      url: '/guidelines',
      icon: icons.FilePdfOutlined,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'User Management',
      type: 'item',
      url: '/users',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'roles',
      title: 'Role Management',
      type: 'item',
      url: '/roles',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'System Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    },
    {
      id: 'notification-settings',
      title: 'Push Notifications',
      type: 'item',
      url: '/notification-settings',
      icon: icons.BellOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
