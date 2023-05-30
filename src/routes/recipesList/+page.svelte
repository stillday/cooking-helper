<!-- ../recipesList/+page.svelte -->

<script lang="ts">
  import Popup from '../popup/+page.svelte';
  export let data;

  let recipeData = [];
  let showPopup = false;
  let selectedRecipe = null;

  $: {
    if (data) {
      ({ recipeData } = data);
    }
  }

  function openPopup(recipe) {
    selectedRecipe = recipe;
    console.log('recipe', selectedRecipe)
    showPopup = true;
  }

  function closePopup() {
    showPopup = false;
  }
</script>

<h1>Recipes List</h1>

<ul>
  {#each recipeData as recipe}
    <li>
      <a on:click={() => openPopup(recipe)}>
        {recipe.name}
      </a>
    </li>
  {/each}
</ul>

{#if showPopup}
  <Popup {selectedRecipe} onClose={closePopup}/>
{/if}
