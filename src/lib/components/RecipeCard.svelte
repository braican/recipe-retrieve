<script lang="ts">
  import type { Recipe } from '$userTypes';

  export let recipe: Recipe;
</script>

<article class="card">
  <a class="link" href={`/recipe/${recipe.id}`}>
    {#if recipe.image_url}
      <figure class="image">
        <img src={recipe.image_url} alt={recipe.title} />
      </figure>
    {/if}
    <div class="p-3">
      <h2 class="title">{recipe.title}</h2>
    </div>
  </a>
</article>

<style>
  .card {
    border-radius: var(--border-radius);
    border: 1px solid var(--c-gray-accent);
    overflow: hidden;
  }
  .image {
    height: 0;
    padding-bottom: 33%;
    position: relative;
    width: 100%;
  }
  .image img {
    transition: transform var(--transition);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .link:hover .image img {
    transform: scale(1.04);
  }

  .link {
    text-decoration: none;
    color: inherit;
  }

  .title {
    display: inline;
    transition: background-size var(--transition);
    background-image: linear-gradient(
      var(--c-primary-transparent-hover),
      var(--c-primary-transparent-hover)
    );
    background-repeat: no-repeat;
    background-size: 100% 0;
    background-position: bottom right;
  }
  .link:hover .title {
    background-size: 100% 8px;
  }
</style>
