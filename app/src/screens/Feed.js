import React, { useState, useEffect } from "react";
// update constants you need in 'constants.js' file
import * as Constants from "../Constants";
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

export default function Feed({ navigation }) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // const backupRecipes = require("../test-data/maximise-ingredients-recipes.json");

  // Ingredients list separated by ,+

  const [loading, setLoaing] = useState(true);
  const [recipes, setRecipes] = useState([]);

  // change this (IPV4 address from ipconfig in command line)
  const pantryCallURL = Constants.API_BASE_URL + `/pantry`;

  useEffect(() => {
    fetch(pantryCallURL, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((pantryData) => {
        const ingredients = pantryData.map((pantryItem) => pantryItem.name);
        const spoonacularAPICall = Constants.getSpoonacularAPICall(ingredients);

        // make API call
        fetch(spoonacularAPICall)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((recipes) => {
            setRecipes(recipes);
            setLoaing(false);
          })
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => console.error("Error:", error));
  });

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

        {recipes.map((recipe) => (
          <View key={recipe.id} style={tw`relative p-4`}>
            <RecipePreview
              recipe={recipe}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
            />
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
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
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
