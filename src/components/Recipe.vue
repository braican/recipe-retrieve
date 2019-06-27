<template>
  <div class="recipe">
    <p>{{ name }}</p>
    <p v-if="link">
      {{ link }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Recipe',
  props: {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
  },
};
</script>

