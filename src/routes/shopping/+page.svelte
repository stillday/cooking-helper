<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

  let startDate;
  let endDate;

  console.log('data', data.ingredients);
</script>

<h1>Einkaufsliste Abfragen</h1>
<form action="?/shoppingList" use:enhance method="POST">
  <p>Startdatum: <input type="date" name="startet" bind:value={startDate} /></p>
  <p>Enddatum: <input type="date" name="ending" bind:value={endDate} /></p>
  <button>Generieren</button>
</form>

<h2>Einkauflste von {startDate} bis {endDate}</h2>

{#each data.ingredients as ingred}
<form action="?/ingredCheck" use:enhance method="POST">
  <div class:checked={ingred.checked === true}>
      
        {ingred.amount}
        {ingred.unit}
        {ingred.name}
      <input type="hidden" name="startTime" bind:value={startDate} />
      <input type="hidden" name="endTime" bind:value={endDate} />
      <input type="hidden" name="unit-id" value={ingred.unit} />
      <input type="hidden" name="ingredient" value={ingred.name} />
      <button disabled={ingred.checked === true}>check</button>
    </div>
</form>  
{/each}

<form
  action="?/cleanShoppingList"
  use:enhance
  method="POST"
  enctype="multipart/form-data"
>
  <input type="hidden" name="startTime" bind:value={startDate} />
  <input type="hidden" name="endTime" bind:value={endDate} />
  <button>Markierte Entfernen</button>
</form>

<style>
  .checked {
    text-decoration: line-through;
  }
</style>
