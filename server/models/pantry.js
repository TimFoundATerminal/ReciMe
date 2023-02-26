const db = require('./db');

function getAll() {
    const data = db.query('SELECT * FROM pantry', []);
    return data
}

function getItem(id) {
    const data = db.queryRow('SELECT * FROM pantry WHERE itemID = ?', id)
    return data
}

function createItem(pantryObj) {
    const result = db.run(
        'INSERT INTO pantry (ingredientID, quantity, dateAdded, dateExpiry, frozen) \
         VALUES (@ingredientID, @quantity, @dateAdded, @dateExpiry, @frozen)', pantryObj);        
    return {message:db.validateChanges(result, 'Pantry item created successfully', 'Error in creating pantry item')};
}

function deleteItem(id) {
    const result = db.run(
        'DELETE FROM pantry WHERE itemID = @id', {id: id});        
    return {message:db.validateChanges(result, 'Pantry item deleted successfully', 'Error deleting pantry item')};
}

function updateItem(id, body) {
    if (Object.keys(body).length === 0) {

        let error = new Error('Request body can\'t be blank');
        error.statusCode = 400;
        throw error;
    }
    sqlStatement = 'UPDATE pantry SET '
    for (const key in body) {
        sqlStatement = sqlStatement + key.toString() + ' = ?'
        if (key === Object.keys(body)[Object.keys(body).length - 1]) {
            sqlStatement = sqlStatement + ' ';;
        } else {
            sqlStatement = sqlStatement + ', ';
        }
    }
    sqlStatement = sqlStatement + 'WHERE itemID = ?'
    vals = Object.values(body);
    vals.push(id);
    const result = db.run(sqlStatement, vals);
    return {message:db.validateChanges(result, 'Pantry item updated successfully', 'Error updating pantry item')};
}

module.exports = {
    getAll,
    getItem, 
    createItem, 
    deleteItem,
    updateItem
}