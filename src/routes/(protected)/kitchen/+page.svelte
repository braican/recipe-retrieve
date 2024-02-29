<script lang="ts">
  import { getMeal } from '$lib/utils';
</script>

<p>What's for {getMeal()}?</p>

<a class="button add-button" href="/add-recipe" aria-label="Add new recipe">+</a>

<style>
  .add-button {
    position: fixed;
    bottom: var(--sp-2);
    right: var(--sp-2);
    text-decoration: none;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    line-height: 1;
    font-weight: var(--fw-bold);
  }
</style>
