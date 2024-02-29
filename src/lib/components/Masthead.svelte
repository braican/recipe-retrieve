<script lang="ts">
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
        <button class="button" disabled={loading}>Log in with Google</button>
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
    view-transition-name: header;
  }
  .logo {
    margin-top: calc(var(--sp-3) * -2);
  }
  .logo-link {
    display: block;
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
