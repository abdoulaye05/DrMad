<template>
  <v-container fluid class="shop-buy">
    <!-- Panneau de gauche : Liste des articles -->
    <v-row>
      <v-col cols="12" md="6" class="left-pane">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="headline">Articles disponibles</v-card-title>
          <ItemsList />
        </v-card>
      </v-col>

      <!-- Panneau de droite : Panier -->
      <v-col cols="12" md="6" class="right-pane">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="headline">Votre panier</v-card-title>
          <BasketList />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ItemsList from "../components/ItemsList.vue";
import BasketList from "../components/BasketList.vue";

export default {
  name: "ShopBuy",
  components: {
    ItemsList,
    BasketList,
  },
  mounted() {
    // Charger les articles disponibles dès le montage du composant
    this.$store.dispatch("shop/getAllViruses");
  },
};
</script>

<style scoped>
.shop-buy {
  padding: 20px;
}

.left-pane,
.right-pane {
  margin-bottom: 20px;
}

.headline {
  color: #7b241c; /* Accent sur le titre */
}

/*.v-card {
  background-color: #f5f5f5; !* Couleur de fond claire *!
  border-radius: 8px;
}*/
</style>
