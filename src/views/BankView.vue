<template>
  <div>
    <VerticalMenu class="fixed-navbar" :items="menuItems">
      <template v-slot:menu-link="{ label }">
        <span>{{ label }}</span>
      </template>
    </VerticalMenu>

    <div>
      <BankHome/>
      <BankAmount v-if="$route.path === '/bank/amount' && balance !== undefined" :balance="balance">
        <template v-slot:account-amount>
          <input type="text" :value="`${balance} €`" :style="{ color: balance < 0 ? 'red' : 'green' }" readonly/>
        </template>
      </BankAmount>
      <router-view/>
    </div>
  </div>
</template>


<script>
import VerticalMenu from '../components/VerticalMenu.vue';
import BankAmount from '../views/BankAmount.vue';
import BankHome from "@/views/BankHome.vue";
import {mapState} from "vuex";

export default {
  name: "BankView",
  components: {
    BankHome,
    VerticalMenu,
    BankAmount
  },
  computed: {
    ...mapState({
      balance: state => state.bank.accountNumber.amount,
      account: state => state.bank.accountNumber,
    }),
    navLinks() {
      return [
        {label: 'Mon compte', to: '/bank/account'},
      ]
    },
  },
  data() {
    return {
      menuItems: [
        {type: 'button', label: 'Mon compte', to: '/bank/account'},
        {type: 'button', label: 'Solde', to: '/bank/amount'},
        {type: 'button', label: 'Débit/Virement', to: '/bank/operation'},
        {type: 'button', label: 'Historique', to: '/bank/history'}
      ]
    }
  },
};
</script>
