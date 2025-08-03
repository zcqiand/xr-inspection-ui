import { createRouter, createWebHistory } from 'vue-router';
import SystemManagement from '@/views/SystemManagement.vue';
import UserManagement from '@/views/UserManagement.vue';
import RoleManagement from '@/views/RoleManagement.vue';
import PermissionControl from '@/views/PermissionControl.vue';
import Home from '@/views/Home.vue';
import EntrustmentList from '@/views/EntrustmentList.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/sys',
    name: 'SystemManagement',
    component: SystemManagement,
    meta: { title: '系统管理' },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: UserManagement,
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: { title: '角色管理' }
      },
      {
        path: 'permission',
        name: 'PermissionControl',
        component: PermissionControl,
        meta: { title: '权限控制' }
      }
    ]
  },
  // 任务分配列表
  {
    path: '/reports/task-assignments',
    name: 'TaskAssignmentList',
    component: () => import('../views/TaskAssignmentList.vue'),
    meta: {
      title: '任务分配列表',
      permission: 'task:assignment'
    }
  },
  // 任务分配详情
  {
    path: '/reports/task-assignments/:id',
    name: 'TaskAssignmentDetail',
    component: () => import('../views/TaskAssignmentDetail.vue'),
    meta: {
      title: '任务分配详情',
      permission: 'task:assignment'
    }
  },
  // 新建任务分配
  {
    path: '/reports/task-assignments/create',
    name: 'TaskAssignmentCreate',
    component: () => import('../views/TaskAssignmentForm.vue'),
    meta: {
      title: '新建任务分配',
      permission: 'task:assignment'
    }
  },
  {
    path: '/reports/entrustment',
    name: 'EntrustmentList',
    component: EntrustmentList,
    meta: { title: '委托登记列表' }
  },
  {
    path: '/reports/entrustment/create',
    name: 'EntrustmentCreate',
    component: () => import('@/views/EntrustmentForm.vue'),
    meta: { title: '创建委托' }
  },
  {
    path: '/reports/entrustment/edit/:id',
    name: 'EntrustmentEdit',
    component: () => import('@/views/EntrustmentForm.vue'),
    meta: { title: '编辑委托' }
  },
  {
    path: '/reports/entrustment/:id',
    name: 'EntrustmentDetail',
    component: () => import('@/views/EntrustmentDetail.vue'),
    meta: { title: '委托登记详情' }
  },
  {
    path: '/sample-groups',
    name: 'SampleGroupManagement',
    component: () => import('@/views/SampleGroupManagement.vue'),
    meta: { title: '样品组管理' }
  },
  {
    path: '/reports/data-entry',
    name: 'DataEntryList',
    component: () => import('@/views/DataEntryList.vue'),
    meta: { title: '数据录入列表' }
  },
  {
    path: '/reports/data-entry/:id',
    name: 'DataEntryDetail',
    component: () => import('@/views/DataEntryDetail.vue'),
    meta: { title: '数据录入详情' }
  },
  {
    path: '/reports/compile',
    name: 'ReportCompileList',
    component: () => import('@/views/ReportCompileList.vue'),
    meta: {
      title: '报告编制列表',
      permission: 'report:compile'
    }
  },
  {
    path: '/reports/compile/:id',
    name: 'ReportCompileDetail',
    component: () => import('@/views/ReportCompileDetail.vue'),
    meta: {
      title: '报告编制详情',
      permission: 'report:compile'
    }
  },
  // 报告审核列表
  {
    path: '/reports/review',
    name: 'ReportReviewList',
    component: () => import('@/views/ReportReviewList.vue'),
    meta: {
      title: '报告审核列表',
      permission: 'report:review'
    }
  },
  // 报告审核详情
  {
    path: '/reports/review/:id',
    name: 'ReportReviewDetail',
    component: () => import('@/views/ReportReviewDetail.vue'),
    meta: {
      title: '报告审核详情',
      permission: 'report:review'
    }
  },
  // 报告批准列表
  {
    path: '/reports/approve',
    name: 'ReportApproveList',
    component: () => import('@/views/ReportApproveList.vue'),
    meta: {
      title: '报告批准列表',
      permission: 'report:approve'
    }
  },
  // 报告批准详情
  {
    path: '/reports/approve/:id',
    name: 'ReportApproveDetail',
    component: () => import('@/views/ReportApproveDetail.vue'),
    meta: {
      title: '报告批准详情',
      permission: 'report:approve'
    }
  },
  // 报告归档列表
  {
    path: '/reports/archive',
    name: 'ReportArchiveList',
    component: () => import('@/views/ReportArchiveList.vue'),
    meta: { title: '报告归档列表' }
  },
  // 报告归档详情
  {
    path: '/reports/archive/:id',
    name: 'ReportArchiveDetail',
    component: () => import('@/views/ReportArchiveDetail.vue'),
    meta: { title: '报告归档详情' }
  },
  // 报告发放列表
  {
    path: '/reports/issue',
    name: 'ReportIssueList',
    component: () => import('@/views/ReportIssueList.vue'),
    meta: { title: '报告发放列表' }
  },
  // 报告发放详情
  {
    path: '/reports/issue/:id',
    name: 'ReportIssueDetail',
    component: () => import('@/views/ReportIssueDetail.vue'),
    meta: { title: '报告发放详情' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;