// spponacular js
var fs = require('fs');

// My API key
const apiKey = "7b6470073c6246c1be8039c48fe00dd4"

// Ingredients list separated by ,+
const ingredients = 'chicken,+tomatoes,+rice,+pasta,+pepper,+eggs,+cumin,+salt'

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
