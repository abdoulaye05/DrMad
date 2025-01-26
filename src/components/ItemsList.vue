<template>
  <v-card class="items-list pa-4">
    <v-card-title class="headline">Articles Disponibles</v-card-title>
    <v-divider></v-divider>

    <!-- Liste des articles -->
    <v-list dense>
      <v-list-item v-for="(item, index) in items" :key="item._id" class="pa-2">
        <!-- Informations sur l'article -->
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Prix : {{ item.price }}€
            <br />
            Stock : {{ item.stock }}
            <br />
            Promotions :
            <ul v-if="item.promotion.length > 0">
              <!-- Afficher chaque promotion -->
              <li v-for="promo in item.promotion" :key="promo._id">
                {{ promo.discount }}% pour {{ promo.amount }} unités
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
            dense
            outlined
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
        <v-chip
            v-if="item.stock === 0"
            color="error"
            outlined
            class="ml-2"
        >
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
  data() {
    return {
      quantities: [], // Quantités par article
      successMessage: "", // Message de confirmation pour l'utilisateur
      adding: false, // Empêche les actions multiples simultanées
    };
  },
  computed: {
    ...mapState("shop", ["viruses"]),
    items() {
      return this.viruses.map((item) => ({
        ...item,
        promotion: this.parsePromotion(item.promotion), // Traitement des promotions
      }));
    },
    canAddAll() {
      return this.quantities.some((qty, index) =>
          this.isValidQuantity(qty, this.items[index]?.stock)
      );
    },
  },
  methods: {
    ...mapActions("shop", ["addToBasket"]),

    isValidQuantity(quantity, stock) {
      return quantity > 0 && quantity <= stock && Number.isInteger(quantity);
    },

    parsePromotion(promotion) {
      try {
        if (Array.isArray(promotion)) return promotion;
        if (typeof promotion === "string") return JSON.parse(promotion);
      } catch (error) {
        console.warn("Promotion non valide :", promotion, error);
      }
      return []; // Retourne un tableau vide en cas d'erreur
    },

    async handleAddToBasket(item, quantity, index) {
      if (this.adding || !this.isValidQuantity(quantity, item.stock)) return;
      this.adding = true;
      try {
        const response = await this.addToBasket({ item, quantity });
        if (response?.error === 0) {
          this.showSuccessMessage(`Ajouté ${quantity} de ${item.name} au panier.`);
          this.quantities[index] = 0;
        } else {
          alert(`Erreur : ${response?.data || "Impossible d'ajouter au panier."}`);
        }
      } finally {
        this.adding = false;
      }
    },

    async handleAddAllToBasket() {
      if (this.adding) return;
      this.adding = true;
      try {
        const selectedItems = this.items
            .map((item, index) => ({
              item,
              quantity: this.quantities[index] || 0,
            }))
            .filter(({ item, quantity }) => this.isValidQuantity(quantity, item.stock));
        for (const { item, quantity } of selectedItems) {
          await this.addToBasket({ item, quantity });
        }
        this.showSuccessMessage("Tous les articles ont été ajoutés.");
      } finally {
        this.adding = false;
      }
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ""), 3000);
    },
  },

  watch: {
    items: {
      handler() {
        this.quantities = new Array(this.items.length).fill(0);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.items-list {
  max-width: 600px;
  margin: auto;
}
</style>
