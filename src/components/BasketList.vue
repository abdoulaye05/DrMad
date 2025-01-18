<template>
  <v-card class="basket-list pa-4">
    <v-card-title class="headline">Mon Panier</v-card-title>
    <v-divider></v-divider>

    <!-- Liste des articles dans le panier -->
    <v-list v-if="basket.items && basket.items.length > 0" dense>
      <v-list-item
          v-for="(basketItem, index) in basket.items"
          :key="index"
          class="pa-2"
      >
        <!-- Informations sur l'article -->
        <v-list-item-content>
          <v-list-item-title>{{ basketItem.item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Quantité : {{ basketItem.quantity }} |
            Prix total : {{ (basketItem.item.price * basketItem.quantity).toFixed(2) }} €
          </v-list-item-subtitle>
        </v-list-item-content>

        <!-- Bouton Supprimer -->
        <v-btn color="error" @click="handleRemoveItem(basketItem.item.name)">
          Supprimer
        </v-btn>
      </v-list-item>
    </v-list>

    <!-- Message si le panier est vide -->
    <v-alert v-else type="info" class="mt-4">
      Le panier est vide.
    </v-alert>

    <!-- Total du panier -->
    <v-divider class="my-4"></v-divider>
    <div class="total-price">
      <strong>Total : {{ calculatedTotal.toFixed(2) }} €</strong>
    </div>

    <!-- Actions globales -->
    <v-row justify="space-between" class="mt-4">
      <v-col cols="6">
        <v-btn
            color="error"
            block
            @click="handleClearBasket"
            :disabled="!basket.items || basket.items.length === 0"
        >
          VIDER LE PANIER
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
            color="success"
            block
            @click="handleProcessOrder"
            :disabled="!basket.items || basket.items.length === 0"
        >
          VALIDER LA COMMANDE
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
    ...mapState("shop", ["basket", "shopUser"]),
    calculatedTotal() {
      // Calculer le total du panier
      if (!this.basket.items || this.basket.items.length === 0) return 0;
      return this.basket.items.reduce((total, item) => {
        return total + item.item.price * item.quantity;
      }, 0);
    },
  },
  methods: {
    ...mapActions("shop", ["removeFromBasket", "clearBasket", "createOrder", "loadBasket"]),

    async handleRemoveItem(itemName) {
      try {
        console.log(`Suppression de l'article : ${itemName}`);
        const response = await this.removeFromBasket({ userId: this.shopUser._id, itemName });
        if (response.error === 0) {
          this.showSuccessMessage(`L'article "${itemName}" a été supprimé.`);
        } else {
          console.error("Erreur lors de la suppression de l'article :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
      }
    },

    async handleClearBasket() {
      try {
        console.log("Vidage du panier...");
        const response = await this.clearBasket(this.shopUser._id);
        if (response.error === 0) {
          this.showSuccessMessage("Le panier a été vidé avec succès !");
        } else {
          console.error("Erreur lors du vidage du panier :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors du vidage du panier :", error);
      }
    },

    async handleProcessOrder() {
      try {
        console.log("Validation de la commande...");
        const response = await this.createOrder(this.shopUser._id);
        if (response.error === 0) {
          console.log("Commande validée :", response.data.uuid);
          this.$router.push(`/shop/pay/${response.data.uuid}`);
        } else {
          console.error("Erreur lors de la validation de la commande :", response.data);
          alert("Erreur lors de la validation de la commande. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur inattendue lors de la validation de la commande :", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    },
  },

  mounted() {
    if (this.shopUser) {
      this.loadBasket();
    } else {
      console.warn("Aucun utilisateur connecté. Impossible de charger le panier.");
    }
  },
};
</script>

<style scoped>
.basket-list {
  max-width: 600px;
  margin: auto;
}

.total-price {
  text-align: right;
  font-size: 18px;
  padding: 1rem 0;
}
</style>
