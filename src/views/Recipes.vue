<template>
  <div>
    <AppHeader />

    <Recipe v-for="(recipe, i) in recipes" :key="i" :name="recipe.name" :link="recipe.link" />

    <form @submit.prevent="addRecipe">
      <h2>Add new recipe</h2>
      <input v-model="name" type="text" placeholder="Name" required>
      <input v-model="link" type="text" placeholder="Link">
      <button type="submit">
        Add
      </button>
    </form>
  </div>
</template>

<script>
import { recipesCollection } from '@/firebase';
import { mapState } from 'vuex';
import AppHeader from '@/components/AppHeader';
import Recipe from '@/components/Recipe';

export default {
  name: 'Recipes',
  components: { AppHeader, Recipe },
  data() {
    return {
      recipes: [],
      name: '',
      link: '',
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
  firestore() {
    return {
      recipes: recipesCollection.where('uid', '==', this.currentUser.uid),
    };
  },
  methods: {
    addRecipe() {
      const createdAt = new Date();

      recipesCollection.add({
        name: this.name,
        link: this.link,
        uid: this.currentUser.uid,
        createdAt,
      });

      this.name = '';
      this.link = '';
    },
  },
};
</script>

