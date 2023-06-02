<!-- ../recipesList/+layout.svelte -->

<script lang="ts">
  export let data;

  let recipeData = [];
  let selectedRecipe = null;

  $: {
    if (data) {
      ({ recipeData } = data);
    }
  }

  function closePopup() {
    showPopup = false;
  }
</script>

<h1>Recipes List</h1>

<ul>
  {#each recipeData as recipe}
    <li>
      <a href="/recipesList/{recipe.id}" >
        {recipe.name}
      </a>
    </li>
  {/each}
</ul>

<slot />