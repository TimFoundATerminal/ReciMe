
const url = `https://api.spoonacular.com/recipes/631807/nutritionWidget.json?apiKey=54385497726e4c6b9dba6f8704f480c3`

// spponacular js
var fs = require('fs');

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
    fs.writeFile("get-nutrition.json", JSON.stringify(json), function(err) {
      if (err) {
        console.log(err);
      }
    });
    
  })
  .catch(error => console.error('Error:', error));


