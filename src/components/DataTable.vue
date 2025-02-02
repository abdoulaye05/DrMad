<template>
  <div class="data-table">
    <table>
      <!-- 🔹 Table Header -->
      <thead>
      <tr>
        <th v-if="itemCheck">✔</th>
        <th v-for="header in headers" :key="header.name">{{ header.label }}</th>
        <th v-if="itemButton"></th>
      </tr>
      </thead>

      <!-- 🔹 Table Body -->
      <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <!-- Checkbox Column -->
        <td v-if="itemCheck">
          <input type="checkbox" v-model="selectedItems" :value="item" />
        </td>

        <!-- Data Columns (with slot support) -->
        <slot name="items" :item="item">
          <td v-for="header in headers" :key="header.name">
            {{ item[header.name] }}
          </td>
        </slot>

        <!-- Action Column -->
        <td v-if="itemButton">
          <button @click="$emit('itemClicked', item)">
            <slot name="item-button" :item="item">Détails</slot>
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 🔹 Table Button -->
    <div v-if="tableButton" class="table-button">
      <button @click="emitSelectedItems">
        <slot name="table-button">Valider</slot>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemCheck: {
      type: Boolean,
      default: false,
    },
    itemButton: {
      type: Boolean,
      default: false,
    },
    tableButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedItems: [],
    };
  },
  methods: {
    emitSelectedItems() {
      this.$emit("tableClicked", this.selectedItems);
    },
  },
};
</script>

<style scoped>
.data-table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
}

.data-table table {
  width: 100%;
  border: 1px solid #444;
  background-color: #1a1a1a; /* Fond sombre */
}

.data-table th,
.data-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #444;
  color: white;
}

.data-table th {
  background-color: #333;
  font-weight: bold;
}

.data-table tbody tr {
  background-color: #1a1a1a;
}

.data-table tbody tr:hover {
  background-color: #333;
}

.data-table button {
  padding: 5px 10px;
  background-color: #b50000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.data-table button:hover {
  background-color: #9c0000;
}

.table-button {
  margin-top: 10px;
  text-align: right;
}
</style>
