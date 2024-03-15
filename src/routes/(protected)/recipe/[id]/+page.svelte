<script lang="ts">
  import { BackgroundImage } from '$lib/components';
  import { Header, IngredientList, StepsList, TagControls } from '$lib/components/recipe';
  import { authStore } from '$lib/stores';
  import type { Term } from '$userTypes';

  const { supabase } = authStore;
  export let data;

  let dbIngredients: Term[] = [];
  let dbTags: Term[] = [];
  let editMode = false;

  const engageEditMode = async () => {
    editMode = true;

    if ($supabase && dbIngredients.length === 0 && dbTags.length === 0) {
      const terms = await $supabase.from('terms').select().in('taxonomy', [1, 2]).returns<Term[]>();
      dbIngredients = terms?.data?.filter(({ taxonomy }) => taxonomy === 1) ?? [];
      dbTags = terms?.data?.filter(({ taxonomy }) => taxonomy === 2) ?? [];
    }
  };
</script>

<article class="recipe">
  {#if data.recipe.image_url}
    <BackgroundImage
      src={data.recipe.image_url}
      alt={data.recipe.title}
      height="20vh"
      opacity="0.8" />
  {/if}

  <Header {editMode} on:engageEditMode={engageEditMode} />

  <TagControls {editMode} {dbIngredients} {dbTags} on:cancelEdit={() => (editMode = false)} />

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
