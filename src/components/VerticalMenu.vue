<template>
  <div>
    <div v-for="(item, index) in items" :key="index" class="menu-item">
      <v-btn
          text
          block
          :to="item.to"
          class="menu-link"
          :disabled="item.disabled || false"
          @click="emitMenuClick(item.view)"
      >
        {{ item.label }}
      </v-btn>
    </div>
  </div>
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
    emitMenuClick(view) {
      if (view) {
        this.$emit("menu-click", view);
      }
    },
  },
};
</script>
