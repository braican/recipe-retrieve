<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  type AllowedInputTypes = 'text' | 'url' | 'textarea';

  export let type: AllowedInputTypes = 'text';
  export let label = '';
  export let name = '';
  export let placeholder = '';
  export let disabled = false;

  export let value = '';

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
  };
</script>

<label class="form-group mb-3">
  {#if label}
    <span class="label">{label}</span>
  {/if}

  {#if type === 'textarea'}
    <textarea {disabled} {name} {placeholder} bind:value on:blur={() => dispatch('blur', { value })}
    ></textarea>
  {:else}
    <input
      {disabled}
      {type}
      {name}
      {placeholder}
      {value}
      on:input={handleInput}
      on:blur={() => dispatch('blur', { value })} />
  {/if}
</label>
