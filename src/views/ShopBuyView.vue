<template>
  <v-container fluid class="shop-buy">
    <v-row>
      <!-- Panneau de gauche : Liste des articles avec filtres -->
      <v-col cols="12" md="6" class="left-pane">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="headline">Articles disponibles</v-card-title>
          <v-divider></v-divider>
          <!-- Section des filtres -->
          <v-card-text>
            <v-text-field
                v-model="filterKeyword"
                label="Rechercher par nom"
                outlined
                dense
                clearable
                prepend-inner-icon="mdi-magnify"
                class="mb-4"
            ></v-text-field>

            <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Trier par"
                outlined
                dense
                class="mb-4"
                prepend-inner-icon="mdi-sort"
            ></v-select>

            <v-checkbox
                v-model="showInStockOnly"
                label="Afficher uniquement les articles en stock"
                dense
                class="mb-4"
            ></v-checkbox>
          </v-card-text>
          <v-divider class="mb-4"></v-divider>

          <!-- Liste filtrée des articles -->
          <ItemsList :items="filteredItems" />
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
import { mapState } from "vuex";

export default {
  name: "ShopBuy",
  components: {
    ItemsList,
    BasketList,
  },
  data() {
    return {
      filterKeyword: "", // Mot-clé pour rechercher par nom
      sortBy: null, // Option de tri
      showInStockOnly: false, // Filtrer uniquement les articles en stock
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
  computed: {
    ...mapState("shop", ["viruses"]),
    filteredItems() {
      let filtered = [...this.viruses];

      // Filtrer par mot-clé
      if (this.filterKeyword) {
        const keyword = this.filterKeyword.toLowerCase();
        filtered = filtered.filter((item) =>
            item.name.toLowerCase().includes(keyword)
        );
      }

      // Filtrer uniquement les articles en stock
      if (this.showInStockOnly) {
        filtered = filtered.filter((item) => item.stock > 0);
      }

      // Trier les articles
      if (this.sortBy) {
        switch (this.sortBy) {
          case "nameAsc":
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "nameDesc":
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "priceAsc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "priceDesc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "stockAsc":
            filtered.sort((a, b) => a.stock - b.stock);
            break;
          case "stockDesc":
            filtered.sort((a, b) => b.stock - a.stock);
            break;
        }
      }

      return filtered;
    },
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
</style>
