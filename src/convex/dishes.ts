import { action, query, internalQuery } from "./_generated/server";
import { api, internal } from "../convex/_generated/api";
import { v } from "convex/values";

export const listDishes = query({
  args: { ingredients: v.string(), cuisine: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (!args.cuisine.length) {
      return;
    }

    const dishesQuery = await ctx.db
      .query("dishes")
      .withSearchIndex("search_ingredients", (q) =>
        q.search("ingredients", args.ingredients).eq("cuisine", args.cuisine[0])
      )
      .take(300);

    let dishesList: string[] = dishesQuery.map((dish) => dish.name);
    const ingredientsList: string[] = dishesQuery.map((dish) => dish.ingredients);

    const result: { dishes: string[]; ingredients: string[] } = {
      dishes: dishesList,
      ingredients: ingredientsList,
    };

    return result;
  },
});

export const getIngredients = internalQuery({
  handler: async (ctx) => {
    const dishes = await ctx.db.query("dishes").collect();

    let ingredientsList: string[] = [];
    ingredientsList = dishes.map((dish) => dish.ingredients);
    let ingredientsSet = new Set<string>();
    for (let i = 0; i < ingredientsList.length; i++) {
      let row: string[] = ingredientsList[i].split(",");
      for (let j = 0; j < row.length; j++) {
        ingredientsSet.add(row[j]);
      }
    }

    let ingredients: string[] = Array.from(ingredientsSet);

    const result: { ingredientsA: string[]; ingredientsB: string[] } = {
      ingredientsA: ingredients.splice(0, Math.ceil(ingredients.length / 2)),
      ingredientsB: ingredients.splice(Math.ceil(ingredients.length / 2), ingredients.length),
    };

    return result;
  },
});

export const searchDishes = action({
  args: {
    ingredients: v.array(v.string()),
    dislikedIngredients: v.array(v.string()),
    cuisine: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const dishesQuery = await ctx.runQuery(api.dishes.listDishes, {
      ingredients: args.ingredients.join(","),
      cuisine: args.cuisine,
    });

    if (!dishesQuery) {
      throw new Error("Unable to query dishes.");
    }

    let dishes: string[] = dishesQuery["dishes"];
    const ingredients: string[] = dishesQuery["ingredients"];
    let dislikedIngredients = await ctx.runAction(api.dishes.matchedIngredients, {
      ingredients: args.dislikedIngredients,
    });

    let dislikedDishes = new Set<string>();

    for (let i = 0; i < dislikedIngredients.length; i++) {
      if (dislikedIngredients[i] === "") {
        continue;
      }
      for (let j = 0; j < ingredients.length; j++) {
        if (ingredients[j].toLowerCase().includes(dislikedIngredients[i].toLowerCase())) {
          dislikedDishes.add(dishes[j]);
        }
      }
    }

    return dishes.filter((dish) => !Array.from(dislikedDishes).includes(dish));
  },
});

export const matchedIngredients = action({
  args: {
    ingredients: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    function levenshteinDistance(a: string, b: string): number {
      let distances = new Array(a.length + 1);
      for (let i = 0; i <= a.length; i++) {
        distances[i] = new Array(b.length + 1);
      }

      for (let i = 0; i <= a.length; i++) {
        distances[i][0] = i;
      }
      for (let j = 0; j <= b.length; j++) {
        distances[0][j] = j;
      }

      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          if (a[i - 1] === b[j - 1]) {
            distances[i][j] = distances[i - 1][j - 1];
          } else {
            distances[i][j] =
              Math.min(distances[i - 1][j], distances[i][j - 1], distances[i - 1][j - 1]) + 1;
          }
        }
      }

      return distances[a.length][b.length];
    }

    let allIngredients = await ctx.runQuery(internal.dishes.getIngredients);

    let matchedIngredients: string[] = [];
    for (let i = 0; i < args.ingredients.length; i++) {
      let bestMatch: string = allIngredients.ingredientsA[0];
      let leastDist: number = levenshteinDistance(
        args.ingredients[i],
        allIngredients.ingredientsA[0]
      );

      for (let j = 0; j < allIngredients.ingredientsA.length; j++) {
        let dist: number = levenshteinDistance(args.ingredients[i], allIngredients.ingredientsA[j]);
        if (dist < leastDist) {
          bestMatch = allIngredients.ingredientsA[j];
          leastDist = dist;
        }
      }

      for (let j = 0; j < allIngredients.ingredientsB.length; j++) {
        const dist: number = levenshteinDistance(
          args.ingredients[i],
          allIngredients.ingredientsB[j]
        );

        if (dist < leastDist) {
          bestMatch = allIngredients.ingredientsB[j];
          leastDist = dist;
        }
      }
      matchedIngredients.push(bestMatch);
    }

    return matchedIngredients;
  },
});
