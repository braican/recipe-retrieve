<script lang="ts">
  import { getMeal } from '$lib/utils';
  import { RecipeCard } from '$lib/components';

  export let data;
</script>

<p class="fs-2 fw-bold">What's for {getMeal()}?</p>

{#if data.recipes}
  <ul class="list mt-4">
    {#each data.recipes as recipe}
      <li>
        <RecipeCard {recipe} />
      </li>
    {/each}
  </ul>
{/if}

<a class="button add-button" href="/add-recipe" aria-label="Add new recipe">+</a>

<style>
  .list {
    display: grid;
    gap: var(--sp-2);
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  .add-button {
    position: fixed;
    bottom: var(--sp-2);
    right: var(--sp-2);
    text-decoration: none;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    line-height: 1;
    font-weight: var(--fw-bold);
  }
</style>
