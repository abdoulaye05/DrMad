<template>
  <div>
    <div
        v-for="(item, index) in items"
        :key="index"
        class="menu-item"
    >
      <template v-if="item.type === 'title'">
        <slot name="menu-title" :label="item.label">
          <h3 class="menu-title">{{ item.label }}</h3>
        </slot>
      </template>
      <template v-else-if="item.type === 'link'">
        <slot name="menu-link" :label="item.label">
          <v-btn
              text
              block
              :to="item.to"
              class="menu-link"
          >
            {{ item.label }}
          </v-btn>
        </slot>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerticalMenu",
  props: {
    items: {
      type: Array,
      required: true, // Tableau d'objets : { type: "title" | "link", label: string, to?: string }
    },
  },
};
</script>

<style scoped>
.menu-title {
  font-weight: bold;
  text-decoration: underline;
  margin: 10px 0;
}
.menu-link {
  margin: 5px 0;
}
</style>
