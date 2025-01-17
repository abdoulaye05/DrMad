import Vue from 'vue'
import VueRouter from 'vue-router'
import ShopView from '@/views/ShopView.vue';
import ShopHome from "@/views/ShopHome.vue";
import ShopLogin from "@/views/ShopLogin.vue";
import ShopBuy from "@/views/ShopBuy.vue";
import ShopPay from "@/views/ShopPay.vue";
import ShopOrders from "@/views/ShopOrders.vue";
import HomePage from "@/views/HomePage.vue";
import BankView from "@/components/BankView.vue";
import BankHome from "@/views/BankHome.vue";
import BankAmount from "@/views/BankAmount.vue";
import BankOperation from "@/views/BankOperation.vue";
import BankHistory from "@/views/BankHistory.vue";
import BankLogout from "@/views/BankLogout.vue";
import BankAccount from "@/views/BankAccount.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/shop',
    component: ShopView,
    children: [
      {
        path: 'home',
        component: ShopHome,
        name: 'shophome',
        alias: ''
      },
      {
        path: 'login',
        component: ShopLogin,
        name: 'shoplogin'
      },
      {
        path: 'buy',
        component: ShopBuy,
        name: 'shopbuy'
      },
      {
        path: 'pay',
        component: ShopPay,
        props: route => ({ orderId: route.params.orderId }),
        name: 'shoppay'
      },
      {
        path: 'orders',
        component: ShopOrders,
        name: 'shoporders'
      }
    ]
  },
  {
    path: '/bank',
    component: BankView,
    children: [
      {
        path: 'home',
        alias: '',
        name: 'bankhome',
        component: BankHome,
      },
      {
        path: 'account',
        name: 'bankaccount',
        component: BankAccount,
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
  routes
})

export default router
