<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores';
  import LogoIcon from '$lib/icons/recipe-retrieve-logo.svg?raw';
  import GenericAvatar from '$lib/icons/generic-avatar.svg?raw';

  let loading = false;
  let utilityMenuOpen = false;

  const { user } = authStore;

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

<header class="masthead p-2">
  <span class="logo"><a href="/" aria-label="Home" class="logo-link">{@html LogoIcon}</a></span>

  <h1 class="page-title ff-headline fw-bold">{$page.data.pageTitle || 'Recipe Retrieve'}</h1>

  <div class="auth-controls">
    {#if $user}
      <button on:click|stopPropagation={toggleMenuOpen} class="utility-menu-trigger">
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
            <p class="greeting fs--1">{$user.email}</p>
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
      <form action="/auth/login" method="POST">
        <button class="button" disabled={loading}>Log in with Google</button>
      </form>
    {/if}
  </div>
</header>

<style>
  .masthead {
    --shadow-color: 0deg 0% 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--sp-3);
    view-transition-name: header;
  }
  .logo {
    margin-top: calc(var(--sp-3) * -2);
  }
  .logo-link {
    display: block;
    top: calc(var(--sp-3) * 2);
    transition: transform var(--transition);
  }
  .logo-link:hover {
    transform: translateY(-6px);
  }
  .logo :global(svg) {
    transform: rotate(180deg);
    display: block;
    height: 60px;
  }

  .page-title {
    flex: 1;
    font-size: var(--fs-);
  }

  .auth-controls {
    position: relative;
  }

  .utility-menu-trigger {
    display: block;
  }

  .avatar {
    width: 38px;
    height: 38px;
    display: block;
    border-radius: var(--border-radius-max);
    overflow: hidden;
  }
  .avatar img {
    width: 100%;
    display: block;
  }

  .utility-menu {
    position: absolute;
    right: 0;
    margin: 0;
    list-style: none;
    text-align: right;
    border-radius: var(--border-radius);
    background-color: var(--c-secondary);
    padding: var(--sp-2);
    margin-top: var(--sp-3);
    color: var(--c-gray);
  }
  .utility-menu li {
    white-space: nowrap;
  }
  .greeting {
    padding: var(--sp-1);
    font-weight: var(--fw-semibold);
    border-bottom: 1px solid var(--c-gray-accent);
    margin-bottom: var(--sp-1);
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
    color: inherit;
  }
  .utility-link:hover {
    color: var(--c-primary-light);
  }
</style>
