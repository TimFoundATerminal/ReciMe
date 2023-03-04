// import this file to use these comstants across the application

// Node Express backend constants

// change this (IPV4 address from ipconfig in command line)
const IP_ADDRESS = '172.20.10.2'
const LOCAL_HOST_PORT = '3000'

// Spponacular
const API_KEY = '54385497726e4c6b9dba6f8704f480c3'

// base URLs
export const API_BASE_URL = `http://${IP_ADDRESS}:${LOCAL_HOST_PORT}/api/`
export const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes"

export function getRecipesCall(ingredients, numberRecipes = 10) {
    return `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=${numberRecipes}&ranking=2`;
}

export function getInstructionsCall(recipeId) {
  return `${SPOONACULAR_BASE_URL}/${recipeId}/analyzedInstructions?apiKey=${API_KEY}&stepBreakdown=true`
}

export function getInstructionEquipmentImage (recipeId, imageName) {
  return `${SPOONACULAR_BASE_URL}/${recipeId}/${imageName}?apiKey=${API_KEY}`
}