<template>
  <div>
    <button @click.prevent="login()">Sign in</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Home',
  methods: {
    ...mapActions('auth', ['attemptExternalLogin']),
    login() {
      this.attemptExternalLogin('Google');
    },
  },
};
</script>
