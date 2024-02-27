<script lang="ts">
  import { ManualInputForm } from '$lib/components';

  export let form;
  let recipeImage = '';

  let image = '';

  let view: 'aiParse' | 'manualInput' = 'aiParse';
  let formAction = '?/parse';
  let error: string | null = null;

  if (form?.action === 'parse') {
    if (form.error) {
      error = form.error;
    }
  }

  const setImage = () => {
    if (image) {
      fetch(image).then(response => {
        recipeImage = response.ok ? image : '';
      });
    } else {
      recipeImage = '';
    }
  };
</script>

<form method="POST" class="add-recipe-form">
  {#if recipeImage}
    <figure class="background-image">
      <img src={recipeImage} alt="recipe shot" />
    </figure>
  {/if}
  <label class="form-label-group">
    <span class="form-label">Title</span>
    <input type="text" name="title" placeholder="Chicken cacciatore" />
  </label>

  <label class="form-label-group">
    <span class="form-label">Source</span>
    <input type="url" name="title" placeholder="https://seriouseats.com" />
  </label>

  <label class="form-label-group">
    <span class="form-label">Image</span>
    <input type="url" name="image" bind:value={image} on:blur={setImage} />
  </label>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <ul class="inline-list mb-3 pt-3">
    <li>
      <button
        type="button"
        class="tab-button"
        class:tab-button--active={view === 'aiParse'}
        on:click={() => (view = 'aiParse')}>Paste</button>
    </li>
    <li>
      <button
        type="button"
        class="tab-button"
        class:tab-button--active={view === 'manualInput'}
        on:click={() => (view = 'manualInput')}>Manual input</button>
    </li>
  </ul>

  {#if view === 'aiParse'}
    <label class="form-label-group">
      <span class="form-label">Recipe</span>
      <textarea name="recipe"></textarea>
    </label>
  {:else if view === 'manualInput'}
    <ManualInputForm />
  {/if}

  <button class="button" type="submit" formaction={formAction}>Add Recipe</button>&nbsp;&nbsp;
  <a href="/kitchen" class="link">Cancel</a>
</form>

<style>
  .add-recipe-form {
    view-transition-name: newRecipe;
    position: relative;
  }

  .background-image {
    width: 100vw;
    height: 50vh;
    position: absolute;
    left: calc(var(--sp-3) * -1);
    top: calc(var(--sp-3) * -1);
    margin: 0;
    z-index: -1;
    display: block;
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
