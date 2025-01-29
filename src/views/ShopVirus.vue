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

      <!-- Bouton Ajouter un nouveau virus -->
      <v-btn color="success" class="mt-2" @click="showAddVirusDialog = true">
        <v-icon left>mdi-plus</v-icon> Ajouter un Virus
      </v-btn>

      <!-- Liste des virus -->
      <v-list dense class="mt-4">
        <v-list-item v-for="virus in filteredViruses" :key="virus._id">
          <v-list-item-content>
            <v-list-item-title>{{ virus.name }}</v-list-item-title>
            <v-list-item-subtitle>
              Prix : {{ virus.price }}€ | Stock : {{ virus.stock }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <!-- Bouton Voir Détails -->
          <v-btn icon @click="openDetails(virus)">
            <v-icon color="info">mdi-information</v-icon>
          </v-btn>

          <!-- Bouton Ajouter au panier -->
          <v-btn
              color="primary"
              @click="addToBasket(virus)"
              :disabled="virus.stock === 0"
          >
            Ajouter
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Fenêtre de détails du virus -->
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

    <!-- Fenêtre d'ajout d'un nouveau virus -->
    <v-dialog v-model="showAddVirusDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Ajouter un Virus
          <v-spacer></v-spacer>
          <v-btn icon @click="showAddVirusDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
              v-model="newVirus.name"
              label="Nom du virus"
              outlined dense
          ></v-text-field>
          <v-text-field
              v-model.number="newVirus.price"
              label="Prix (€)"
              type="number"
              outlined dense
          ></v-text-field>
          <v-text-field
              v-model.number="newVirus.stock"
              label="Stock"
              type="number"
              outlined dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="addNewVirus">
            <v-icon left>mdi-check</v-icon> Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ShopVirus",
  data() {
    return {
      filterKeyword: "",
      showDetails: false,
      selectedVirus: null,
      showAddVirusDialog: false,
      newVirus: {
        name: "",
        price: 0,
        stock: 0,
      },
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
    ...mapActions("shop", ["addToBasket", "addVirusToStore"]),

    openDetails(virus) {
      this.selectedVirus = virus;
      this.showDetails = true;
    },

    async addNewVirus() {
      if (!this.newVirus.name || this.newVirus.price <= 0 || this.newVirus.stock < 0) {
        alert("Veuillez remplir correctement tous les champs !");
        return;
      }

      const newVirusData = {
        _id: Math.random().toString(36).substr(2, 9), // Générer un ID temporaire
        name: this.newVirus.name,
        price: this.newVirus.price,
        stock: this.newVirus.stock,
        description: "Nouveau virus ajouté",
        promotion: [],
        links: [],
      };

      await this.addVirusToStore(newVirusData);
      this.showAddVirusDialog = false;
      this.newVirus = { name: "", price: 0, stock: 0 };
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
</style>
