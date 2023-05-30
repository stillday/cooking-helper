<!-- ../popup/+page.svelte -->

<script>
  export let selectedRecipe;
  export let onClose;

  let kitchen = null;
  let diet = null;
  let book = null;

  async function loadData() {
    // Abrufen der Kitchen-Daten
    const kitchenResponse = await supabase
      .from('kitchen')
      .select('name')
      .eq('id', selectedRecipe['kitchen-id'])
      .single();
    if (!kitchenResponse.error) {
      kitchen = kitchenResponse.data;
    }

    // Abrufen der Diet-Daten
    const dietResponse = await supabase
      .from('diet')
      .select('name')
      .eq('id', selectedRecipe['diet-id'])
      .single();
    if (!dietResponse.error) {
      diet = dietResponse.data;
    }

    // Abrufen der Book-Daten
    const bookResponse = await supabase
      .from('book')
      .select('name')
      .eq('id', selectedRecipe['book-id'])
      .single();
    if (!bookResponse.error) {
      book = bookResponse.data;
    }
  }

  async function closePopup() {
    onClose();
  }

  loadData();
</script>

<div class="popup">
  <h2>{selectedRecipe.name}</h2>
  <p>Kitchen: {kitchen && kitchen.name}</p>
  <p>Diet: {diet && diet.name}</p>
  <p>Book: {book && book.name}</p>
  <p>Page: {selectedRecipe.page}</p>
  <p>Note: {selectedRecipe.note}</p>
  <img src="{selectedRecipe.imageUrl}" alt="Recipe Image">
  <button on:click={closePopup}>Schließen</button>
</div>
