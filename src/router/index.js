import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import ShopView from '@/views/ShopView.vue';
import BankAccountView from "@/views/BankAccountView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/shop',
    component: ShopView,
    children: [
      {
        path: 'home',
        components: () => import('../views/ShopHome.vue'),
        alias: ''
      },
      {
        path: 'login',
        components: () => import('../views/ShopLogin.vue')
      },
      {
        path: 'buy',
        components: () => import('../views/ShopBuy.vue')
      },
      {
        path: 'pay/:orderId',
        components: () => import('../views/ShopPay.vue'),
        props: { shopmain: true }
      },
      {
        path: 'orders',
        components: () => import('../views/ShopOrders.vue')
      }
    ]
  },
  {
    path: '/bank',
    component: BankAccountView,
    children: [
      {
        path: '/bank/account',
        name: 'bankaccount',
        component: () => import('../views/BankAccountView.vue')
      },
    ]

  }
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
