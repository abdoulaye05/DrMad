<template>
  <div>
    <h1>Bank Amount</h1>
    <v-slot name="account-amount" :amount="amount">
      <span :class="amountClass">{{ amount }} €</span>
    </v-slot>
  </div>
</template>

<script>
import { mapState} from "vuex";

export default {
  name: "BankAmount",
  computed: {
    ...mapState("bank", ["currentAccount"]),
    amount() {
      return this.currentAccount ? this.currentAccount.amount : 0;
    },
    amountClass() {
      return this.amount >= 0 ? "positive-balance" : "negative-balance";
    },
  },
};
</script>
