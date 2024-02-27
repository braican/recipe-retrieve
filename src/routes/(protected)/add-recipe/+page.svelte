<script lang="ts">
  import { ManualInputForm } from '$lib/components';

  export let form;

  let view: 'aiParse' | 'manualInput' = 'aiParse';
  let formAction = '?/parse';
  let error: string | null = null;

  if (form?.action === 'parse') {
    if (form.error) {
      error = form.error;
    }
  }

  if (form?.recipe) {
    console.log(form.recipe);
  }
</script>

<form method="POST" class="add-recipe-form">
  <label class="form-label-group">
    <span class="form-label">Title</span>
    <input type="text" name="title" placeholder="Chicken cacciatore" />
  </label>

  <label class="form-label-group">
    <span class="form-label">Source</span>
    <input type="url" name="title" placeholder="https://seriouseats.com" />
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
  }

  .error {
    color: var(--c-alert-red);
  }
</style>
