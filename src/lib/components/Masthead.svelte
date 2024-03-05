<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores';
  import LogoIcon from '$lib/icons/recipe-retrieve-logo.svg?raw';
  import GenericAvatar from '$lib/icons/generic-avatar.svg?raw';

  let loading = false;
  const { user } = authStore;
</script>

<header class="masthead p-2">
  <a href="/" aria-label="Home" class="logo">{@html LogoIcon}</a>

  {#if $page.data.pageTitle}
    <h1 class="masthead-title">{$page.data.pageTitle}</h1>
  {/if}

  <div class="auth-controls">
    {#if $user}
      <a href="/account" class="avatar-link">
        <figure class="avatar">
          {#if $user.avatar}
            <img src={$user.avatar} alt={$user.fullName} referrerpolicy="no-referrer" />
          {:else}
            {@html GenericAvatar}
          {/if}
        </figure>
      </a>
    {:else}
      <form action="/auth/login" method="POST">
        <button class="button fw-bold" disabled={loading}>Log in with Google</button>
      </form>
    {/if}
  </div>
</header>

<style>
  .masthead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--sp-3);
    position: relative;
    z-index: 2;
  }
  .logo {
    margin-top: calc(var(--sp-3) * -2);
    display: block;
    transition: transform var(--transition);
  }
  .logo:hover {
    transform: translateY(-6px);
  }
  .logo :global(svg) {
    transform: rotate(180deg);
    display: block;
    height: 60px;
  }

  .masthead-title {
    flex: 1;
    text-shadow: 1px 1px 1px var(--c-white);
  }

  .avatar {
    width: 38px;
    height: 38px;
    display: block;
    /* border-radius: var(--border-radius-max); */
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--c-dark);
  }
  .avatar img {
    width: 100%;
    display: block;
  }
</style>
