<template>
  <div>
    <h2>Historique de Transactions</h2>
    <pre>{{ transactions }}</pre>
    <ul>
      <li v-for="(transaction, index) in transactions" :key="index">
        {{ transaction.amount }} le {{ formatDate(transaction.date) }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BankTransactionList",
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    console.log("📜 Transactions reçues dans BankTransactionList :", this.transactions);
  },
  methods: {
    formatDate(date) {
      if (!date) return "Date inconnue";

      // Vérifie si c'est un objet MongoDB ({ $date: ... }) ou une string
      let parsedDate = date.$date ? new Date(date.$date) : new Date(date);

      return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()} ${parsedDate.getHours()}:${parsedDate.getMinutes()}:${parsedDate.getSeconds()}`;
    },
  },
};
</script>