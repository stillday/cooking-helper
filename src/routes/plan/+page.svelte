<script lang="ts">
  export let data;

  let planRecipeData;

  $: {
    if (data) {
      ({ planRecipeData } = data);
    }
  }

</script>

<div>
  <table>
    <tr>
      <th>Geplantes Datum</th>
      <th>Rezept Name</th>
      <th>Buch</th>
      <th>Seite</th>
    </tr>
    {#each planRecipeData as plan }
    <tr>
      <td>
        {plan.date}
      </td>
      <td>
        {plan.recipe.name}
      </td>
      <td>
        {plan.recipe.book.name}
      </td>
      <td>
        {plan.recipe.page}
      </td>
    </tr>
    {/each}
  </table>
</div>