<!-- /lib/components/Dropdown.svelte -->
<script lang="ts">
  export let id = '';
  export let items = [];
  export let searchLabel = '';
  export let searchPlaceholder = '';
  export let selectedId = null;
  export let filterInput = '';
  export let alwaysOpen = false;
  export let required = false;

  let focused = false;
  let wrapper;

  let filteredItems = [];

  $: {
    filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(filterInput.toLowerCase())
    );
    
    if (selectedId) {
      filterInput = selectedId;
    }
  }

  const resetSelected = () => {
    selectedId = null;
    filterInput = '';
    wrapper.querySelector('input').focus();
  };

  const handleBlur = () => {
    setTimeout(() => {
      focused = wrapper.contains(document.activeElement);
    }, 500);
  };

  const makeUniqueId = (base: string) => `${base}_${id}`.replace(/ /g, '_');
</script>

<div class="w-full overflow-visible" class:h-11={!alwaysOpen} bind:this={wrapper}>
  <label class="sr-only" for={makeUniqueId(searchLabel)}>
    {searchLabel}
  </label>
  <input
    placeholder={searchPlaceholder}
    id={makeUniqueId(searchLabel)}
    type="text"
    {required}
    on:focus={() => (focused = true)}
    on:blur={handleBlur}
    on:keyup
    bind:value={filterInput}
    {...$$restProps}
  />
  {#if selectedId}
    <button class="" on:click={resetSelected}>
      {items.find((item) => item.id === selectedId)?.name}
      <span class="sr-only">zurücksetzen</span>
    </button>
  {/if}

  <div
    class={`overflow-y-auto mb-5 scrollbar bg-white relative z-10 ${
      alwaysOpen ? 'max-h-20' : 'max-h-44 border border-t-0 border-blue'
    }`}
    class:hidden={selectedId || !focused && !alwaysOpen}
  >
    {#each filteredItems as item (item.id)}
      <input
        id={makeUniqueId(item.id)}
        class="input_radio opacity-0 absolute pointer-events-none"
        type="radio"
        name={item.name}
        value={item.id}
        bind:group={selectedId}
      />
      <label
        class="study__item flex flex-col overflow-y-auto text-sm hover:bg-blue-base hover:bg-opacity-20 :bg-blue-bchangease px-3 py-1"
        for={makeUniqueId(item.id)}
      >
        {item.name}
      </label>
    {/each}
  </div>
</div>

<style lang="postcss">
  input[type="radio"]:focus + label {
    @apply bg-blue-base bg-opacity-20;
  }
</style>
