// makes connection to database and imports api functionality
const ingredientTbl = require('../models/ingredients');
const pantryTbl = require('../models/pantry');
const wasteTbl = require('../models/waste');

function createIngredientObj(name, standardUnit, carbonPerUnit) {
    return {
        name: name,
        standardUnit: standardUnit,
        carbonPerUnit: carbonPerUnit,
    };
}

function createPantryObj(ingredientID, quantity, dateExpiry, frozen) {
    return {
        ingredientID: ingredientID,
        quantity: quantity, 
        dateExpiry: dateExpiry,
        frozen: frozen,
    };
}

function createWasteObj(ingredientID, dateThrownAway, quantity) {
    return {
        ingredientID: ingredientID,
        dateThrownAway: dateThrownAway,
        quantity: quantity,
    };
}

function addIngredient(name, standardUnit, carbonPerUnit) {
    const ingredient = createIngredientObj(name, standardUnit, carbonPerUnit);
    try {
        ingredientTbl.createIngredient(ingredient);
        console.log("Ingredient: (" + ingredient.name + ", " + ingredient.standardUnit + ", " + String(ingredient.carbonPerUnit) + ") successfully added into databse")
    } catch (error) {
        console.log(error)
    }
}

function addPantryItem(ingredientID, quantity, dateExpiry, frozen) {
    const pantry = createPantryObj(ingredientID, quantity, dateExpiry, frozen)
    try {
        pantryTbl.createItem(pantry);
        console.log("pantry item successfully added into databse")
    } catch (error) {
        console.log(error)
    }
}

function addWasteItem(ingredientID, dateThrownAway, quantity) {
    const waste = createWasteObj(ingredientID, dateThrownAway, quantity)
    try {
        wasteTbl.createLog(waste);
        console.log("waste item successfully added into databse")
    } catch (error) {
        console.log(error)
    }
}

function poplulateImpact() {
    addWasteItem(2, 20230111, 0.4);
    addWasteItem(23, 20230117, 0.5);
    addWasteItem(16, 20230121, 0.25);
    addWasteItem(31, 20230123, 2.0);
    addWasteItem(6, 20230127, 0.2);
    addWasteItem(10, 20230129, 0.6);
    addWasteItem(18, 20230130, 0.3);
    addWasteItem(1, 20230131, 0.5);
    addWasteItem(22, 20230205, 0.25);
    addWasteItem(1, 20230205, 0.2);
    addWasteItem(27, 20230206, 0.4);
    addWasteItem(31, 20230207, 3.0);
    addWasteItem(10, 20230211, 1.2);
    addWasteItem(1, 20230213, 0.5);
    addWasteItem(12, 20230216, 0.3);
    addWasteItem(24, 20230221, 4.0);
    addWasteItem(23, 20230223, 0.75);
    addWasteItem(18, 20230224, 0.2);
    addWasteItem(16, 20230227, 0.4);
    addWasteItem(1, 20230228, 1.0);
}

function poplulatePantry() {
    // add test pantry items into the database
    addPantryItem(3, 0.4, 20230312, 0);
    addPantryItem(23, 0.6, 20230313, 0);
    addPantryItem(1, 0.25, 20230315, 0);
    addPantryItem(16, 0.35, 20230316, 0);
    addPantryItem(15, 0.3, 20230317, 0);
    addPantryItem(10, 0.6, 20230322, 0);
    addPantryItem(8, 1.2, 20230324, 0);
    addPantryItem(18, 0.2, 20230327, 0);
    addPantryItem(19, 0.1, 20230328, 0);
    addPantryItem(3, 0.52, 20230330, 0);
    addPantryItem(24, 3.0, 20230401, 0);
    addPantryItem(10, 0.6, 20230405, 0);
    addPantryItem(31, 5.0, 20230408, 0);
    addPantryItem(14, 0.25, 20230409, 0);
    addPantryItem(33, 0.5, 20230411, 0);
    addPantryItem(1, 0.5, 20230412, 0);
    addPantryItem(9, 1.5, 20230416, 0);
    addPantryItem(32, 0.8, 20230417, 0);
    addPantryItem(7, 6.0, 20230422, 0);
    addPantryItem(24, 4.0, 20230426, 0);
    addPantryItem(13, 1.0, 20230430, 0);
}

function poplulateIngredients() {
    // add base ingredients to the database
    addIngredient("Chicken", "kg", 6.9);
    addIngredient("Lamb", "kg", 39.2);
    addIngredient("Beef", "kg", 27.0);
    addIngredient("Cheese", "kg", 13.5);
    addIngredient("Pork", "kg", 12.1);
    addIngredient("Tuna", "kg", 6.1);
    addIngredient("Eggs", NaN, 0.29);
    addIngredient("Potatoes", "kg", 7.0);
    addIngredient("Rice", "kg", 2.7);
    addIngredient("Milk", "L", 4.0);
    addIngredient("Pasta", "kg", 1.8);
    addIngredient("Tomatoes", "kg", 1.4);
    addIngredient("Oil", "kg", 6.0);
    addIngredient("Butter", "kg", 10.0);
    addIngredient("Peanut Butter", "kg", 2.9);
    addIngredient("Mushrooms", "kg", 0.3);
    addIngredient("Oats", "kg", 0.3);
    addIngredient("Onions", "kg", 0.4);
    addIngredient("Garlic", "kg", 0.4);
    addIngredient("Sugar", "kg", 3.0);
    addIngredient("Flour", "kg", 0.7);
    addIngredient("Bread", "kg", 1.1);
    addIngredient("Yoghurt", "kg", 2.2);
    addIngredient("Apple", NaN, 0.04);
    addIngredient("Sweet Potatoes", "kg", 0.4);
    addIngredient("Broccoli", "kg", 0.4);
    addIngredient("Cauliflower", "kg", 0.4);
    addIngredient("Sausage", "kg", 7.0);
    addIngredient("Honey", "kg", 0.7);
    addIngredient("Nuts", "kg", 0.3);
    addIngredient("Banana", NaN, 0.84);
    addIngredient("Peas", "kg", 0.9);
    addIngredient("Carrots", "kg", 0.4);
    addIngredient("Chocolate", "kg", 19.0);
    addIngredient("Lemon", "kg", 0.03);
    addIngredient("Orange", "kg", 0.03);
}

function populateDatabase() {

    // add base ingredients to the database
    poplulateIngredients()
    // add test pantry items into the database
    poplulatePantry()
    // add test wasted items into the database
    poplulateImpact()
}

module.exports = {
    poplulateImpact,
    poplulateIngredients,
    poplulatePantry,
    populateDatabase
}
