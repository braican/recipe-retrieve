<script lang="ts">
  export let href: string;
  export let icon: string | null = null;
</script>

<a {href} class="link" class:link-with-icon={icon !== null}>
  {#if icon}
    <span class="icon">{@html icon}</span>
    <span class="text"><slot /></span>
  {:else}
    <slot />
  {/if}
</a>

<style>
  .link {
    color: var(--c-dark);
    text-decoration: underline;
  }

  .link-with-icon {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
  }

  .link:hover {
    color: var(--c-primary-dark);
  }

  .icon {
    width: 1rem;
  }
  .icon :global(svg) {
    display: block;
  }
</style>
