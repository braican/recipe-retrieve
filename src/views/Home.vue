<template>
  <div class="login">
    <h1>Recipe Retrieve</h1>
    <button class="btn" @click="login">
      Sign in with Google
    </button>

    <CookbookIcon />
  </div>
</template>

<script>
import { auth, authProvider } from '@/firebase';
import CookbookIcon from '@/svg/cookbook';

export default {
  name: 'Login',
  components: { CookbookIcon },
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

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';



</style>


