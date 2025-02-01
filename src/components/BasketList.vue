<template>
  <v-card class="basket-list pa-4" elevation="2">
    <v-divider></v-divider>

    <!-- Liste des articles dans le panier -->
    <v-list v-if="basket.items && basket.items.length > 0" dense>
      <v-list-item v-for="(basketItem, index) in basket.items" :key="index" class="pa-3">
        <v-card outlined class="pa-3 w-100">
          <v-row>
            <v-col cols="8">
              <v-list-item-title class="font-weight-bold">{{ basketItem.item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                Quantité : <strong>{{ basketItem.quantity }}</strong>
                <br />
                Prix unitaire : <strong>{{ basketItem.item.price.toFixed(2) }} €</strong>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="getDiscount(basketItem) > 0" class="text-success">
                ✅ Promotion appliquée : {{ getDiscount(basketItem) }}% de réduction
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else class="text-info">
                📌 Pas de promotion
              </v-list-item-subtitle>
            </v-col>
            <v-col cols="4" class="d-flex align-end justify-end">
              <v-btn color="error" @click="handleRemoveItem(basketItem.item.name)">Supprimer</v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>
          <v-list-item-subtitle class="text-right">
            Prix total (après réduction) : <strong>{{ calculateItemTotal(basketItem).toFixed(2) }} €</strong>
          </v-list-item-subtitle>
        </v-card>
      </v-list-item>
    </v-list>

    <!-- Message si le panier est vide -->
    <v-alert v-else type="info" class="mt-4">Le panier est vide.</v-alert>

    <!-- Total du panier -->
    <v-divider class="my-4"></v-divider>
    <div class="total-price text-right">
      <h3><strong>Total: {{ calculatedTotal.toFixed(2) }} €</strong></h3>
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
import ShopService from "@/services/shop.service";  // ⚡ Appel direct à l'API
import { mapState, mapActions } from "vuex";

export default {
  name: "BasketList",
  data() {
    return {
      successMessage: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapState("shop", ["basket", "shopUser"]),

    // Calculer le total du panier avec les réductions
    calculatedTotal() {
      return this.basket.items.reduce((total, item) => total + this.calculateItemTotal(item), 0);
    },
  },
  methods: {
    ...mapActions("shop", ["removeFromBasket", "clearBasket", "loadBasket"]),

    calculateItemTotal(basketItem) {
      let basePrice = basketItem.item.price;
      let quantity = basketItem.quantity;
      let discount = this.getDiscount(basketItem);
      let discountedPrice = basePrice * (1 - discount / 100);
      return discountedPrice * quantity;
    },

    getDiscount(basketItem) {
      let promotions = basketItem.item.promotion;
      if (!promotions || promotions.length === 0) return 0;

      let sortedPromotions = [...promotions].sort((a, b) => b.discount - a.discount);
      for (const promo of sortedPromotions) {
        if (basketItem.quantity >= promo.amount) {
          return promo.discount;
        }
      }
      return 0;
    },

    async handleRemoveItem(itemName) {
      this.isLoading = true;
      try {
        await this.removeFromBasket(itemName);
        this.successMessage = `L'article "${itemName}" a été supprimé.`;
      } catch {
        this.errorMessage = "Erreur réseau lors de la suppression.";
      } finally {
        this.isLoading = false;
      }
    },

    async handleClearBasket() {
      this.isLoading = true;
      try {
        await this.clearBasket(this.shopUser._id);
        this.successMessage = "Le panier a été vidé avec succès.";
      } catch {
        this.errorMessage = "Erreur lors du vidage du panier.";
      } finally {
        this.isLoading = false;
      }
    },

    async handleProcessOrder() {
      this.isLoading = true;
      try {
        const order = {
          items: this.basket.items.map((item) => ({
            item: {
              name: item.item.name,
              price: item.item.price,
            },
            quantity: item.quantity,
          })),
        };

        // ⚡ Appel direct à l'API
        const response = await ShopService.createOrder(this.shopUser._id, order);
        if (response.error === 0 && response.data?.uuid) {
          await this.clearBasket(this.shopUser._id);
          this.successMessage = "Commande validée avec succès !";
          setTimeout(() => {
            this.$router.push({ name: "shoppay", params: { uuid: response.data.uuid } });
          }, 2000);
        } else {
          this.errorMessage = "Erreur lors de la validation de la commande.";
        }
      } catch {
        this.errorMessage = "Erreur réseau lors de la commande.";
      } finally {
        this.isLoading = false;
      }
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
  max-width: 700px;
  margin: auto;
}

.total-price {
  font-size: 20px;
  padding: 1rem 0;
}

.v-list-item {
  margin-bottom: 10px;
}

.v-list-item-title {
  font-size: 18px;
}

.text-success {
  color: green;
}

.text-info {
  color: blue;
}
</style>
