import React, { useState, useEffect } from "react";
import * as Constants from '../Constants';
import { getRecipesCall } from "../Constants";
import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert
} from "react-native";
import tw from "twrnc";


export default function FeedScreen({ navigation }) {
  const [filterVisible, setFilterVisible] = useState(false);

  const [loading, setLoaing] = useState(true)
  const [recipes, setRecipes] = useState([])
  const [pantry, setPantry] = useState([])

  // change this (IPV4 address from ipconfig in command line)
  const pantryCallURL = `${Constants.API_BASE_URL}/pantry`

  useEffect(() => {

    // get pantry
    fetch(pantryCallURL, { method: "GET" })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .catch(error => {
        console.error('Error:', error)
        const pantryItems = require('')
      })
      .then(pantryItems => {

        setPantry(pantryItems)

        console.log(pantryItems)

        const ingredients = pantryItems.map(pantryItem => pantryItem.name)
        const spoonacularAPICall = getRecipesCall(ingredients)

        // get recipes
        fetch(spoonacularAPICall)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(recipes => {

            setRecipes(recipes)
            setLoaing(false)

          })
          .catch(error => console.error('Error:', error));
      })
      

  })

  return (
    <View>
      <Pressable
        style={tw`w-full h-12 bg-neutral-300 justify-center items-center`}
        onPress={() => setFilterVisible(!filterVisible)}
      >
        <Text style={tw`text-lg`}>Filter Dropdown Menu</Text>
      </Pressable>
      {filterVisible && (
        <View
          visible={filterVisible}
          style={tw`w-full h-60 bg-neutral-300 justify-center items-center`}
        >
          <Text>MENU CONTENT HERE</Text>
        </View>
      )}
      <ScrollView>

        {!loading ?? <Alert>Loading...</Alert>}

        {/* when pantry and recipe loaded in -> load feed */}
        {recipes.map(recipe => (

          // link to instructions
          <Pressable onPress={() =>
            navigation.navigate('Instructions', {
              currentPantryItems: pantry,
              recipeData: recipe
            })
          }>

            <View key={recipe.id} style={tw`relative p-4`}>
              <View style={tw`w-full h-45 bg-black rounded-3xl`}>
                <Image
                  style={tw`rounded-3xl w-full h-full opacity-65`}
                  source={{
                    uri: recipe.image,
                  }}
                />
                <View style={tw`absolute items-center top-2 w-full h-full`}>
                  <Text style={tw`text-white`}>{recipe.title}</Text>
                </View>
                <View
                  style={tw`absolute items-end justify-end right-4 w-full h-full`}
                >
                  <Text style={tw`text-white`}>30 mins</Text>
                </View>
                <View
                  style={tw`absolute items-center justify-end bottom-2 w-full h-full`}
                >
                  <Text style={tw`text-white`}>488 calories</Text>
                </View>
                <View
                  style={tw`absolute items-start justify-end left-4 w-full h-full`}
                >
                  <Text style={tw`text-white`}>0.4kg</Text>
                </View>
              </View>
            </View>
          </Pressable>

        ))}

      </ScrollView>
    </View>
  );
}
