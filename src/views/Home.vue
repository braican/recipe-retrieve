<template>
  <div class="home">
    <div class="cover stack">
      <h1 class="title">
        Recipe Retrieve
      </h1>
      <p class="intro">
        Your online recipes, in one place.
      </p>
      <br>
      <button class="btn" @click="login">
        Sign in with Google
      </button>
    </div>

    <div class="art">
      <CookbookIcon />
    </div>
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

.home {
  padding: 20px;
  display: flex;
  height: 100vh;
  align-items: center;
  background-color: $c--teal;
  overflow: hidden;
}

.title, .intro {
  color: $c--white;
}

.intro {
  font-size: 1.5rem;
}

.art {
  display: flex;
  align-items: center;
  order: -1;
  width: 50vw;
  height: 100%;
  padding: 40px;
  position: relative;

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle closest-side, rgba(255, 255, 255, .3), rgba(255, 255, 255, 0));
  }

  svg {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 400px;
    display: block;
    margin: auto;
  }
}

</style>


