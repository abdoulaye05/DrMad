<template>
  <v-app-bar app color="#7b241c" dark>
    <!-- Menu burger à gauche -->
    <v-btn icon @click="drawer = !drawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Titre ou espace pour le menu -->
    <v-toolbar-title class="ml-2">Boutique</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Logo à droite -->
    <v-img
        src="@/assets/logo.png"
        alt="Logo"
        max-height="40"
        max-width="40"
        contain
    />

    <!-- Drawer pour le menu burger -->
    <v-navigation-drawer
        v-model="drawer"
        app
        temporary
        class="menu-drawer"
        width="300"
    >
      <v-list dense>
        <v-list-item-group>
          <v-list-item
              v-for="(link, index) in links"
              :key="index"
              :to="link.to"
              @click="link.action === 'logout' ? $emit('menu-clicked', link.action) : drawer = false"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "NavBar",
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapGetters('user', ['isLogged']),
    links() {
      const links = [];

      if (!this.isLogged) {
        links.push({ text: 'Bank', icon: 'mdi-bank', to: { name: 'bankaccount' } });
        links.push({ text: 'Login', icon: 'mdi-login', to: { name: 'shoplogin' } });
      } else {
        links.push({ text: 'Bank', icon: 'mdi-bank', to: { name: 'bankaccount' } });
        links.push({ text: 'Home', icon: 'mdi-home', to: { name: 'home' } });
        links.push({ text: 'Shop', icon: 'mdi-account', to: { name: 'shophome' } });
        links.push({ text: 'Buy', icon: 'mdi-account', to: { name: 'shopbuy' } });
        links.push({ text: 'Order', icon: 'mdi-account', to: { name: 'shoporders' } });
        links.push({ text: 'Viruses', icon: 'mdi-virus', to: { name: 'shopitems' } });
        links.push({ text: 'Logout', icon: 'mdi-logout', action: 'logout' });
      }

      return links;
    },
  },
};
</script>


<style scoped>
.menu-drawer {
  background-color: #2c3e50;
  z-index: 2000;
}

.v-list-item {
  transition: background-color 0.3s;
  cursor: pointer;
}

.v-list-item:hover {
  background-color: #34495e;
}

.v-list-item-title {
  color: white;
  font-weight: bold;
}

.v-list-item-icon {
  color: white;
}


</style>
