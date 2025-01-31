<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2> Information du compte bancaire </h2>
      </v-card-title>
      <v-card-text>
        <p><strong> Numéro de compte: </strong> {{ account.number }} </p>
        <p><strong> Solde disponible: </strong> {{ account.amount }} </p>
        <component
            :is="currentView"
            :account="{ number: accountNumber, amount: accountAmount }"
            :transactions="accountTransactions"
            @refresh="loadAccountInfo"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "BankAccountInfo",
  props: {
      account: { type: Object, required: false, default: () => ({}) },
      transactions: { type: Array, required: false, default: () => [] },
      currentView: { type: String, required: false, default: "BankTransactionList" },
  },
};

</script>
