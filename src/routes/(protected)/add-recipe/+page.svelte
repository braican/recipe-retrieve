<script lang="ts">
  import { enhance } from '$app/forms';
  import { BasicLink, Input, MultiInput, Toggle, AutoInput } from '$lib/ui';
  import { BackgroundImage, StatefulSubmit } from '$lib/components';
  import LeftArrowIcon from '$lib/icons/left-arrow.svg?raw';
  import type { ActionResult } from '@sveltejs/kit';
  import type { SubmitFunction } from './$types';
  import type { Term } from '$userTypes';

  export let form;
  export let data;

  // Form values.
  let title = '';
  let source = '';
  let image = '';
  let recipe = '';
  let ingredients: string[] = [];
  let steps: string[] = [];
  let featuredIngredients: Term[] = [];
  let tags: Term[] = [];

  // Other state.
  let renderImage = '';
  let showManualInput = false;
  let recipeParsed = false;
  let error: string | null = null;
  let loading = false;

  if (form?.error) {
    error = form.error;
  }

  if (form && form.action === 'parse' && form.recipe) {
    showManualInput = true;
    title = form.recipe.title;
    source = form.recipe.source;
    image = form.recipe.image;
    ingredients = form.recipe.ingredients;
    steps = form.recipe.steps;
  }

  $: formAction = showManualInput ? '?/submit' : '?/parse';
  $: buttonText = (() => {
    return showManualInput ? 'Add Recipe' : 'Parse Recipe';
  })();

  const setImage = async () => {
    if (image) {
      fetch(image).then(response => {
        renderImage = response.ok ? image : '';
      });
    } else {
      renderImage = '';
    }
  };

  const handleSubmit: SubmitFunction = () => {
    loading = true;

    return async ({ result, update }: { result: ActionResult; update: Function }) => {
      loading = false;

      if (result.status !== 400 && !showManualInput) {
        recipeParsed = true;
        showManualInput = true;
      }

      if (result.type === 'failure') {
        console.log('Failure.', result);
        error = result.data?.error;
        return;
      }

      if (result.type === 'error') {
        console.log('Error.', result);
        error = result.error.message;
        return;
      }

      if (result.type === 'success' && result.data?.action === 'parse' && result.data?.recipe) {
        error = result.data.error || null;
        ingredients = result.data.recipe.ingredients;
        steps = result.data.recipe.steps;
        return;
      }

      update();
    };
  };
</script>

<article class="trs-in-slideup">
  {#if renderImage}
    <BackgroundImage src={renderImage} alt="recipe shot" />
  {/if}

  <header class="mb-4">
    <BasicLink href="/kitchen" icon={LeftArrowIcon}>Back</BasicLink>
  </header>

  <form
    method="POST"
    class="add-recipe-form"
    action={formAction}
    use:enhance={handleSubmit}
    class:loading>
    {#if error}
      <p class="error mb-4">{error}</p>
    {/if}

    <Input
      label="Title"
      name="title"
      placeholder="Chicken parmesan"
      bind:value={title}
      disabled={loading} />
    <Input
      label="Source"
      type="url"
      name="source"
      placeholder="https://seriouseats.com"
      disabled={loading}
      bind:value={source} />
    <Input
      label="Image"
      type="url"
      name="image"
      placeholder="https://images.unsplash.com/photo"
      bind:value={image}
      disabled={loading}
      on:blur={setImage} />

    <div class="form-columns">
      <AutoInput
        bind:selected={featuredIngredients}
        name="featuredIngredients"
        label="Featured Ingredients"
        options={data.ingredients} />
      <AutoInput bind:selected={tags} label="Tags" name="tags" options={data.tags} />
    </div>

    {#if !recipeParsed}
      <Toggle label="Manual input" bind:status={showManualInput} disabled={loading} />
    {/if}

    {#if showManualInput}
      <MultiInput
        label="Ingredients"
        name="ingredients[]"
        addMore="Add ingredient"
        bind:values={ingredients} />
      <MultiInput
        label="Steps"
        name="steps[]"
        addMore="Add step"
        bind:values={steps}
        type="textarea" />
    {:else}
      <Input
        label="Recipe"
        type="textarea"
        name="recipe"
        placeholder="Paste recipe here"
        disabled={loading}
        bind:value={recipe} />
    {/if}

    <div class="mt-4 actions">
      <StatefulSubmit {loading} {buttonText} />
    </div>
  </form>
</article>

<style>
  .error {
    color: var(--c-alert-red);
  }
  .add-recipe-form.loading {
    pointer-events: none;
  }
  .actions {
    position: relative;
  }
</style>
