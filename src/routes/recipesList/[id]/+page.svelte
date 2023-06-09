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
    <img class="popup-img" src="{popUpRecipeData.imageUrl}" alt="Recipe Image">
    <h2>{popUpRecipeData.name}</h2>
    <p>Rank: {popUpRecipeData.rank.name}</p>
    <p>popularity: {popUpRecipeData.popularity.name}</p>
    <p>Note: {popUpRecipeData.note}</p>
    <p>Kitchen: {popUpRecipeData.kitchen.name}</p>
    <p>Diet: {popUpRecipeData.diet.name}</p>
    <p>Book: {popUpRecipeData.book.name}</p>
    <p>Page: {popUpRecipeData.page}</p>
    <p>{popUpRecipeData.description}</p>
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

<style>
  .popup {
    position: absolute;
    border: 1px solid #000;
    background: #fff;
  }

  .popup-img {
    margin: 0 auto;
    max-width: 40%;
  } 
</style>