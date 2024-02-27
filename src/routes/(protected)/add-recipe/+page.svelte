<script lang="ts">
  // your script goes here
</script>

<form class="add-recipe-form">
  <label class="form-label-group">
    <span class="form-label">Title</span>
    <input type="text" name="title" placeholder="Chicken cacciatore" />
  </label>

  <label class="form-label-group">
    <span class="form-label">Source</span>
    <input type="url" name="title" placeholder="https://seriouseats.com" />
  </label>

  <label class="form-label-group">
    <span class="form-label">Recipe</span>
    <textarea name="recipe"></textarea>
  </label>

  <button class="button" type="submit">Add Recipe</button>
  <a href="/kitchen">Cancel</a>
</form>

<style>
  .add-recipe-form {
    view-transition-name: newRecipe;
  }
</style>
