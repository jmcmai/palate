from datasets import load_dataset
from openai import OpenAI
import os
import pandas as pd

TOGETHER_API_KEY = ""

SYSTEM_PROMPT="""
You are an expert on the origins of food.

Given a dish(food)'s name and a list of ingredients, identify the dish's cuisine. The output should have one word stating the type of cuisine.

For example, given:
Name: chicken pad thai
Ingredients: natural peanut butter,sliced mushrooms,whole wheat angel hair pasta,olive oil,chicken breasts,splenda,fish sauce,chopped cilantro,red chili flakes,yellow pepper

In this case, the output should be:
Thai

Identify the following dish:
"""

client = OpenAI(api_key=TOGETHER_API_KEY,
  base_url='https://api.together.xyz',
)

def main():

    dataset = load_dataset("m3hrdadfi/recipe_nlg_lite")

    df = pd.DataFrame(dataset["train"])

    cols = ["name", "ner"]
    df = df[cols].copy()

    df = df.groupby('name')['ner'].agg(combine_ingredients).reset_index()

    val = 0
    cuisines = []

    for i in df.index:
        content = "Name: " + df['name'][i] + "\nIngredents: " + df['ner'][i]
        chat_completion = client.chat.completions.create(
        messages=[
            {
            "role": "system",
            "content": SYSTEM_PROMPT,
            },
            {
            "role": "user",
            "content": content
            }
        ],
        model="openchat/openchat-3.5-1210",
        max_tokens=112
        )

        cuisines.append(chat_completion.choices[0].message.content)
        print(str(val) + chat_completion.choices[0].message.content)
        val += 1

    df['cuisine'] = cuisines
    df.to_csv("dishes_dataset.csv", index=False)


def combine_ingredients(ingredients):
    all_ingredients = [ingredient.strip() for sublist in ingredients for ingredient in sublist.split(',')]
    return ",".join(list(set(all_ingredients)))


if __name__ == "__main__":
    main()