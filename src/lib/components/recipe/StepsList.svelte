<script lang="ts">
  export let editMode = false;
  export let steps: string[] = [];
</script>

<h2 class="mb-3 fw-bold">Steps</h2>

<ol class="number-list">
  {#each steps as step}
    <li class="fs-1">{step}</li>
  {/each}
</ol>
