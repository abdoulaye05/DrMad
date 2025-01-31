<template>
  <div>
    <table>
      <thead>
      <tr>
        <th v-if="itemCheck"></th>
        <th v-for="header in headers" :key="header.name">{{ header.label }}</th>
        <th v-if="itemButton"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td v-if="itemCheck">
          <input type="checkbox" @change="$emit('itemCheckChanged', index)">
        </td>
        <slot name="items" :item="item">
          <td v-for="header in headers" :key="header.name">{{ item[header.name] }}</td>
        </slot>
        <td v-if="itemButton">
          <button @click="$emit('itemClicked', index)">Button</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button v-if="tableButton" @click="$emit('tableClicked')">Table Button</button>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    itemCheck: {
      type: Boolean,
      default: false
    },
    itemButton: {
      type: Boolean,
      default: false
    },
    tableButton: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
</style>