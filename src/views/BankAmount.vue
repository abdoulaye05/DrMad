<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 text-center mx-auto" elevation="3" max-width="400">
      <v-card-title class="justify-center">
        <h2>💰 Solde du compte</h2>
      </v-card-title>

      <v-divider class="my-3"></v-divider>

      <!-- 🔹 Affichage du solde avec un slot pour personnalisation -->
      <slot :amount="amount" name="account-amount">
        <v-chip :color="amountColor" class="text-white" label>
          {{ amount }} €
        </v-chip>
      </slot>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BankAmount",
  computed: {
    ...mapState("bank", ["currentAccount"]),

    amount() {
      return this.currentAccount ? this.currentAccount.amount : 0;
    },

    amountColor() {
      return this.amount < 0 ? "red" : "green";
    },
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
