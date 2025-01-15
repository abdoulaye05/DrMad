<template>
  <v-card class="basket-list pa-4">
    <v-card-title class="headline">Mon Panier</v-card-title>
    <v-divider></v-divider>

    <!-- Liste des articles dans le panier -->
    <v-list dense>
      <v-list-item
          v-for="(item, index) in basketItems"
          :key="index"
          class="pa-2"
      >
        <!-- Informations sur l'article -->
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Quantité : {{ item.quantity }} | Prix total : {{ item.totalPrice }}€
          </v-list-item-subtitle>
        </v-list-item-content>

        <!-- Bouton Supprimer -->
        <v-btn
            color="error"
            @click="removeItem(index)"
        >
          Supprimer
        </v-btn>
      </v-list-item>
    </v-list>

    <!-- Total du panier -->
    <v-divider class="my-4"></v-divider>
    <div class="total-price">
      <strong>Total : {{ totalPrice }}€</strong>
    </div>

    <!-- Actions globales -->
    <v-row justify="space-between" class="mt-4">
      <v-col cols="6">
        <v-btn
            color="error"
            block
            @click="clearBasket"
            :disabled="basketItems.length === 0"
        >
          Vider le Panier
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
            color="success"
            block
            @click="validateOrder"
            :disabled="basketItems.length === 0"
        >
          Valider la Commande
        </v-btn>
      </v-col>
    </v-row>

    <!-- Message de succès -->
    <v-alert v-if="successMessage" type="success" class="mt-4">
      {{ successMessage }}
    </v-alert>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "BasketList",
  data() {
    return {
      successMessage: "",
    };
  },
  computed: {
    ...mapState("shop", ["basket"]),
    basketItems() {
      return this.basket.items || [];
    },
    totalPrice() {
      return this.basketItems.reduce((sum, item) => sum + item.totalPrice, 0);
    },
  },
  methods: {
    ...mapActions("shop", ["removeFromBasket", "clearBasket", "createOrder"]),
    removeItem(index) {
      this.removeFromBasket(index);
    },
    validateOrder() {
      this.createOrder()
          .then((orderId) => {
            this.clearBasket();
            this.showSuccessMessage("Commande validée avec succès !");
            this.$router.push(`/shop/pay/${orderId}`);
          })
          .catch((error) => console.error("Erreur lors de la validation :", error));
    },
    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = "";
      }, 3000); // Efface le message après 3 secondes
    },
  },
};
</script>

<style scoped>
.basket-list {
  max-width: 600px;
  margin: auto;
}

/*.v-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}*/

.total-price {
  text-align: right;
  font-size: 18px;
}

/*.v-btn {
  min-width: 120px;
}*/
</style>
