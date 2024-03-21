<script lang="ts">
  import { BackgroundImage } from '$lib/components';
  import { Header, IngredientList, StepsList, TagControls } from '$lib/components/recipe';

  export let data;
  let editMode = false;
</script>

<article class="recipe">
  {#if data.recipe.image_url}
    <BackgroundImage
      src={data.recipe.image_url}
      alt={data.recipe.title}
      height="20vh"
      opacity="0.8" />
  {/if}

  <Header {editMode} on:engageEditMode={() => (editMode = true)} />

  <TagControls {editMode} on:cancelEdit={() => (editMode = false)} />

  <div class="recipe-instructions">
    <section class="mt-4 ingredients">
      <IngredientList ingredients={data.recipe.ingredients} recipe={data.recipe} />
    </section>

    <section class="mt-4 steps">
      <StepsList steps={data.recipe.steps} recipe={data.recipe} />
    </section>
  </div>
</article>

<style>
  .recipe {
    padding-bottom: var(--sp-5);
  }

  @media (min-width: 640px) {
    .recipe-instructions {
      display: flex;
      gap: var(--sp-4);
    }
    .ingredients {
      flex: 1 0 30%;
      max-width: 360px;
      min-width: 260px;
    }
    .steps {
      flex: 1 1 60%;
      max-width: 768px;
    }
  }
</style>
