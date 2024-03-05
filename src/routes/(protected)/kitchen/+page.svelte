<script lang="ts">
  import { getMeal } from '$lib/utils';

  export let data;
</script>

<p>What's for {getMeal()}?</p>

{#if data.recipes}
  <ul>
    {#each data.recipes as recipe}
      <li>
        <article>
          <header>
            <h2><a href={`/recipe/${recipe.id}`}>{recipe.title}</a></h2>
          </header>
        </article>
      </li>
    {/each}
  </ul>
{/if}

<a class="button add-button" href="/add-recipe" aria-label="Add new recipe">+</a>

<style>
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
