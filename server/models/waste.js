const db = require('./db');

function getAll() {
    const data = db.query(
        'SELECT * \
        FROM waste\
        INNER JOIN ingredients on ingredients.ingredientID = waste.ingredientID', 
    []);
    return data
}

function getLog(id) {
    const data = db.queryRow('SELECT * FROM waste INNER JOIN ingredients on ingredients.ingredientID = waste.ingredientID WHERE wasteID = ?', id)
    return data
}

function createLog(wasteObj) {
    const result = db.run(
        'INSERT INTO waste (ingredientID, dateThrownAway, quantity) \
         VALUES (@ingredientID, @dateThrownAway, @quantity)', wasteObj);       
    return {message:db.validateChanges(result, 'Waste log created successfully', 'Error in creating waste log')};
}

function deleteLog(id) {
    const result = db.run(
        'DELETE FROM waste WHERE wasteID = @id', {id: id});        
    return {message:db.validateChanges(result, 'Waste log deleted successfully', 'Error deleting waste log')};
}

module.exports = {
    getAll,
    getLog,
    createLog,
    deleteLog
}