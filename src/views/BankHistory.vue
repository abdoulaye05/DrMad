<template>
  <div>
    <h1>Histoire de la Banque</h1>

    <!--  Filter Section-->
    <div>
      <label>
        <input type="checkbox" v-model="filterActive"/> Filter par période
      </label>
      <div v-if="filterActive" class="filter-inputs">
        <div>
          <label>Du :</label>
          <input type="date" v-model="startDate" @change="validateDateRange"/>
        </div>
        <div>
          <label>Au :</label>
          <input type="date" v-model="endDate" @change="validateDateRange"/>
        </div>
      </div>

      <!-- Amount Filters -->
      <div class="filter-amount">
        <label>Montant minimum : </label>
        <input
            type="number"
            v-model="minAmount"
            @input="filterTransactions"
            placeholder="Minimum amount"
        />
        <label>Montant maximum : </label>
        <input
            type="number"
            v-model="maxAmount"
            @input="filterTransactions"
            placeholder="Maximum amount"
        />
      </div>

      <!-- Type Filter -->
      <div class="filter-type">
        <label>
          <input
              type="radio"
              value=""
              v-model="transactionType"
              @change="filterTransactions"
          />
          All
        </label>
        <label>
          <input
              type="radio"
              value="positive"
              v-model="transactionType"
              @change="filterTransactions"
          />
          Positive
        </label>
        <label>
          <input
              type="radio"
              value="negative"
              v-model="transactionType"
              @change="filterTransactions"
          />
          Negative
        </label>
      </div>

      <!--    Transactions Table-->
      <VDataTable
          :headers="headers"
          :items="filteredTransactions"
          itemCheck
          itemButton
          tableButton
          @itemClicked="showTransactionDetails"
          @tableClicked="showSelectedTransactions"
      >
        <template #item-button="{ item }">
          <span v-if="item"> Détails </span>
        </template>
        <template #table-button>
          <span> Voir </span>
        </template>
      </VDataTable>
    </div>
  </div>
</template>


<script>

import {mapState} from "vuex";
/*
import DataTable from "@/components/DataTable.vue";
*/

export default {
  name: "BankHistory",
/*
  components: {DataTable},
*/
  data() {
    return {
      filterActive: false,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
      transactionType: "",
    };
  },

  computed: {
    ...mapState("bank", {
      headers() {
        return [
          {text: "Date", value: "date"},
          {text: "Amount", value: "amount"},
          {text: "Type", value: "type"},
          {text: "Details", value: "details"},
        ];
      },
      filteredTransactions() {
        let transactions = this.accountTransactions.map((t) => ({
          ...t,
          dateFormatted: this.formatDate(t.date.$date),
          type: t.amount < 0 ? "S" : "D", // S = Source (sent), D = Destination (received)
        }));

        // Apply date range filter
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

        // Apply amount filter (only if fields are not empty)
        if (this.minAmount !== null && this.minAmount !== "") {
          transactions = transactions.filter((t) => t.amount >= this.minAmount);
        }
        if (this.maxAmount !== null && this.maxAmount !== "") {
          transactions = transactions.filter((t) => t.amount <= this.maxAmount);
        }

        // Apply type filter
        if (this.transactionType === "positive") {
          transactions = transactions.filter((t) => t.amount > 0);
        } else if (this.transactionType === "negative") {
          transactions = transactions.filter((t) => t.amount < 0);
        }

        // Sort transactions by date (descending)
        return transactions.sort((a, b) => new Date(b.date.$date) - new Date(a.date.$date));
      },
    })
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
        if (this.startDate > this.endDate) this.endDate = "";
        if (this.endDate < this.startDate) this.startDate = "";
      }
    },
    filterTransactions() {
      // Reactively update transactions when filters change
    },
    showTransactionDetails(item) {
      if (item) {
        alert(`Détails de la transaction : UUID = ${item.uuid}`);
      }
    },
    showSelectedTransactions(selectedItems) {
      const uuids = selectedItems.map((item) => item.uuid).join(", ");
      alert(`Transactions sélectionnées : UUIDs = ${uuids}`);
    },
  }
}
</script>
