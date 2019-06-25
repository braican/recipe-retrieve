<template>
  <div>
    <button class="btn" @click="logout">
      Logout
    </button>

    {{ currentUser.name }}

    <article v-for="(recipe, i) in recipes" :key="i" class="recipes">
      <p>{{ recipe.name }}</p>
    </article>

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
import { auth, recipesCollection } from '@/firebase';
import { mapState } from 'vuex';

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
      recipes: recipesCollection.where('uid', '==', this.currentUser.uid),
    };
  },
  computed: {
    ...mapState(['currentUser']),
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
    logout() {
      auth.signOut().then(() => {
        this.$router.replace('login');
      });
    },
  },
};
</script>

