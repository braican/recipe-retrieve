<script lang="ts">
  export let icon: string;
</script>

<span class="icon">
  {@html icon}
</span>

<style>
  .icon {
    width: 100%;
  }
  .icon :global(svg) {
    width: 100%;
    display: block;
  }
</style>
