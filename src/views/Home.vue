<template>
  <div class="login">
    <h1>Recipe Retrieve</h1>
    <button class="btn" @click="login">
      Sign in with Google
    </button>
  </div>
</template>

<script>
import { auth, authProvider } from '@/firebase';

export default {
  name: 'Login',
  methods: {
    login() {
      auth.signInWithPopup(authProvider).then(() => {
        this.$router.replace('/recipes');
      }).catch(err => {
        console.error(err);
      });
    },
  },
};
</script>

