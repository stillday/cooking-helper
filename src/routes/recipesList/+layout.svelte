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
<div>
  <label for="filter">Filter:</label>
  <select id="filter" on:change={handleFilterChange}>
    <option value="name">Name</option>
    <option value="rank">Rank</option>
    <option value="popularity">Popularity</option>
    <option value="kitchen">Kitchen</option>
    <option value="diet">Diet</option>
  </select>
</div>
<div class="tile-wrapper">
  <ul class="tile-wrapper-inner">
    {#each recipeData as recipe}
      <li class="tile">
        <img class="tile-img" src={recipe.imageUrl} alt="ein rezept bild von {recipe.name}" /> 
        <div class="tile-text">
          <h2>{recipe.name}</h2>
          <div>
            <p>
              {recipe.description}
            </p>
            <div>
              {recipe.rank.name}
              {recipe.popularity.name}
            </div>
          </div>
        </div>
        <a class="tile-link" href="/recipesList/{recipe.id}" >
        </a>
      </li>
    {/each}
  </ul>

</div>

<slot />

<style>
.tile-wrapper {
}

.tile-wrapper-inner {
  display: grid;
    grid-template-columns: repeat(5, 202px [col-start]);
    column-gap: 10px;
    row-gap: 15px;
}

.tile {
  list-style: none;
  border: 1px solid #000;
  position: relative;
  height: 310px;
}

.tile-img {
  max-width: 200px;
}

.tile-link {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
.tile-text {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 5px;
}
</style>