<template>
  <v-navigation-drawer app class="menu-container">
    <v-list dense>
      <template v-for="(item, index) in items">
        <!-- TITRE DU MENU -->
        <v-list-item v-if="item.type === 'title'" :key="'title-' + index">
          <v-list-item-content>
            <v-list-item-title class="menu-title">
              <slot name="menu-title" :label="item.label">
                {{ item.label }}
              </slot>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- LIENS -->
        <v-list-item v-else-if="item.type === 'link'" :key="'link-' + index" link @click="goTo(item.to)" :disabled="item.disabled">
          <v-list-item-content>
            <slot name="menu-link" :label="item.label">
              <v-btn block color="primary" class="menu-button">
                {{ item.label }}
              </v-btn>
            </slot>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "VerticalMenu",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    goTo(dest) {
      if (dest) {
        this.$router.push(dest); // Utilisation directe de Vue Router
      }
    },
  },
};
</script>

<style scoped>
.menu-container {
  background-color: #2c3e50;
  color: white;
  width: 250px; /* Ajuste la largeur du menu */
}

.menu-title {
  font-weight: bold;
  text-transform: uppercase;
  padding: 10px;
  font-size: 14px;
  color: #ecf0f1;
}

.menu-button {
  width: 100%;
  text-align: left;
  font-size: 16px;
}

.menu-button:hover {
  background-color: #9c0000;
  color: white;
}
</style>
