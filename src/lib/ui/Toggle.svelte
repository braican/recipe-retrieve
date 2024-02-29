<script lang="ts">
  export let label = '';
  export let status = false;
</script>

<label class="toggle mb-3">
  {#if label}
    <span class="label fs--1">{label}</span>
  {/if}

  <input
    class="toggle-input"
    type="checkbox"
    checked={status}
    on:change={() => (status = !status)} />
  <span class="toggle-button"></span>
</label>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .toggle-input {
    display: none;
  }

  .toggle-input::selection {
    background: none;
  }

  .toggle-input + .toggle-button {
    transition: all 0.2s ease;
    outline: 0;
    width: 2.5em;
    height: 1.5em;
    position: relative;
    cursor: pointer;
    user-select: none;
    padding: 2px;
    background: #fff;
    border: 4px solid var(--c-gray-accent);
    border-radius: 2em;
  }

  .toggle-input + .toggle-button:after {
    position: relative;
    display: block;
    content: '';
    width: calc(1.5em - 12px);
    height: calc(1.5em - 12px);
  }

  .toggle-input + .toggle-button:after {
    content: '';
    left: 0;
    transition: all 0.2s ease;
    background: var(--c-gray-accent);
    border-radius: 1em;
  }

  .toggle-input:checked + .toggle-button {
    border-color: var(--c-dark);
    background: var(--c-dark);
  }
  .toggle-input:checked + .toggle-button:after {
    left: calc(50% + 2px);
  }
</style>
