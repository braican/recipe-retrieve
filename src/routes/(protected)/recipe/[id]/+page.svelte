<script lang="ts">
  import LeftArrowIcon from '$lib/icons/left-arrow.svg?raw';
  import { BackgroundImage } from '$lib/components';

  export let data;
</script>

<article>
  {#if data.recipe.image_url}
    <BackgroundImage
      src={data.recipe.image_url}
      alt={data.recipe.title}
      height="20vh"
      opacity="0.8" />
  {/if}

  <header class="header" class:header-with-image={data.recipe.image_url}>
    <a class="back-link mb-2" href="/" aria-label="Back to the kitchen">{@html LeftArrowIcon}</a>
    <h1 class="fs-4 fw-bold">{data.recipe.title}</h1>
    {#if data.recipe.source_url}
      <a class="basic-link" href={data.recipe.source_url} target="_blank" rel="noopener">Source</a>
    {/if}
  </header>

  <div class="recipe-instructions">
    <section class="mt-4 ingredients">
      <h2 class="mb-3 fw-bold">Ingredients</h2>

      <ul class="unordered-list">
        {#each data.recipe.ingredients as ingredient}
          <li>{ingredient}</li>
        {/each}
      </ul>
    </section>

    <section class="mt-4 steps">
      <h2 class="mb-3 fw-bold">Steps</h2>

      <ol class="number-list">
        {#each data.recipe.steps as step}
          <li class="fs-1">{step}</li>
        {/each}
      </ol>
    </section>
  </div>
</article>

<style>
  .header-with-image {
    margin-top: 5vh;
  }
  .recipe-instructions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-4);
  }

  .ingredients {
    flex: 0 1 auto;
  }
  .steps {
    flex: 1 1 60%;
    max-width: 768px;
  }
</style>
