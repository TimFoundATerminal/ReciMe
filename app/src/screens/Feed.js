import React, { useState, useEffect } from "react";
import * as Constants from '../Constants';
import { getRecipesCall } from "../Constants";
import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Button,
} from "react-native";
import tw from "twrnc";
import RecipePreview from "../components/RecipePreview";


export default function Feed({ navigation, route }) {

  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState([])
  const [pantry, setPantry] = useState([])

  // change this (IPV4 address from ipconfig in command line)
  const pantryCallURL = `${Constants.API_BASE_URL}/pantry`

  const use_backup_data = true

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
              console.warn('Warning:', error, 'from', spoonacularAPICallURL)
              var backupRecipes = require('./backup-data/backup-recipes.json')
              return backupRecipes
            })
            .then(recipes => {

              setRecipes(recipes)
              setLoading(false)

            })
        })
    }
  }, [])

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

        {recipes.map((recipe, idx) => (
          <View key={idx} style={tw`relative p-4`}>

            <RecipePreview
              idx={idx}
              recipe={recipe}
              pantry={pantry}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
            />
            <TouchableOpacity onPress={() => setModalVisible(idx)}>

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
                  <Text style={tw`text-white`}>
                    You have {recipe.usedIngredients.length} of {recipe.missedIngredients.length + recipe.usedIngredients.length} ingredients
                  </Text>
                </View>

                <View
                  style={tw`absolute items-start justify-end left-4 w-full h-full`}
                >

                  <Text style={tw`text-white`}></Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
