import { query } from "./_generated/server";
import { v } from "convex/values";

export const listDishes = query({
  args: { ingredients: v.string(), dislikedIngredients: v.array(v.string()), cuisine: v.string() },
  handler: async (ctx, args) => {

    const dishesQuery = await ctx.db
    .query("dishes")
    .withSearchIndex("search_ingredients", (q) =>
      q.search("ingredients", args.ingredients).eq("cuisine", args.cuisine)
    )
    .take(300);

    let dishes: string[] = dishesQuery.map(dish => dish.name);
    const ingredients: string[] = dishesQuery.map(dish => dish.ingredients);

    let dislikedDishes = new Set<string>();
  
    for (let i = 0; i < args.dislikedIngredients.length; i++) {
      for (let j = 0; j < ingredients.length; j++) {
        if (ingredients[j].toLowerCase().includes(args.dislikedIngredients[i].toLowerCase())) {
          dislikedDishes.add(dishes[j]);
        }
      }
    }

    return dishes.filter(dish => !Array.from(dislikedDishes).includes(dish));
  },
});