<script lang="ts">
  import { redirect } from '@sveltejs/kit';
  import { writable } from 'svelte/store';

  export let data;

  let tableData, ingredData, kitchenData, dietData, bookData, rankData, popularityData;


  $: {
    if (data) {
      ({ tableData, ingredData, kitchenData, dietData, bookData, rankData, popularityData } = data);
    }
  }

  let isEditing = [];
  let selectedUnits = [];
  let selectedIngredients = [];
  let selectedQuantities = [];
  let dishName = '';
  let dishNote = '';
  let dishDescription = '';
  let selectedKitchen = '';
  let selectedDiet = '';
  let selectedBook = '';
  let selectRank = '';
  let selectPopularity = '';
  let newBook = '';
  let page = '';

  function handleChangeUnit(event, index) {
    selectedUnits[index] = event.target.value;
  }

  function handleChangeIngredient(event, index) {
    const selectedIngredientId = event.target.value;
    const selectedIngredient = ingredData.find(ingredient => ingredient.id === selectedIngredientId);
    selectedIngredients[index] = selectedIngredient;
    !isEditing[index];
  }

  function handleChangeQuantity(event, index) {
    selectedQuantities[index] = event.target.value;
  }

  function addDropdown() {
    selectedUnits = [...selectedUnits, null];
    selectedIngredients = [...selectedIngredients, null];
    selectedQuantities = [...selectedQuantities, null];
  }

  function handleDishNameChange(event) {
    dishName = event.target.value;
  }

  function handelDishDescriptionChange(event) {
    dishDescription = event.target.value;
  }

  function handleDishNoteChange(event) {
    dishNote = event.target.value;
  }

  function handleKitchenChange(event) {
    selectedKitchen = event.target.value;
  }

  function handleDietChange(event) {
    selectedDiet = event.target.value;
  }

  function handleBookChange(event) {
    selectedBook = event.target.value;
  }

  function handlePageChange(event) {
    page = event.target.value;
  }

  function editIngredient(index) {
    isEditing[index];
  }

  function handelDishRank(event) {
    selectRank = event.target.value;
  }

  function handlePopularityChange(event) {
    selectPopularity = event.target.value;
  }

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<form method="POST" action="?/addRecipe" enctype="multipart/form-data">
  <div>
    <label for="dishName">Dish Name:</label>
    <input name="dishName" type="text" id="dishName" bind:value={dishName} on:input={handleDishNameChange} />
  </div>
  <div>
    <label for="dishDescription">Rezept Beschreibung</label>
    <textarea name="dishDescription" id="dishDescription" bind:value={dishDescription} on:input={handelDishDescriptionChange} />
  </div>
  <div>
    <div>
      <label for="dishRank">Bewertung</label>
      <select name="dishRank" id="dishRank" on:change={handelDishRank}>
        <option value="">--Select--</option>
        {#each rankData as rank}
          <option value={rank.id}>{rank.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="dishPopularity">Beliebtheit</label>
      <select name="dishPopularity" id="dishPopularity" on:change={handlePopularityChange}>
        <option value="">--Select--</option>
        {#each popularityData as popularity }
          <option value={popularity.id}>{popularity.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="dishNote">Dish Notizen:</label>
      <textarea name="dishNote" id="dishNote" bind:value={dishNote} on:input={handleDishNoteChange} />
    </div>
  </div>
  
  <div>
    <label for="kitchen">Kitchen:</label>
    <select name="kitchen" id="kitchen" on:change={handleKitchenChange}>
      <option value="">--Select--</option>
      {#each kitchenData as kitchen}
        <option value={kitchen.id}>{kitchen.name}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label for="diet">Diet:</label>
    <select name="diet" id="diet" on:change={handleDietChange}>
      <option value="">--Select--</option>
      {#each dietData as diet}
      <option value={diet.id}>{diet.name}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <div>
      <label for="book">Book:</label>
      <select name="book" id="book" on:change={handleBookChange}>
        <option value="">--Select--</option>
        {#each bookData as book}
          <option value={book.id}>{book.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <input name="newBook" type="text" bind:value={newBook} />
      <button formaction="?/addNewBook">Add New Book</button>
    </div>
  </div>
  
  <div>
    <label for="page">Page:</label>
    <input name="page" type="number" id="page" bind:value={page} on:input={handlePageChange} />
  </div>
  <div>
    <label for="dishImage">Select image:</label>
    <input type="file" id="dishImage" name="dishImage" accept="image/png, image/jpeg">
  </div>
  
  <div>
    <h3>Ingredients</h3>
    {#each selectedIngredients as ingredient, index}
      <div>
        <input name="ingredient.quantity" type="text" on:input={event => handleChangeQuantity(event, index)} />
        <select name="ingredient.unit" on:change={event => handleChangeUnit(event, index)}>
          <option value="">--Select--</option>
          {#each tableData as unit}
            <option value={unit.id}>{unit.name}</option>
          {/each}
        </select>
        <!-- {#if !selectedIngredients[index]} -->
          
          <label for="ingredient-name">Wähle die Zutat</label>
          <input list="ingredient-name-list" id="ingredient.name" name="ingredient.name" on:change={event => handleChangeIngredient(event, index)}>
          <datalist id="ingredient-name-list">
            {#each ingredData as ingredient}
            <option label={ingredient.name} value={ingredient.id}>{ingredient.name}</option>
            {/each}
          </datalist>
        <!-- {/if} -->
        {#if selectedIngredients[index]}
          <!-- <input id="ingredient.name" name="ingredient.name" value={selectedIngredients[index].name}> -->
          <p>{selectedIngredients[index].name}</p>
          <button on:click={() => editIngredient(index)} type="button">Edit</button>
        {/if}
      </div>
      {/each}
    <button on:click={addDropdown} type="button">Add Ingredient</button>
  </div>
  
  
  <div>
    <button>Save Recipe</button>
  </div>
</form>
