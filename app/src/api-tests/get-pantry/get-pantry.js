// spponacular js
var fs = require('fs');

// ranking 2 maximises ingredients
const url = `http://localhost:3000/api/pantry`

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
    fs.writeFile("pantry.json", JSON.stringify(json), function(err) {
      if (err) {
        console.log(err);
      }
    });
    
  })
  .catch(error => console.error('Error:', error));
