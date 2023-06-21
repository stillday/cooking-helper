<script lang="ts">
  import { enhance } from '$app/forms';

  export let data;

  let startDate;
  let endDate;

  // $: {
  //   if (data && startDate && endDate) {
  //     einkaufsliste = generateEinkaufsliste(data.planRecipes, startDate, endDate, data.ingredients);
  //   }
  // }


</script>

<h1>Einkaufsliste Abfragen</h1>
<form action="?/shoppingList" use:enhance method="POST">
  <p>Startdatum: <input type="date" name="startet" bind:value={startDate}></p>
  <p>Enddatum: <input type="date" name="ending" bind:value={endDate}></p>
  <button>Generieren</button>
</form>

<form action="?/cleanShoppingList" use:enhance method="POST">
  <fieldset>
    <legend>Einkauflste von {startDate} bis {endDate}</legend>
    
    {#each data.ingredients as ingred}
    <div>
      <input type="checkbox" id={ingred.name} name="ingredient">
      <label for={ingred.name}>
        {ingred.amount}
        {ingred.unit}
        {ingred.name}
      </label>
      
    </div>
    {/each}

    <button>Bereinigen</button>
  </fieldset>
</form>

<style>

</style>