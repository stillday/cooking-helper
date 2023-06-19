<script lang="ts">
  export let data;

  let startDate;
  let endDate;
  let einkaufsliste = [];

  $: {
    if (data && startDate && endDate) {
      einkaufsliste = generateEinkaufsliste(data.planRecipes, startDate, endDate, data.ingredients);
    }
  }

  function generateEinkaufsliste(planRecipes, startDate, endDate, ingredients) {
    // Filtere Rezepte basierend auf dem ausgewählten Zeitraum
    const filteredRecipes = planRecipes.filter((plan) => {
      const planDate = new Date(plan.date);
      return planDate >= startDate && planDate <= endDate;
    });

    // Erstelle ein Objekt zur Verfolgung der benötigten Zutaten und vorhandenen Zutaten
    const ingredientMap = {};

    // Iteriere über die gefilterten Rezepte
    filteredRecipes.forEach((plan) => {
      const recipe = plan.recipe;

      // Iteriere über die Zutaten des Rezepts
      recipe.ingredients.forEach((recipeIngredient) => {
        const ingredientId = recipeIngredient['ingredients-id'];
        const ingredientQuantity = recipeIngredient.amount;

        // Überprüfe, ob die Zutat bereits in der Einkaufsliste enthalten ist
        if (ingredientMap.hasOwnProperty(ingredientId)) {
          // Wenn die Zutat bereits vorhanden ist, erhöhe die benötigte Menge
          ingredientMap[ingredientId].needed += ingredientQuantity;
        } else {
          // Wenn die Zutat noch nicht vorhanden ist, füge sie der Einkaufsliste hinzu
          const ingredient = ingredients.find((item) => item.id === ingredientId);
          if (ingredient) {
            ingredientMap[ingredientId] = {
              name: ingredient.name,
              needed: ingredientQuantity,
              available: 0,
            };
          }
        }
      });
    });

    // Konvertiere das Objekt in ein Array
    const einkaufsliste = Object.values(ingredientMap);

    return einkaufsliste;
  }
</script>

<h1>Einkaufsliste</h1>

<p>Startdatum: <input type="date" bind:value={startDate}></p>
<p>Enddatum: <input type="date" bind:value={endDate}></p>

<div>
  {#each einkaufsliste as ingredient }
    <p>{ingredient.name}: benötigt {ingredient.needed}, vorhanden {ingredient.available}</p>
  {/each}
</div>
