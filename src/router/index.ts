import { createRouter, createWebHistory } from 'vue-router';
import SystemManagement from '@/views/SystemManagement.vue';
import UserManagement from '@/views/UserManagement.vue';
import RoleManagement from '@/views/RoleManagement.vue';
import PermissionControl from '@/views/PermissionControl.vue';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/system',
    name: 'SystemManagement',
    component: SystemManagement,
    meta: { title: '系统管理' },
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: { title: '角色管理' }
      },
      {
        path: 'permissions',
        name: 'PermissionControl',
        component: PermissionControl,
        meta: { title: '权限控制' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;