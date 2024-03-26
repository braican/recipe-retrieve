<script lang="ts">
  import BookmarkIcon from '$lib/icons/bookmark.svg?raw';
  import UtensilsIcon from '$lib/icons/utensils.svg?raw';
  import CheckmarkIcon from '$lib/icons/checkmark.svg?raw';

  let madeActive = false;
  let nextCourseActive = false;

  const handleNextCourseClick = () => {
    nextCourseActive = !nextCourseActive;
  };
  const handleMadeClick = () => {
    madeActive = !madeActive;
  };
</script>

<div class="flags mt-4">
  <button type="button" class="made-button" on:click={handleMadeClick} class:active={madeActive}>
    <span class="icon icon--nonactive">{@html UtensilsIcon}</span>
    <span class="icon icon--active">{@html CheckmarkIcon}</span>
    Made it
  </button>
  <button
    type="button"
    class="next-button"
    on:click={handleNextCourseClick}
    class:active={nextCourseActive}>
    <span class="icon">{@html BookmarkIcon}</span> Next Course
  </button>
</div>

<style>
  .flags {
    display: flex;
    gap: var(--sp-3);
  }

  .made-button,
  .next-button {
    transition: all 0.1s;
    border-radius: var(--border-radius);
    border: 1px solid var(--c-gray-accent);
    background-color: var(--c-gray);
    padding: 0.5em;
    font-size: var(--fs--1);
    font-weight: var(--fw-semibold);
    color: var(--c-black);
  }
  .next-button .icon,
  .made-button .icon {
    width: 20px;
  }
  .next-button :global(svg),
  .made-button :global(svg) {
    width: 100%;
    display: block;
  }

  /* Made button */
  .made-button {
    position: relative;
    padding-left: calc(1em + 20px);
    overflow: hidden;
  }
  .made-button .icon {
    position: absolute;
    left: 0.5em;
    top: 50%;
    transform: translateY(-50%);
  }
  .made-button.active {
    background-color: var(--c-secondary-light);
    border-color: var(--c-secondary-light);
  }

  .made-button .icon {
    transition: all 0.2s ease-in-out;
  }
  .made-button .icon--active {
    opacity: 0;
    transform: translateY(100%);
  }
  .made-button.active .icon--active {
    opacity: 1;
    transform: translateY(-50%);
  }
  .made-button.active .icon--nonactive {
    opacity: 0;
    transform: translateY(-150%);
  }

  /* Next button */

  .next-button {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }
  .next-button :global(svg path) {
    transition: fill 0.1s;
    stroke: var(--c-black);
  }
  .next-button.active {
    background-color: var(--c-primary);
    border-color: var(--c-primary);
    color: var(--c-white);
  }
  .next-button:not(.active) :global(svg) {
    animation: untag-bookmark 0.1s ease-in-out normal forwards;
  }
  .next-button.active :global(svg) {
    animation: tag-bookmark 0.4s ease-in-out normal forwards;
  }
  .next-button.active :global(svg path) {
    fill: var(--c-primary-dark);
    stroke: var(--c-primary-dark);
  }

  @keyframes tag-bookmark {
    0% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(1.5) translateY(-0.5em);
    }
    100% {
      transform: scale(1.4) translateY(-0.5em);
    }
  }

  @keyframes untag-bookmark {
    0% {
      transform: scale(1.4) translateY(-0.5em);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }
</style>
