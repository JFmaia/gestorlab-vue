import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { userStore } from '@/stores/user';
import type { UsuarioResponse } from '@/types';

const HomeViewVue = () => import('@/views/home/HomeView.vue');
const SendEmail = () => import('@/views/passwordRecovery/SendMenssage.vue');
const PasswordRecovery = () => import('@/views/passwordRecovery/PasswordRecovery.vue');
const PageAcess = () => import('@/views/pageAcess/PageAcess.vue');
const DashBoard = () => import('@/views/dashboard/DashBoard.vue');
const PedidosAcess = () => import('@/views/dashboard/components/PedidosAcess.vue');
const Profile = () => import('@/views/dashboard/components/profile/MyProfile.vue');
const Timeline = () => import('@/views/dashboard/components/timeline/TimeLine.vue');
const Laboratory = () => import('@/views/dashboard/components/laboratory/MyLaboratory.vue');
const CreateLab = () => import('@/views/createLab/CreateLab.vue');
const LandingPage = () => import('@/views/landingpage/LandingPageLab.vue');
const Usuarios = () => import('@/views/dashboard/components/admin/ListUsuarios.vue');
const Laboratorios = () => import('@/views/dashboard/components/admin/ListLaboratorios.vue');
const ListProjetos = () => import('@/views/dashboard/components/projeto/ListProjetos.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeViewVue
  },
  {
    path: '/landingpage/:id',
    name: 'landingpage',
    component: LandingPage,
    props: true
  },
  {
    path: '/createLab',
    name: 'createLab',
    component: CreateLab,
  },
  {
    path: '/pageAcess',
    name: 'page-acess',
    component: PageAcess,
  },
  {
    path: '/sendEmail',
    name: 'send-email',
    component: SendEmail,
  },
  {
    path: '/passwordRecovery/:id',
    name: 'password-recovery',
    component: PasswordRecovery,
    props: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoard,
    redirect: '/dashboard/timeline',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'timeline',
        name: 'time-line',
        component: Timeline,
      },
      {
        path: 'pedidosAcess',
        name: 'pedidos-acess',
        component: PedidosAcess,
      },
      {
        path: 'profile/:id',
        name: 'profile',
        component: Profile,
        props: true
      },
      {
        path: 'projetos',
        name: 'projetos',
        component: ListProjetos(),
        props: true
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: Usuarios(),
      },
      {
        path: 'laboratorios',
        name: 'laboratorios',
        component: Laboratorios(),
      },
      {
        path: 'laboratory/:id',
        name: 'laboratory',
        props: true,
        component: Laboratory,
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = authStore();
  const loadingStore = useLoadingStore();
  const user = userStore();
  function isCoordOrNot() {
    const usuario: UsuarioResponse = user.getUser;
    if (usuario?.permissao?.title === 'Coordenador') {
      if (usuario.primeiro_acesso === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    loadingStore.setLoading(true);
    const response = await auth.authAutenticate();
    loadingStore.setLoading(false);

    if (response === false) {
      next('/pageAcess');
      return;
    } else {
      if (isCoordOrNot()) {
        next('/createLab');
        return;
      } else {
        next();
      }
    }
  }
  next();
});

export default router;