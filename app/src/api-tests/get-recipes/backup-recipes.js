// spponacular js
var fs = require('fs');

// My API key
const apiKey = "54385497726e4c6b9dba6f8704f480c3"

const pantryItems = [{"itemID":1,"ingredientID":1,"quantity":100,"dateExpiry":20230224,"frozen":1,"name":"Chicken Breast","standardUnit":"grams","carbonPerUnit":20},{"itemID":2,"ingredientID":2,"quantity":100,"dateExpiry":20230224,"frozen":1,"name":"tomatoes","standardUnit":"grams","carbonPerUnit":400},{"itemID":3,"ingredientID":3,"quantity":100,"dateExpiry":20230224,"frozen":1,"name":"potatoes","standardUnit":"kilos","carbonPerUnit":900}]

// Ingredients list separated by ,+
const ingredients = pantryItems.map(pantryItem => pantryItem.name).join(',+')

// ranking 2 maximises ingredients
const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=10&ranking=2`

// make API call
fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(json => {
    
    // log the data to console
    console.log(json)

    // write file to json
    fs.writeFile("tom.json", JSON.stringify(json), function(err) {
      if (err) {
        console.log(err);
      }
    });
    
  })
  .catch(error => console.error('Error:', error));
