<template>
  <v-container fluid class="shop-buy">
    <v-row>
      <!-- Panneau de gauche : Liste des articles avec filtres -->
      <v-col cols="12" md="6" class="left-pane">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="headline">Catalogue</v-card-title>
          <v-divider></v-divider>

          <!-- Section des filtres -->
          <v-card-text>
            <v-text-field
                v-model="filterKeyword"
                label="Rechercher par nom"
                outlined dense clearable
                prepend-inner-icon="mdi-magnify"
                class="mb-4"
            ></v-text-field>

            <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Trier par"
                outlined dense
                class="mb-4"
                prepend-inner-icon="mdi-sort"
            ></v-select>

            <v-checkbox
                v-model="showInStockOnly"
                label="Afficher uniquement les articles en stock"
                dense class="mb-4"
            ></v-checkbox>
          </v-card-text>

          <v-divider class="mb-4"></v-divider>

          <!-- Liste filtrée des articles (on passe les filtres en props) -->
          <ItemsList
              :filterKeyword="filterKeyword"
              :sortBy="sortBy"
              :showInStockOnly="showInStockOnly"
          />
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
  data() {
    return {
      filterKeyword: "", // Recherche par nom
      sortBy: null, // Critère de tri
      showInStockOnly: false, // Filtrer par stock
      sortOptions: [
        { text: "Nom (A-Z)", value: "nameAsc" },
        { text: "Nom (Z-A)", value: "nameDesc" },
        { text: "Prix (croissant)", value: "priceAsc" },
        { text: "Prix (décroissant)", value: "priceDesc" },
        { text: "Stock (croissant)", value: "stockAsc" },
        { text: "Stock (décroissant)", value: "stockDesc" },
      ],
    };
  },
  mounted() {
    // Chargement des articles au montage du composant
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
</style>
