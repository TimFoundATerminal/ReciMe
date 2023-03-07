var fs = require('fs');

const PANTRY_URL = `http://localhost:3000/api/pantry`

// Calls API and saves ''filename'' as json file with API results
const CreatePantryFileFromAPI = async (fileName) => {

    fetch(PANTRY_URL, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(json => {

            // write file to json
            fs.writeFile(fileName, JSON.stringify(json), function (err) {
                if (err) {
                    console.log(err);
                }
            });

        })
        .catch(error => console.error('Error:', error))
}

const updatePantryAfterMeal = (currentPantryItems, recipeData) => {

    // filter unused ingredients
    const usedIngredients = recipeData.usedIngredients

    // loop through every item - get quantity -
    usedIngredients.forEach(ingredient => {

        // calulcate remaining quantity of food in pantry
        const usedPantryItem = currentPantryItems.find(pantryItem => ingredient.name == pantryItem.name)
    
        // if found -- pantryName == ingredientName
        if (usedPantryItem) {

            const item_API_URL = `${PANTRY_URL}/${usedPantryItem.itemID}`

            const remainingAmount = pantryItem.quantity - usedIngredient.amount

            // EDIT - PUT - UPDATED if quantity > 0
            if (remainingAmount > 0) {

                // if quantity > 0 -> update pantry item

                fetch(item_API_URL, {
                    method: 'PUT',
                    body: JSON.stringify({
                        quantity: remainingAmount
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then((msg) => {
                    console.log(msg)
                })

                    .catch(error => console.error('Error this update should not be running:', error))

            // DELETE - UPDATED if quantity <= 0 (used up)
            } else {

                // else -> delete pantry item
                fetch(item_API_URL, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .catch(error => console.error('Error this delete should not be running:', error))

            }
        }
    })

}

var pantryBefore = require('./before.json')
var recipe = require('./recipe.json')

CreatePantryFileFromAPI('before.json')

// This updates API
// const localBaackuPAfterPantry = 
updatePantryAfterMeal(pantryBefore, recipe)

// this checks API
CreatePantryFileFromAPI('after.json')


