<template>
  <div>
    <p v-for="(item, indexRow) in data" :key="indexRow">
      <input
          type="checkbox"
          v-if="itemCheck"
          :checked="checked[indexRow]"
          @click="$emit('checked-changed', indexRow)"
      >
      <span v-for="(field, indexCol) in fields" :key="indexCol">
        {{ item[field] }}
      </span>
      <!-- Champ numérique pour quantité -->
      <input
          v-if="itemAmount"
          type="number"
          min="0"
          v-model.number="amounts[indexRow]"
          class="item-amount"
          placeholder="Quantité"
      >
      <button
          v-if="itemButton && itemButton.show"
          @click="$emit('item-button-clicked', { index: indexRow, amount: amounts[indexRow] || 0 })"
      >
        {{ itemButton.text }}
      </button>
    </p>
    <button
        v-if="listButton && listButton.show"
        @click="emitAllItems"
    >
      {{ listButton.text }}
    </button>
  </div>
</template>

<script>
export default {
  name: "CheckedList",
  props: {
    data: Array, // les données sources
    fields: Array, // le tableau contenant le nom des champs à afficher
    itemCheck: Boolean, // s'il y a des cases à cocher
    checked: Array, // le tableau des cases cochées
    itemButton: Object, // l'objet pour les boutons d'items
    listButton: Object, // l'objet pour le bouton de liste
    itemAmount: Boolean, // affiche ou non le champ quantité
  },
  data() {
    return {
      amounts: [], // Quantités saisies pour chaque item
    };
  },
  methods: {
    // Émet les indices et quantités pour tous les items
    emitAllItems() {
      const selectedItems = this.data.map((item, index) => ({
        index,
        amount: this.amounts[index] || 0,
      })).filter(entry => entry.amount > 0); // Filtrer les quantités valides

      this.$emit('list-button-clicked', selectedItems);
    },
  },
};
</script>

<style scoped>
.item-amount {
  margin-left: 10px;
  margin-right: 10px;
  width: 80px;
}
</style>
