<template>
  <v-card class="items-list pa-4">
    <v-divider class="mb-4"></v-divider>

    <!-- Liste des articles filtrés et triés -->
    <v-list dense>
      <v-list-item v-for="(item, index) in filteredItems" :key="item._id" class="pa-2">
        <!-- Informations sur l'article -->
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Prix : {{ item.price }}€<br />
            Stock : {{ item.stock }}<br />
            Promotions :
            <ul v-if="item.promotion.length > 0">
              <li v-for="promo in item.promotion" :key="promo._id">
                {{ promo.discount }}% dès {{ promo.amount }} unités
              </li>
            </ul>
            <span v-else>Aucune promotion</span>
          </v-list-item-subtitle>
        </v-list-item-content>

        <!-- Champ Quantité -->
        <v-text-field
            v-model.number="quantities[index]"
            label="Quantité"
            type="number"
            min="0"
            dense outlined
            class="mr-2"
            style="max-width: 100px;"
            :disabled="item.stock === 0"
        ></v-text-field>

        <!-- Bouton Ajouter au panier -->
        <v-btn
            color="primary"
            @click="handleAddToBasket(item, quantities[index], index)"
            :disabled="item.stock === 0 || !isValidQuantity(quantities[index], item.stock) || adding"
        >
          Ajouter
        </v-btn>

        <!-- Indicateur d'épuisement -->
        <v-chip v-if="item.stock === 0" color="error" outlined class="ml-2">
          Épuisé
        </v-chip>
      </v-list-item>
    </v-list>

    <!-- Bouton Ajouter Tous -->
    <v-divider class="my-4"></v-divider>
    <v-btn
        color="success"
        block
        @click="handleAddAllToBasket"
        :loading="adding"
        :disabled="!canAddAll || adding"
    >
      Ajouter Tous
    </v-btn>

    <!-- Message de succès -->
    <v-alert v-if="successMessage" type="success" class="mt-4">
      {{ successMessage }}
    </v-alert>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ItemsList",
  props: {
    filterKeyword: String,
    sortBy: String,
    showInStockOnly: Boolean,
  },
  data() {
    return {
      quantities: [], // Quantités par article
      successMessage: "", // Message de confirmation
      adding: false, // Pour éviter plusieurs clics rapides
    };
  },
  computed: {
    ...mapState("shop", ["viruses"]),

    filteredItems() {
      let items = [...this.viruses];

      // 🔍 Filtrage par mot-clé
      if (this.filterKeyword) {
        const keyword = this.filterKeyword.toLowerCase();
        items = items.filter((item) => item.name.toLowerCase().includes(keyword));
      }

      // 📦 Filtrage par stock disponible
      if (this.showInStockOnly) {
        items = items.filter((item) => item.stock > 0);
      }

      // 🔽 Tri des résultats
      if (this.sortBy) {
        const sortingMethods = {
          nameAsc: (a, b) => a.name.localeCompare(b.name),
          nameDesc: (a, b) => b.name.localeCompare(a.name),
          priceAsc: (a, b) => a.price - b.price,
          priceDesc: (a, b) => b.price - a.price,
          stockAsc: (a, b) => a.stock - b.stock,
          stockDesc: (a, b) => b.stock - a.stock,
        };
        items.sort(sortingMethods[this.sortBy]);
      }

      return items;
    },
  },
  methods: {
    ...mapActions("shop", ["addToBasket"]),

    isValidQuantity(quantity, stock) {
      return quantity > 0 && quantity <= stock && Number.isInteger(quantity);
    },

    async handleAddToBasket(item, quantity, index) {
      if (this.adding || !this.isValidQuantity(quantity, item.stock)) return;
      this.adding = true;
      try {
        await this.addToBasket({ item, quantity });
        this.showSuccessMessage(`Ajouté ${quantity} de ${item.name} au panier.`);
        this.quantities[index] = 0;
      } finally {
        this.adding = false;
      }
    },
  },
};
</script>
