<!-- ../popup/+page.svelte -->

<script>
  export let selectedRecipe;
  export let onClose;

  let popUpRecipe


  console.log(popUpRecipe);
  async function closePopup() {
    onClose();
  }

</script>

<div class="popup">
  <h2>{selectedRecipe.name}</h2>
  <p>Kitchen: {selectedRecipe}</p>
  <p>Diet: {selectedRecipe}</p>
  <p>Book: {selectedRecipe}</p>
  <p>Page: {selectedRecipe.page}</p>
  <p>Note: {selectedRecipe.note}</p>
  <img src="{selectedRecipe.imageUrl}" alt="Recipe Image">
  <button on:click={closePopup}>Schließen</button>
</div>
