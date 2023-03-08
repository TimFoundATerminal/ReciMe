// import this file to use these comstants across the application

// Node Express backend constants

// change this (IPV4 address from ipconfig in command line)

// deprecated - no longer in use as have moved backend to a static server
const IP_ADDRESS = 'xxx.xxx.xxx.xxx'; // deprecated
const LOCAL_HOST_PORT = '3000'; // deprecated
export const API_BASE_URL = 'http://' + IP_ADDRESS +':' + LOCAL_HOST_PORT + '/api'; // deprecated

export const API_FIXED_URL = 'https://server-eemxqqdgca-nw.a.run.app/api/'



// Spoonacular API constants

const API_KEY = '7b6470073c6246c1be8039c48fe00dd4';

export function getSpoonacularAPICall(ingredients) {
    return `https://api.spoonacular.com/recipes/findByIngredients?apiKey=`+API_KEY+`&ingredients=`+ingredients+`&number=10&ranking=2`;
}