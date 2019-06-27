<template>
  <header class="app-header">
    <button class="btn" @click="logout">
      Logout
    </button>

    <div class="user">
      {{ currentUser.name }}
    </div>
  </header>
</template>

<script>
import { auth } from '@/firebase';
import { mapState } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.$router.replace('login');
      });
    },
  },
};
</script>

