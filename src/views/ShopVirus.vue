<template>
  <v-container>
    <v-card elevation="2" class="pa-4">
      <v-card-title class="headline">
        🦠 Liste des Virus Disponibles
      </v-card-title>
      <v-divider></v-divider>

      <!-- Barre de recherche -->
      <v-text-field
          v-model="filterKeyword"
          label="Rechercher un virus"
          outlined dense clearable
          prepend-inner-icon="mdi-magnify"
          class="mt-4"
      ></v-text-field>

      <!-- Liste des virus -->
      <v-list dense class="mt-4">
        <v-list-item v-for="virus in filteredViruses" :key="virus._id" class="pa-3">
          <v-list-item-content>
            <v-list-item-title class="text-bold">
              {{ virus.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Prix : <strong>{{ virus.price }}€</strong> | Stock : <strong>{{ virus.stock }}</strong>
            </v-list-item-subtitle>
          </v-list-item-content>

          <!-- Nouveau bouton "Détails" stylé -->
          <v-btn
              color="info"
              outlined
              @click="openDetails(virus)"
              class="mt-2"
          >
            <v-icon left>mdi-information</v-icon> Détails
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Fenêtre de détails -->
    <v-dialog v-model="showDetails" max-width="600px">
      <v-card>
        <v-card-title>
          {{ selectedVirus?.name }}
          <v-spacer></v-spacer>
          <v-btn icon @click="showDetails = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p><strong>Description :</strong> {{ selectedVirus?.description }}</p>
          <p><strong>Prix :</strong> {{ selectedVirus?.price }}€</p>
          <p><strong>Stock :</strong> {{ selectedVirus?.stock }}</p>

          <p v-if="selectedVirus?.promotion.length > 0">
            <strong>Promotions :</strong>
            <ul>
              <li v-for="promo in selectedVirus.promotion" :key="promo._id">
                - {{ promo.discount }}% dès {{ promo.amount }} unités
              </li>
            </ul>
          </p>
          <p v-else>Aucune promotion disponible.</p>

          <p>
            <strong>En savoir plus :</strong>
            <a v-if="selectedVirus?.links.length > 0" :href="selectedVirus.links[0]" target="_blank">
              Wikipédia <v-icon>mdi-open-in-new</v-icon>
            </a>
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

---

### 🔧 **Script (logique de base) :**
```javascript
<script>
import { mapState } from "vuex";

export default {
  name: "ShopVirus",
  data() {
    return {
      filterKeyword: "",
      showDetails: false,
      selectedVirus: null,
    };
  },
  computed: {
    ...mapState("shop", ["viruses"]),

    filteredViruses() {
      return this.viruses.filter((virus) =>
          virus.name.toLowerCase().includes(this.filterKeyword.toLowerCase())
      );
    },
  },
  methods: {
    openDetails(virus) {
      this.selectedVirus = virus;
      this.showDetails = true;
    },
  },
  mounted() {
    this.$store.dispatch("shop/getAllViruses");
  },
};
</script>
<style scoped>
.headline {
  color: #7b241c;
}

.v-list-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
}

.v-list-item-title {
  font-weight: bold;
  color: #4a4a4a;
}

.v-btn {
  width: 140px;
  font-weight: bold;
}
</style>
