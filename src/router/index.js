import Vue from 'vue';
import VueRouter from 'vue-router';
import ShopView from '@/views/ShopView.vue';
import ShopHome from '@/views/ShopHome.vue';
import ShopLoginView from '@/views/ShopLoginView.vue';
import ShopBuyView from '@/views/ShopBuyView.vue';
import ShopPayView from '@/views/ShopPayView.vue';
import ShopOrdersView from '@/views/ShopOrdersView.vue';
import BankView from '@/views/BankView.vue';
import BankHome from '@/views/BankHome.vue';
import BankAmount from '@/views/BankAmount.vue';
import BankOperation from '@/views/BankOperation.vue';
import BankHistory from '@/views/BankHistory.vue';
import BankLogout from '@/views/BankLogout.vue';
import ShopVirus from '@/views/ShopVirus.vue';
import BankAccountView from '@/views/BankAccountView.vue';


Vue.use(VueRouter);

const routes = [
  // Boutiques
  {
    path: '/',
    component: ShopHome,
    name: 'shophome',
  },
  {
    path: '/shop',
    component: ShopView,
    alias: '',
    children: [
      {
        path: 'login',
        component: ShopLoginView,
        name: 'shoplogin',
      },
      {
        path: 'buy',
        component: ShopBuyView,
        name: 'shopbuy',
      },
      {
        path: 'pay/:uuid',
        component: ShopPayView,
        props: true,
        name: 'shoppay',
      },
      {
        path: 'orders',
        component: ShopOrdersView,
        name: 'shoporders',
      },
      {
        path: 'viruses',
        component: ShopVirus,
        name: 'shopviruses', // Correction
      },
    ],
  },

  // Banque
  {
    path: '/bank',
    component: BankView,
    children: [
      {
        path: 'home',
        name: 'bankhome',
        component: BankHome,
      },
      {
        path: 'account',
        name: 'bankaccount',
        component: BankAccountView,
      },
      {
        path: 'amount',
        name: 'bankamount',
        component: BankAmount,
      },
      {
        path: 'operation',
        name: 'bankoperation',
        component: BankOperation,
      },
      {
        path: 'history',
        name: 'bankhistory',
        component: BankHistory,
      },
      {
        path: 'logout',
        name: 'banklogout',
        component: BankLogout,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
