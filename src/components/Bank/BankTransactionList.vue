<template>
  <v-card class="pa-5">
    <h2>📜 Historique des Transactions</h2>
    <p><strong>Numéro de compte :</strong> {{ accountNumber }}</p>

    <v-alert v-if="transactions.length === 0" type="info">
      ⚠️ Aucune transaction trouvée pour ce compte.
    </v-alert>

    <v-list v-else>
      <v-list-item-group>
        <v-list-item v-for="(transaction, index) in formattedTransactions" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              <span :style="{ color: transaction.amount < 0 ? 'red' : 'green' }">
                {{ transaction.amount }} €
              </span>
              - {{ transaction.date }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BankTransactionList",
  computed: {
    ...mapState("bank", ["accountNumber", "accountTransactions"]),
    transactions() {
      console.log("🔍 [BankTransactionList] Transactions reçues :", this.accountTransactions);
      return this.accountTransactions || [];
    },
    formattedTransactions() {
      return (this.transactions || []).map(tx => ({
        amount: tx.amount,
        date: tx.date ? new Date(tx.date.$date).toLocaleString() : "Date inconnue",
      }));
    },
  },
};
</script>
