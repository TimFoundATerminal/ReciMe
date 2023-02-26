const db = require('./db');

function getAll() {
    const data = db.query('SELECT * FROM waste', []);
    return data
}

function getLog(id) {
    const data = db.queryRow('SELECT * FROM waste WHERE itemID = ?', id)
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
        'DELETE FROM waste WHERE itemID = @id', {id: id});        
    return {message:db.validateChanges(result, 'Waste log deleted successfully', 'Error deleting waste log')};
}

module.exports = {
    getAll,
    getLog,
    createLog,
    deleteLog
}