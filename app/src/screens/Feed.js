import React, { useState, useEffect } from "react";
import * as Constants from '../Constants';
import { getRecipesCall } from "../Constants";
import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import tw from "twrnc";


export default function Feed({ navigation, route }) {

  const [filterVisible, setFilterVisible] = useState(false);

  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState([])
  const [pantry, setPantry] = useState([])

  // change this (IPV4 address from ipconfig in command line)
  const pantryCallURL = `${Constants.API_BASE_URL}/pantry`

  const use_backup_data = false

  useEffect(() => {

    if (loading) {

      // get pantry
      fetch(use_backup_data ? pantryCallURL : '')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.text().then(text => { throw new Error(text) })
        })
        .catch(error => {
          console.warn('Warning:', error)
          const backupPantry = require('./backup-data/backup-pantry.json')
          return backupPantry
        })
        .then(pantryItems => {

          setPantry(pantryItems)

          const ingredients = pantryItems.map(pantryItem => pantryItem.name).join(',+')
          const spoonacularAPICallURL = getRecipesCall(ingredients)

          // get recipes
          fetch(use_backup_data ? spoonacularAPICallURL : '')
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              return response.text().then(text => { throw new Error(text) })
            })
            .catch((error) => {
              console.warn('Warning:', error)
              var backupRecipes = require('./backup-data/backup-recipes.json')
              return backupRecipes
            })
            .then(recipes => {

              setRecipes(recipes)
              setLoading(false)

            })
        })
    }
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

        {!loading ?? <Text>Loading...</Text>}

        {/* when pantry and recipe loaded in -> load feed */}
        {recipes.map((recipe, i) => (

          // link to instructions
          <Pressable 
            key={i}
            onPress={() =>
            navigation.navigate('Instructions', {
              currentPantryItems: pantry,
              recipeData: recipe
            })
          }>

            <View style={tw`relative p-4`}>
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
