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
  console.log(data)

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
        {recipe.description}
        {recipe.rank.name}
        {recipe.popularity.name}
        <img src={recipe.imageUrl} /> 
      </a>
    </li>
  {/each}
</ul>

<slot />