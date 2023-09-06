<script lang="ts">
  import { enhance } from "$app/forms";
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
        <td>
          <form action="?/cocked" use:enhance method="POST">
            <input type="hidden" name="planId" value={plan.id}>
            <button>Gekocht</button>
          </form>
        </td>
      </tr>
    {/each}
  </table>
</div>