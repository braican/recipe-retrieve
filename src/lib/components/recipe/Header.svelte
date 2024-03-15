<script lang="ts">
  import LeftArrowIcon from '$lib/icons/left-arrow.svg?raw';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores';
  import { EditButton } from '$lib/components';

  export let editMode = false;

  const { session } = authStore;
  const { recipe } = $page.data;
</script>

<header class="header" class:header-with-image={recipe.image_url}>
  <a class="back-link mb-2" href="/kitchen" aria-label="Back to the kitchen"
    >{@html LeftArrowIcon}</a>
  <h1 class="fs-4 fw-bold title">
    {recipe.title}

    {#if !editMode && recipe.user_id === $session?.user.id}
      <EditButton label={`Edit ${recipe.title} recipe`} on:engageEditMode />
    {/if}
  </h1>
  {#if recipe.source_url}
    <a class="basic-link" href={recipe.source_url} target="_blank" rel="noopener">Source</a>
  {/if}
</header>

<style>
  .header-with-image {
    margin-top: 5vh;
  }
</style>
