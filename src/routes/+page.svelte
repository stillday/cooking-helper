<script lang="ts">
  import { redirect } from '@sveltejs/kit';
  import { getSession } from '@supabase/supabase-js';

  let user, tableData, ingredData, kitchenData, dietData, bookData;

  export async function load({ context }) {
    const session = await getSession(context.headers.cookie);

    // if (!session) {
    //   throw redirect(303, '/');
    // }

    const { data: tableData, error: tableError } = await supabase.from('units').select('*');
    const { data: ingredData, error: ingredError } = await supabase.from('ingredients').select('*');
    const { data: kitchenData, error: kitchenError } = await supabase.from('kitchen').select('*');
    const { data: dietData, error: dietError } = await supabase.from('diet').select('*');
    const { data: bookData, error: bookError } = await supabase.from('book').select('*');

    if (tableError || ingredError || kitchenError || dietError || bookError) {
      throw new Error('Failed to fetch data from the database.');
    }

    return {
      props: {
        user: session?.user,
        tableData,
        ingredData,
        kitchenData,
        dietData,
        bookData
      }
    };
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
    bookData.push(data[0]);

    // Setze das newBook-Feld zurück
    newBook = '';
  }

  async function saveRecipe() {
    const { data, error } = await supabase.from('recipe').insert([
      {
        name: dishName,
        'kitchen-id': selectedKitchen,
        'diet-id': selectedDiet,
        'book-id': selectedBook,
        page: page
      }
    ]);

    if (error) {
      console.error('Failed to save recipe:', error.message);
    } else {
      console.log('Recipe saved successfully:', data);
    }
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<div>Protected content for {user?.email}</div>

<div>
  <label for="dishName">Dish Name:</label>
  <input type="text" id="dishName" bind:value={dishName} on:input={handleDishNameChange} />
</div>

<div>
  <label for="kitchen">Kitchen:</label>
  <select id="kitchen" on:change={handleKitchenChange}>
    <option value="">--Select--</option>
    {#each kitchenData as kitchen (kitchen.id)}
      <option value={kitchen.id}>{kitchen.name}</option>
    {/each}
  </select>
</div>

<div>
  <label for="diet">Diet:</label>
  <select id="diet" on:change={handleDietChange}>
    <option value="">--Select--</option>
    {#each dietData as diet (diet.id)}
      <option value={diet.id}>{diet.name}</option>
    {/each}
  </select>
</div>

<div>
  <label for="book">Book:</label>
  <select id="book" on:change={handleBookChange}>
    <option value="">--Select--</option>
    {#each bookData as book (book.id)}
      <option value={book.id}>{book.name}</option>
    {/each}
  </select>
  <input type="text" placeholder="New Book" bind:value={newBook} />
  <button on:click={addNewBook}>Add Book</button>
</div>

<div>
  <label for="page">Page:</label>
  <input type="text" id="page" bind:value={page} on:input={handlePageChange} />
</div>

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  {#each selectedUnits as _, index}
    <div>
      <input type="number" placeholder="Quantity" on:input={event => handleChangeQuantity(event, index)} />
      <select on:change={event => handleChangeUnit(event, index)}>
        <option value="">--Select--</option>
        {#each tableData as item (item.id)}
          <option value={item.id}>{item.name}</option>
        {/each}
      </select>
      <select on:change={event => handleChangeIngredient(event, index)}>
        <option value="">--Select--</option>
        {#each ingredData as item (item.id)}
          <option value={item.id}>{item.name}</option>
        {/each}
      </select>
    </div>
  {/each}
</div>

<button on:click={addDropdown}>Add Dropdown</button>

<button on:click={saveRecipe}>Save Recipe</button>

{#each selectedUnits as unit, index}
  {#if unit}
    <div>
      <div>Quantity: {selectedQuantities[index]}</div>
      <div>You selected Unit: {tableData.find(item => item.id === unit)?.name}</div>
    </div>
  {/if}
  {#if selectedIngredients[index]}
    <div>You selected Ingredient: {selectedIngredients[index]}</div>
  {/if}
{/each}
