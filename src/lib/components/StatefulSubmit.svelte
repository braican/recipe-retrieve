<script lang="ts">
  import { fly } from 'svelte/transition';

  export let loading = false;
  export let buttonText = 'Submit';
</script>

<span class="stateful-submit">
  <button class="button submit-button" type="submit" class:loading>{buttonText}</button>

  {#if loading}
    <span in:fly={{ y: 10, duration: 500, delay: 100 }} class="loader">Loading</span>
  {/if}
</span>

<style>
  .stateful-submit {
    position: relative;
  }
  .submit-button.loading {
    transition: all var(--transition);
    opacity: 0;
    transform: translateY(-4px);
  }

  .loader {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-weight: var(--fw-semibold);
  }
  .loader:after {
    content: '';
    display: block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: var(--c-dark);
    animation: ballbns 0.5s ease-in-out infinite alternate;
  }

  @keyframes ballbns {
    0% {
      left: 0;
      transform: translateX(0%);
    }
    100% {
      left: 100%;
      transform: translateX(100%);
    }
  }
</style>
