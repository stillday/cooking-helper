<script lang="ts">
  import { redirect } from '@sveltejs/kit';
  import { writable } from 'svelte/store';

  export let data;

  let tableData, ingredData, kitchenData, dietData, bookData;

  $: {
    if (data) {
      ({ tableData, ingredData, kitchenData, dietData, bookData } = data);
    }
  }

  let selectedUnits = [];
  let selectedIngredients = [];
  let selectedQuantities = [];
  let dishName = '';
  let selectedKitchen = '';
  let selectedDiet = '';
  let selectedBook = '';
  let newBook = '';
  let page = '';

  function handleChangeUnit(event, index) {
    selectedUnits[index] = event.target.value;
  }

  function handleChangeIngredient(event, index) {
    selectedIngredients[index] = event.target.value;
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

  async function addNewBook() {
    // Überprüfe, ob das Buch bereits in der bookData-Liste vorhanden ist
    if (bookData.some(book => book.name === newBook)) {
      console.log('Book already exists');
      return;
    }

    // Füge das neue Buch der bookData-Liste hinzu
    const { data, error } = await supabase.from('book').insert([{ name: newBook }]);
    if (error) {
      console.error('Failed to add new book:', error);
      return;
    }

    // Aktualisiere die bookData-Liste mit dem neuen Buch
    bookData = [...bookData, data[0]];

    // Setze das newBook-Feld zurück
    newBook = '';
  }

  // async function saveRecipe() {
  //   const { data, error } = await supabase.from('recipe').insert([
  //     {
  //       name: dishName,
  //       'kitchen-id': selectedKitchen,
  //       'diet-id': selectedDiet,
  //       'book-id': selectedBook,
  //       page: page
  //     }
  //   ]);

  //   if (error) {
  //     console.error('Failed to save recipe:', error.message);
  //   } else {
  //     console.log('Recipe saved successfully:', data);
  //   }
  // }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<form method="POST">
  <div>
    <label for="dishName">Dish Name:</label>
    <input name="dishName" type="text" id="dishName" bind:value={dishName} on:input={handleDishNameChange} />
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
    <label for="book">Book:</label>
    <select name="book" id="book" on:change={handleBookChange}>
      <option value="">--Select--</option>
      {#each bookData as book}
        <option value={book.id}>{book.name}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label for="page">Page:</label>
    <input name="page" type="number" id="page" bind:value={page} on:input={handlePageChange} />
  </div>
  
  <div>
    <h3>Ingredients</h3>
    {#each selectedIngredients as ingredient, index}
      <div>
        <select name="ingredient.unit" on:change={event => handleChangeUnit(event, index)}>
          <option value="">--Select--</option>
          {#each tableData as unit}
            <option value={unit.id}>{unit.name}</option>
          {/each}
        </select>
        <select name="ingredient.name" on:change={event => handleChangeIngredient(event, index)}>
          <option value="">--Select--</option>
          {#each ingredData as ingredient}
            <option value={ingredient.id}>{ingredient.name}</option>
          {/each}
        </select>
        <input name="ingredient.quantity" type="text" on:input={event => handleChangeQuantity(event, index)} />
      </div>
    {/each}
    <button on:click={addDropdown} type="button">Add Ingredient</button>
  </div>
  
  <div>
    <input type="text" bind:value={newBook} />
    <button on:click={addNewBook}>Add New Book</button>
  </div>
  
  <div>
    <button>Save Recipe</button>
  </div>
</form>
