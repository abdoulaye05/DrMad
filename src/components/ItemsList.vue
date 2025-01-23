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
            Prix : {{ item.price }}€ | Promo :
            {{ item.promotion ? item.promotion.discount + "%" : "Aucune" }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <!-- Champ Quantité -->
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

        <!-- Bouton Ajouter au panier -->
        <v-btn
            color="primary"
            @click="handleAddToBasket(item, quantities[index], index)"
            :disabled="!isValidQuantity(quantities[index]) || adding"
        >
          Ajouter
        </v-btn>
      </v-list-item>
    </v-list>

    <!-- Bouton Ajouter Tous -->
    <v-divider class="my-4"></v-divider>
    <v-btn
        color="success"
        block
        @click="handleAddAllToBasket"
        :disabled="!canAddAll || adding"
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
      quantities: [], // Quantités par article
      successMessage: "", // Message de confirmation pour l'utilisateur
      adding: false, // Empêche les actions multiples simultanées
    };
  },
  computed: {
    ...mapState("shop", ["viruses"]), // Liste des articles provenant du store Vuex
    items() {
      return this.viruses || [];
    },
    canAddAll() {
      return this.quantities.some((qty) => this.isValidQuantity(qty)); // Vérifie s'il existe une quantité valide
    },
  },
  methods: {
    ...mapActions("shop", ["addToBasket"]),

    // Validation de la quantité
    isValidQuantity(quantity) {
      return quantity && quantity > 0 && Number.isInteger(quantity);
    },

    // Ajouter un seul article au panier
    async handleAddToBasket(item, quantity, index) {
      console.log(`[ItemsList] Tentative d'ajout : ${item.name}, Quantité : ${quantity}`);

      // Validation préliminaire
      if (this.adding) {
        console.warn("[ItemsList] Une autre action est déjà en cours.");
        return;
      }
      if (!this.isValidQuantity(quantity)) {
        alert("Veuillez entrer une quantité valide.");
        return;
      }

      this.adding = true;

      try {
        // Vérification du stock
        if (quantity > item.stock) {
          alert(`Stock insuffisant pour l'article "${item.name}".`);
          console.warn(`[ItemsList] Stock insuffisant pour "${item.name}".`);
          this.adding = false;
          return;
        }

        // Appel à Vuex pour ajouter au panier
        const response = await this.addToBasket({ item, quantity });
        if (response.error === 0) {
          this.showSuccessMessage(`Ajouté ${quantity} de ${item.name} au panier.`);
          this.quantities[index] = 0; // Réinitialiser la quantité à 0
        } else {
          alert("Erreur lors de l'ajout au panier. Veuillez réessayer.");
          console.error(`[ItemsList] Erreur lors de l'ajout :`, response.data);
        }
      } catch (error) {
        console.error(`[ItemsList] Erreur réseau lors de l'ajout :`, error);
        alert("Une erreur réseau s'est produite.");
      } finally {
        this.adding = false;
      }
    },

    // Ajouter tous les articles sélectionnés au panier
    async handleAddAllToBasket() {
      console.log("[ItemsList] Tentative d'ajout de tous les articles sélectionnés.");

      if (this.adding) {
        console.warn("[ItemsList] Une action est déjà en cours.");
        return;
      }

      this.adding = true;

      const selectedItems = this.items
          .map((item, index) => ({
            item,
            quantity: this.quantities[index] || 0,
            index,
          }))
          .filter(({ quantity }) => this.isValidQuantity(quantity)); // Filtrer les quantités valides

      if (selectedItems.length === 0) {
        console.warn("[ItemsList] Aucun article valide pour l'ajout.");
        this.adding = false;
        return;
      }

      try {
        for (const { item, quantity, index } of selectedItems) {
          if (quantity > item.stock) {
            alert(`Stock insuffisant pour "${item.name}".`);
            this.adding = false;
            return;
          }

          const response = await this.addToBasket({ item, quantity });
          if (response.error === 0) {
            this.quantities[index] = 0; // Réinitialiser après ajout
          } else {
            console.error(`[ItemsList] Erreur lors de l'ajout pour "${item.name}".`);
            alert(`Erreur pour "${item.name}".`);
          }
        }

        this.showSuccessMessage("Tous les articles ont été ajoutés au panier.");
      } catch (err) {
        console.error("[ItemsList] Erreur réseau lors de l'ajout de tous les articles :", err);
        alert("Erreur réseau lors de l'ajout.");
      } finally {
        this.adding = false;
      }
    },

    // Afficher un message de succès
    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ""), 3000);
    },
  },

  mounted() {
    console.log("[ItemsList] Initialisation des quantités.");
    this.quantities = new Array(this.items.length).fill(0);
  },

  watch: {
    // Réinitialise les quantités si la liste des articles change
    items: {
      handler() {
        console.log("[ItemsList] Articles mis à jour. Réinitialisation des quantités.");
        this.quantities = new Array(this.items.length).fill(0);
      },
      immediate: true,
    },
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
