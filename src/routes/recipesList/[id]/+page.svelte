<!-- ../recipesList/[id]/+page.svelte -->

<script>
  export let data;
  
  let popUpRecipeData;

  $: {
    if (data) {
      ({ popUpRecipeData } = data);
      console.log('daten', popUpRecipeData);
    }
  }

</script>

{#if popUpRecipeData}
  <div class="popup">
    <h2>{popUpRecipeData.name}</h2>
    <p>Kitchen: {popUpRecipeData.kitchen.name}</p>
    <p>Diet: {popUpRecipeData.diet.name}</p>
    <p>Book: {popUpRecipeData.book.name}</p>
    <p>Page: {popUpRecipeData.page}</p>
    <p>Note: {popUpRecipeData.note}</p>
    <img src="{popUpRecipeData.imageUrl}" alt="Recipe Image">
    <ul>
      {#each popUpRecipeData['recipe-ingredients'] as ingredient}
        <li>
          {ingredient.amount}
          {ingredient.units.name}
          {ingredient.ingredients.name}
        </li>
      {/each}
    </ul>
    <a href="/recipesList">Schließen</a>
  </div>
{/if}
