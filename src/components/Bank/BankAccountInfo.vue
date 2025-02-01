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
import {mapState} from "vuex";
import BankTransactionList from "@/components/Bank/BankTransactionList.vue";

export default {
  name: "BankAccountInfo",
  computed: {
    ...mapState("bank", ["accountNumber", "accountAmount", "accountTransactions"]),
  },
  components: {
    BankTransactionList, // 🔥 Assurez-vous qu'il est bien ajouté ici
  },
  props: {
      account: { type: Object, required: false, default: () => ({}) },
      transactions: { type: Array, required: false, default: () => [] },
      currentView: { type: String, required: false, default: "BankTransactionList" },
  },
  methods: {
    loadAccountInfo() {
      console.log("🔄 Rafraîchissement des infos du compte...");
      this.$emit("refresh"); // Émet l'événement pour que le parent puisse le traiter si besoin
    },
  },


};

</script>
