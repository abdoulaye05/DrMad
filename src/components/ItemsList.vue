<template>
  <v-card class="items-list pa-4">
    <v-card-title class="headline">Articles Disponibles</v-card-title>
    <v-divider></v-divider>

    <!-- Liste des articles -->
    <v-list dense>
      <v-list-item
          v-for="(item, index) in items"
          :key="index"
          class="pa-2"
      >
        <!-- Informations sur l'article -->
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Prix: {{ item.price }}€ | Promo: {{ item.promotion ? item.promotion.discount + '%' : 'Aucune' }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <!-- Champ quantité -->
        <v-text-field
            v-model.number="quantities[index]"
            label="Quantité"
            type="number"
            min="0"
            dense
            outlined
            class="mr-2"
            style="max-width: 100px;"
        ></v-text-field>

        <!-- Bouton Ajouter au Panier -->
        <v-btn
            color="primary"
            @click="addToBasket(item, quantities[index])"
            :disabled="!isValidQuantity(quantities[index])"
        >
          Ajouter
        </v-btn>
      </v-list-item>
    </v-list>

    <!-- Bouton Ajouter Tous -->
    <v-divider class="my-4"></v-divider>
    <v-btn
        color="success"
        @click="addAllToBasket"
        :disabled="!canAddAll"
        block
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
      quantities: [], // Stocker les quantités saisies pour chaque article
      successMessage: "", // Message de confirmation pour l'utilisateur
    };
  },
  computed: {
    ...mapState("shop", ["viruses"]), // Liste des articles depuis le store
    items() {
      return this.viruses || [];
    },
    canAddAll() {
      return this.quantities.some((qty) => this.isValidQuantity(qty));
    },
  },
  methods: {
    ...mapActions("shop", ["addToBasket"]),

    isValidQuantity(quantity) {
      return quantity && quantity > 0 && Number.isInteger(quantity);
    },

    async addToBasket(item, quantity) {
      if (this.isValidQuantity(quantity)) {
        await this.addToBasket({ item, quantity });
        this.showSuccessMessage(`Ajouté ${quantity} de ${item.name} au panier.`);
      }
    },

    async addAllToBasket() {
      const selectedItems = this.items
          .map((item, index) => ({
            item,
            quantity: this.quantities[index] || 0,
          }))
          .filter((entry) => this.isValidQuantity(entry.quantity));

      // Ajouter chaque article sélectionné au panier
      for (const { item, quantity } of selectedItems) {
        await this.addToBasket({ item, quantity });
      }

      this.showSuccessMessage("Tous les articles sélectionnés ont été ajoutés au panier.");

      // Réinitialiser les quantités après ajout
      this.quantities = new Array(this.items.length).fill(0);
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = "";
      }, 3000); // Effacer le message après 3 secondes
    },
  },

  mounted() {
    // Initialiser les quantités à 0 pour chaque article
    this.quantities = new Array(this.items.length).fill(0);
  },
};
</script>

<style scoped>
.items-list {
  max-width: 600px;
  margin: auto;
}

.v-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.v-btn {
  min-width: 120px;
}
</style>
