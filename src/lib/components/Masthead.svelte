<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { authStore } from '$lib/stores';
  import LogoIcon from '$lib/icons/recipe-retrieve-logo.svg?raw';
  import GenericAvatar from '$lib/icons/generic-avatar.svg?raw';

  let loading = false;
  let utilityMenuOpen = false;

  const { supabase, user } = authStore;

  const signInWithGoogle: SubmitFunction = async ({ cancel }) => {
    loading = true;

    const success = await $supabase?.auth.signInWithOAuth({
      provider: 'google',
    });

    if (!success) {
      console.error('There was an error signing you in with Google.');
      return;
    }

    loading = false;
    cancel();
  };

  const closeMenu = (event: MouseEvent | null = null) => {
    const clickedElement = event?.target as HTMLElement;

    if (!event || clickedElement.closest('.utility-menu') === null) {
      utilityMenuOpen = false;
      document.body.removeEventListener('click', closeMenu);
    }
  };

  const toggleMenuOpen = () => {
    if (utilityMenuOpen) {
      return closeMenu();
    }

    utilityMenuOpen = true;
    document.body.addEventListener('click', closeMenu);
  };
</script>

<header class="masthead p-1">
  <span class="logo"><a href="/" aria-label="Home">{@html LogoIcon}</a></span>

  <div class="auth-controls">
    {#if $user}
      <button on:click|stopPropagation={toggleMenuOpen}>
        <figure class="avatar">
          {#if $user.avatar}
            <img src={$user.avatar} alt={$user.fullName} referrerpolicy="no-referrer" />
          {:else}
            {@html GenericAvatar}
          {/if}
        </figure>
      </button>

      {#if utilityMenuOpen}
        <ul class="utility-menu">
          <li>
            <p class="greeting">{$user.email}</p>
          </li>
          <li>
            <a on:click={() => closeMenu()} class="utility-link" href="/account">Account</a>
          </li>
          <li>
            <form method="POST" action="/auth/logout">
              <button class="utility-link" disabled={loading}>Sign Out</button>
            </form>
          </li>
        </ul>
      {/if}
    {:else}
      <form action="/auth/login" method="POST" use:enhance={signInWithGoogle}>
        <button class="button" disabled={loading}>Log in with Google</button>
      </form>
    {/if}
  </div>
</header>

<style>
  .masthead {
    display: flex;
    justify-content: space-between;
  }
  .logo :global(svg) {
    display: block;
    height: 60px;
  }

  .auth-controls {
    position: relative;
  }

  .avatar {
    width: 46px;
    height: 46px;
    display: block;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--c-gray-accent);
    border: 3px solid var(--c-dark-gray);
  }
  .avatar img {
    width: 100%;
    display: block;
  }

  .utility-menu {
    position: absolute;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: right;
    border-radius: var(--border-radius);
    background-color: var(--c-gray);
    padding: var(--sp-1);
  }
  .utility-menu li {
    white-space: nowrap;
  }
  .greeting {
    padding: var(--sp-1);
    font-weight: var(--fw-semibold);
    border-bottom: 1px solid var(--c-gray-accent);
    margin-bottom: var(--sp-1);
    font-size: var(--fs-sm);
  }
  .utility-link {
    display: block;
    width: 100%;
    transition: color var(--transition);
    color: #333;
    text-decoration: none;
    font-weight: var(--fw-medium);
    padding: var(--sp-1);
    text-align: right;
    font-size: var(--fs-sm);
  }
  .utility-link:hover {
    color: var(--c-primary);
  }
</style>
