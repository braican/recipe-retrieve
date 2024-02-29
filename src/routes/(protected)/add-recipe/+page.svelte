<script lang="ts">
  import { BasicLink, Input, MultiInput, Toggle } from '$lib/ui';
  import LeftArrowIcon from '$lib/icons/left-arrow.svg?raw';

  export let form;

  // Form values.
  let title = '';
  let source = '';
  let image = '';
  let recipe = '';
  let ingredients: string[] = [];
  let steps: string[] = [];

  // Other state.
  let renderImage = '';
  let showManualInput = true;

  let error: string | null = null;
  if (form?.error) {
    error = form.error;
  }

  let formAction = '?/parse';

  if (form?.action === 'parse') {
  }

  const setImage = async () => {
    if (image) {
      fetch(image).then(response => {
        renderImage = response.ok ? image : '';
      });
    } else {
      renderImage = '';
    }
  };
</script>

<article class="trs-in-slideup">
  {#if renderImage}
    <figure class="background-image">
      <img src={renderImage} alt="recipe shot" />
    </figure>
  {/if}

  <header class="mb-4">
    <BasicLink href="/kitchen" icon={LeftArrowIcon}>Back</BasicLink>
  </header>

  <form method="POST" class="add-recipe-form">
    {#if error}
      <p class="error mb-4">{error}</p>
    {/if}

    <Input label="Title" name="title" placeholder="Chicken cacciatore" bind:value={title} />
    <Input
      label="Source"
      type="url"
      name="source"
      placeholder="https://seriouseats.com"
      bind:value={source} />
    <Input
      label="Image"
      type="url"
      name="image"
      placeholder="https://images.unsplash.com/photo"
      bind:value={image}
      on:blur={setImage} />

    <Toggle label="Manual input" bind:status={showManualInput} />

    {#if showManualInput}
      <MultiInput label="Ingredients" addMore="Add ingredient" bind:values={ingredients} />
      <MultiInput label="Steps" addMore="Add step" bind:values={steps} type="textarea" />
    {:else}
      <Input
        label="Recipe"
        type="textarea"
        name="recipe"
        placeholder="Paste recipe here"
        bind:value={recipe} />
    {/if}

    <div class="mt-4">
      <button class="button" type="submit" formaction={formAction}>Add Recipe</button>
    </div>
  </form>
</article>

<style>
  .background-image {
    width: 100vw;
    height: 30vh;
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    z-index: -1;
    display: block;
    opacity: 0.5;
  }
  .background-image:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80%;
    background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  }
  .background-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .error {
    color: var(--c-alert-red);
  }
</style>
