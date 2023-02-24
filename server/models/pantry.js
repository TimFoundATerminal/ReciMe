const db = require('./db')

function getAll() {
    const data = db.query('SELECT * FROM pantry', []);
    return data
}

function getRow(id) {
    const data = db.query('SELECT * FROM pantry WHERE itemID = ?', [id])
    return data
}

function createItem(pantryObj) {
    const result = db.run(
        'INSERT INTO pantry (ingredientID, quantity, dateAdded, dateExpiry, frozen) \
         VALUES (@ingredientID, @quantity, @dateAdded, @dateExpiry, @frozen)', pantryObj);        
    let message = 'Error in creating pantry item';
    if (result.changes) {
      message = 'Pantry item created successfully';
    } else {
        let error = new Error(message);
        error.statusCode = 400;
        throw error;
    }
  
    return {message:message};
}

function deleteItem(id) {
    const result = db.run(
        'DELETE FROM pantry WHERE itemID = @id', {id: id});        
    let message = 'Error deleting pantry item';
    if (result.changes) {
      message = 'Pantry item deleted successfully';
    } else {
        let error = new Error(message);
        error.statusCode = 400;
        throw error;
    }
  
    return {message:message};
}

module.exports = {
    getAll,
    getRow, 
    createItem, 
    deleteItem
}