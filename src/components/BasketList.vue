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
        <v-list-item-content>
          <v-list-item-title>{{ basketItem.item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Quantité : {{ basketItem.quantity }} |
            Prix total : {{ (basketItem.item.price * basketItem.quantity).toFixed(2) }} €
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn color="error" @click="handleRemoveItem(basketItem.item.name)">
          Supprimer
        </v-btn>
      </v-list-item>
    </v-list>

    <!-- Message si le panier est vide -->
    <v-alert v-else type="info" class="mt-4">Le panier est vide.</v-alert>

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
            :disabled="!basket.items || basket.items.length === 0 || isLoading"
        >
          VIDER LE PANIER
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
            color="success"
            block
            @click="handleProcessOrder"
            :disabled="!basket.items || basket.items.length === 0 || isLoading"
        >
          VALIDER LA COMMANDE
        </v-btn>
      </v-col>
    </v-row>

    <!-- Messages de succès et d'erreur -->
    <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
    <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
  </v-card>
</template>

<script>
import ShopService from "@/services/shop.service";
import { mapState, mapActions } from "vuex";

export default {
  name: "BasketList",
  data() {
    return {
      successMessage: "",
      errorMessage: "",
      isLoading: false, // État de chargement
    };
  },
  computed: {
    ...mapState("shop", ["basket", "shopUser"]),
    calculatedTotal() {
      if (!this.basket.items || this.basket.items.length === 0) return 0;
      return this.basket.items.reduce(
          (total, item) => total + item.item.price * item.quantity,
          0
      );
    },
  },
  methods: {
    ...mapActions("shop", ["removeFromBasket", "clearBasket", "loadBasket"]),

    async handleRemoveItem(itemName) {
      this.isLoading = true;
      try {
        const response = await this.removeFromBasket(itemName);
        if (response.error === 0) {
          this.showSuccessMessage(`L'article "${itemName}" a été supprimé.`);
        } else {
          this.showErrorMessage("Erreur lors de la suppression de l'article.");
        }
      } catch (error) {
        this.showErrorMessage("Erreur réseau. Veuillez réessayer.");
        console.error("[BasketList] Erreur réseau lors de la suppression :", error);
      } finally {
        this.isLoading = false;
      }
    },

    async handleClearBasket() {
      this.isLoading = true;
      try {
        const response = await this.clearBasket(this.shopUser._id);
        if (response.error === 0) {
          this.showSuccessMessage("Le panier a été vidé avec succès !");
        } else {
          this.showErrorMessage("Erreur lors du vidage du panier.");
        }
      } catch (error) {
        this.showErrorMessage("Erreur réseau lors du vidage du panier.");
        console.error("[BasketList] Erreur réseau lors du vidage du panier :", error);
      } finally {
        this.isLoading = false;
      }
    },

    async handleProcessOrder() {
      this.isLoading = true;
      try {
        // Créer l'objet commande à partir du panier
        const order = {
          items: this.basket.items.map((basketItem) => ({
            item: {
              name: basketItem.item.name,
              price: basketItem.item.price,
            },
            quantity: basketItem.quantity,
          })),
        };

        const response = await ShopService.createOrder(this.shopUser._id, order);
        console.log("[BasketList] Réponse de `createOrder` :", response);

        // Vérifier que l'API retourne un `uuid`
        if (response.error === 0 && response.data?.uuid) {
          const orderUuid = response.data.uuid;

          const clearResponse = await this.clearBasket(this.shopUser._id);
          if (clearResponse.error !== 0) {
            this.showErrorMessage("Erreur lors du vidage du panier après la commande.");
            return;
          }

          this.successMessage = "Commande validée avec succès !";
          setTimeout(() => {
            this.$router.push({ name: "shoppay", params: { uuid: orderUuid } });
          }, 2000);
        } else {
          this.showErrorMessage("Erreur ou absence d'UUID dans la réponse de l'API.");
        }
      } catch (error) {
        this.showErrorMessage("Erreur réseau lors de la validation de la commande.");
        console.error("[BasketList] Erreur lors de la validation de la commande :", error);
      } finally {
        this.isLoading = false;
      }
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ""), 3000);
    },

    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = ""), 3000);
    },
  },

  mounted() {
    if (this.shopUser) {
      this.loadBasket();
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
