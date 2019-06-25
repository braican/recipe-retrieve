<template>
  <div>
    <button class="btn" @click="logout">
      Logout
    </button>

    <article v-for="(recipe, i) in recipes" :key="i" class="recipes">
      <p>{{ recipe.name }}</p>
    </article>

    <form @submit="addRecipe">
      <h2>Add new recipe</h2>
      <input v-model="name" type="text" placeholder="Name" required>
      <input v-model="link" type="text" placeholder="Link" required>
      <button type="submit">
        Add
      </button>
    </form>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';

export default {
  name: 'Recipes',
  data() {
    return {
      recipes: [],
      name: '',
      link: '',
    };
  },
  firestore() {
    return {
      recipes: db.collection('recipes').orderBy('createdAt'),
    };
  },
  methods: {
    addRecipe(name, link) {
      const createdAt = new Date();
      // db.collection('recipes').add({ name, link, createdAt });

      // this.name = '';
      // this.link = '';
    },
    logout() {
      auth.signOut().then(() => {
        this.$router.replace('login');
      });
    },
  },
};
</script>

