import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchIngredients, fetchRecipeById } from "../recipes.service";

export default function Update() {
  const { id } = useParams();
  const [Recipe, setRecipe] = useState(null);
  const [NouvIngreList, setNouvIngreList] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchRecipeById(id)
      .then((recipe) => {
        getNameswithrecip(recipe);
        setRecipe(recipe);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      });
  }, [id]); // Add 'id' to the dependency array

  const getNameswithrecip = (recipe) => {
    if (!recipe || !Array.isArray(recipe.ingredients)) {
      console.error("Invalid recipe or ingredients");
      return;
    }

    fetchIngredients()
      .then((ingredients) => {
        const filteredIngredients = ingredients.filter(
          (ing) => !recipe.ingredients.some((recping) => recping.id === ing.id)
        );

        recipe.ingredients.forEach((recping) => {
          const matchingIngredient = ingredients.find(
            (ing) => ing.id === recping.id
          );
          if (matchingIngredient) {
            recping.name = matchingIngredient.name;
          }
        });

        setNouvIngreList(filteredIngredients);
        setRecipe(recipe);
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
      });
  };

  if (loading) {
    return <h1>Loading .... </h1>;
  }

  return (
    <div>
      <h6>Title : {Recipe?.title}</h6>
      <h6>Category : {Recipe?.category} </h6>
      <ul>
        {Recipe?.ingredients?.map((ing) => (
          <li key={ing.id}>
            <input type="text" value={ing.quantity} readOnly />{" "}
            <label>{ing.name}</label>{" "}
          </li>
        ))}
      </ul>
      <h6>Nouvelle Ingredients:</h6>
      <select>
        {NouvIngreList.map((ingredient) => (
          <option key={ingredient.id} value={ingredient.id}>
            {ingredient.name}
          </option>
        ))}
      </select>
      <button>Add</button>
    </div>
  );
}
