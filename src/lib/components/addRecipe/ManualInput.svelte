<script lang="ts">
  let ingredients: string[] = [];

  function addIngredient() {
    ingredients = [...ingredients.filter(x => x), ''];
  }
</script>

<fieldset class="form-label-group">
  <header class="ingredient-header">
    <legend class="form-label">Ingredients</legend>
  </header>

  {#each ingredients as ingredient, i}
    <div class="mb-1">
      <input type="text" bind:value={ingredients[i]} />
    </div>
  {/each}

  <div class="add-ingredient">
    <button
      type="button"
      class="button button--secondary fs--1 w-100"
      on:click={addIngredient}
      aria-label="Add new ingredient">+ Add ingredient</button>
  </div>
</fieldset>

<label class="form-label-group">
  <span class="form-label">Process</span>
  <textarea name="recipe"></textarea>
</label>

<style>
  .ingredient-header {
    display: flex;
    gap: var(--sp-3);
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--sp-2);
  }

  .add-ingredient {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--sp-3);
  }
</style>
