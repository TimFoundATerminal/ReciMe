const db = require('./db');
const ingredientModel = require('./ingredients');

function getAll(dateBefore, dateAfter) {
    const data = db.query(
        'SELECT * \
        FROM waste\
        INNER JOIN ingredients on ingredients.ingredientID = waste.ingredientID\
        and dateThrownAway < ? and dateThrownAway > ?', 
    [dateBefore, dateAfter]);
    return data
}

function getLog(id) {
    const data = db.queryRow('SELECT * FROM waste INNER JOIN ingredients on ingredients.ingredientID = waste.ingredientID WHERE wasteID = ?', id)
    return data
}

function createLog(wasteObj) {
    const carbonPerUnit = ingredientModel.getIngredient(wasteObj.ingredientID).carbonPerUnit
    wasteObj.carbonWasted = (wasteObj.quantity * carbonPerUnit).toFixed(2)
    const result = db.run(
        'INSERT INTO waste (ingredientID, dateThrownAway, quantity, carbonWasted) \
        VALUES (@ingredientID, @dateThrownAway, @quantity, @carbonWasted)', wasteObj);
    return {message:db.validateChanges(result, 'Waste log created successfully', 'Error in creating waste log')};
}

function deleteLog(id) {
    const result = db.run(
        'DELETE FROM waste WHERE wasteID = @id', {id: id});        
    return {message:db.validateChanges(result, 'Waste log deleted successfully', 'Error deleting waste log')};
}

function sumCarbon(dateBefore, dateAfter) {
    const data = db.query(
        'SELECT SUM(carbonWasted) \
        FROM waste WHERE dateThrownAway < ? and dateThrownAway > ?', 
    [dateBefore, dateAfter]);
    return {"total": data[0]["SUM(carbonWasted)"].toFixed(2)}
}

module.exports = {
    getAll,
    getLog,
    createLog,
    deleteLog,
    sumCarbon
}