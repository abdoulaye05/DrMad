<template>
  <v-container>
    <v-card class="pa-5">
      <!-- 🔹 Titre avec slot -->
      <slot name="title">
        <h1>📜 Historique des transactions</h1>
      </slot>

      <v-divider class="my-4"></v-divider>

      <!-- 🔹 Filtres -->
      <v-row>
        <v-col cols="12">
          <v-checkbox v-model="filterActive" label="Filtrer par période" class="mt-2" />
        </v-col>

        <!-- Champ de date "Du" -->
        <v-col v-if="filterActive" cols="6">
          <v-text-field
              v-model="startDate"
              label="Du"
              type="date"
              outlined
              dense
              @change="validateDateRange"
          />
        </v-col>

        <!-- Champ de date "Au" -->
        <v-col v-if="filterActive" cols="6">
          <v-text-field
              v-model="endDate"
              label="Au"
              type="date"
              outlined
              dense
              @change="validateDateRange"
          />
        </v-col>
      </v-row>

      <!-- 🔹 Filtre par montant -->
      <v-row>
        <v-col cols="6">
          <v-text-field
              v-model.number="minAmount"
              label="Montant minimum (€)"
              type="number"
              outlined
              dense
              @input="filterTransactions"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model.number="maxAmount"
              label="Montant maximum (€)"
              type="number"
              outlined
              dense
              @input="filterTransactions"
          />
        </v-col>
      </v-row>

      <!-- 🔹 Filtre par type -->
      <v-row>
        <v-col cols="12">
          <v-radio-group v-model="transactionType" row>
            <v-radio label="Tous" value="" @change="filterTransactions" />
            <v-radio label="Reçus (positifs)" value="positive" @change="filterTransactions" />
            <v-radio label="Envoyés (négatifs)" value="negative" @change="filterTransactions" />
          </v-radio-group>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- 🔹 Tableau des transactions -->
      <v-data-table
          :headers="headers"
          :items="filteredTransactions"
          class="elevation-1"
          dense
      >
        <template v-slot:[`item.amount`]="{ item }">
          <v-chip :color="item.amount < 0 ? 'red' : 'green'" dark>
            {{ item.amount }} €
          </v-chip>
        </template>

        <template v-slot:[`item.dateFormated`]="{ item }">
          <span>{{ item.dateFormatted }}</span>
        </template>

        <template v-slot:[`item.type`]="{ item }">
          <v-icon :color="item.amount < 0 ? 'red' : 'green'">
            {{ item.amount < 0 ? "mdi-arrow-up-bold" : "mdi-arrow-down-bold" }}
          </v-icon>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" small @click="showTransactionDetails(item)">
            Détails
          </v-btn>
        </template>
      </v-data-table>

      <v-divider class="my-4"></v-divider>

      <!-- 🔹 Bouton pour voir les transactions sélectionnées -->
      <v-btn block color="primary" class="mt-2" @click="showSelectedTransactions">
        Voir Transactions Sélectionnées
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BankHistory",
  data() {
    return {
      filterActive: false,
      startDate: "",
      endDate: "",
      minAmount: null,
      maxAmount: null,
      transactionType: "",
    };
  },
  computed: {
    ...mapState("bank", ["accountTransactions"]),

    headers() {
      return [
        { text: "Date", value: "dateFormatted" },
        { text: "Montant", value: "amount" },
        { text: "Type", value: "type" },
        { text: "Actions", value: "actions", sortable: false },
      ];
    },

    filteredTransactions() {
      let transactions = this.accountTransactions.map((t) => ({
        ...t,
        dateFormatted: this.formatDate(t.date.$date),
        type: t.amount < 0 ? "S" : "D", // S = Source (envoyé), D = Destination (reçu)
      }));

      // 🔹 Filtrer par date
      if (this.filterActive) {
        const start = this.startDate ? new Date(this.startDate).getTime() : null;
        const end = this.endDate ? new Date(this.endDate).getTime() : null;

        transactions = transactions.filter((t) => {
          const transactionDate = new Date(t.date.$date).getTime();
          if (start && end) return transactionDate >= start && transactionDate <= end;
          if (start) return transactionDate >= start;
          if (end) return transactionDate <= end;
          return true;
        });
      }

      // 🔹 Filtrer par montant
      if (this.minAmount !== null) {
        transactions = transactions.filter((t) => t.amount >= this.minAmount);
      }
      if (this.maxAmount !== null) {
        transactions = transactions.filter((t) => t.amount <= this.maxAmount);
      }

      // 🔹 Filtrer par type
      if (this.transactionType === "positive") {
        transactions = transactions.filter((t) => t.amount > 0);
      } else if (this.transactionType === "negative") {
        transactions = transactions.filter((t) => t.amount < 0);
      }

      // 🔹 Trier par date décroissante
      return transactions.sort((a, b) => new Date(b.date.$date) - new Date(a.date.$date));
    },
  },

  methods: {
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate()
      ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
      ).padStart(2, "0")}`;
    },

    validateDateRange() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        this.endDate = "";
      }
    },

    filterTransactions() {
      // Filtrage automatique via computed
    },

    showTransactionDetails(item) {
      if (item) {
        alert(`Détails de la transaction : UUID = ${item.uuid}`);
      }
    },

    showSelectedTransactions() {
      const uuids = this.filteredTransactions.map((item) => item.uuid).join(", ");
      alert(`Transactions sélectionnées : UUIDs = ${uuids}`);
    },
  },
};
</script>
