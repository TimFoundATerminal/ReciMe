import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import tw from "twrnc";
import { useNavigation } from '@react-navigation/native';
import { getNutrition } from "../Constants";


export default function RecipePreview({
  recipe,
  pantry,
  setModalVisible,
  modalVisible,
  idx
}) {

  const missedIngredients = recipe.missedIngredients.map(ingredient => ({
    key: ingredient.original
  }))

  const usedIngredients = recipe.usedIngredients.map(ingredient => ({
    key: ingredient.original
  }))

  const navigation = useNavigation();

  const [portionSize, setPortionSize] = useState(1);
  const [macrosVisible, setMacrosVisible] = useState(false);
  const [macros, setMacros] = useState([]);

  const nutritionAPICallURL = getNutrition(recipe.id)

  const use_backup_data = true

  useEffect(() => {

    // if (macrosVisible) {

    // get recipes
    fetch(use_backup_data ? nutritionAPICallURL : '')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return response.text().then(text => { throw new Error(text) })
      })
      .catch((error) => {
        console.warn('Warning:', error, 'from', spoonacularAPICallURL)

        var backupNutrition = require('../screens/backup-data/backup-nutrition.json')
        return backupNutrition
      })
      .then(nutrition => {
        setMacros(
          nutrition.bad.slice(0, 6).map((macro, idx) =>
            <Text style={tw`py-1`} key={macro.id}>
              {macro.title}: {macro.amount}
            </Text>
          )
        )

      })
    // }

  }, [])


  return (
    <Modal animationType="slide" transparent={true} visible={idx === modalVisible}>
      <View style={tw`pt-12 w-full h-full bg-white`}>
        <Image
          style={tw`rounded-3xl w-full h-45`}
          source={{
            uri: recipe.image,
          }}
        />
        <View style={tw`p-4`}>
          <Text style={tw`pb-2 text-lg text-center`}>
            Adjust the size of your meal
          </Text>
          <Slider
            value={portionSize}
            minimumValue={1}
            step={1}
            trackStyle={tw`bg-green-400`}
            thumbStyle={tw`bg-green-400 w-5 h-5 rounded-full`}
            minimumTrackTintColor={tw`bg-green-400`}
            maximumValue={5}
            onValueChange={(value) => setPortionSize(value)}
          />
          <Text style={tw`text-center text-lg p-1`}>
            {portionSize} Portion(s)
          </Text>
        </View>

        <Pressable
          style={tw`w-3/4 mx-auto h-10 bg-neutral-300 justify-center items-center`}
          onPress={() => setMacrosVisible(!macrosVisible)}
        >
          <Text style={tw`text-lg`}>View Macros</Text>
        </Pressable>
        {macrosVisible && (
          <View
            visible={macrosVisible}
            style={tw`flex w-3/4 mx-auto h-40 bg-neutral-300 gap-10 items-center`}
          >
            {macros}
          </View>
        )}

        <View style={tw`p-8`}>
        {/* Used Ingredients */}
          <View style={tw`flex m-auto`}>
            <Text style={tw`text-lg pb-2 text-center`}>Used Ingredients:</Text>
            <FlatList
              data={usedIngredients}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16 }}>- {item.key}</Text>
                  </View>
                );
              }}
            />

            <Text style={tw`text-lg pb-2 text-center pt-2`}>Missed Ingredients:</Text>
            <FlatList
              data={missedIngredients}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: 10 }} key={item.id}>
                    <Text style={{ fontSize: 16 }}>- {item.key}</Text>
                  </View>
                );
              }}
            />
          </View>
          {/* <View style={tw`flex m-auto`}>
            <Text style={tw`text-lg pb-2 text-center`}>Cookware</Text>
            <FlatList
              data={[
                { key: "Food processor" },
                { key: "Saucepan" },
                { key: "Pot" },
              ]}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16 }}>- {item.key}</Text>
                  </View>
                );
              }}
            />
          </View> */}
        </View>
        <Pressable
          title=""
          style={tw`w-1/2 h-16 bg-green-800 absolute bottom-0`}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Text style={tw`m-auto text-white text-lg`}>Back</Text>
        </Pressable>
        <Pressable
          title=""
          style={tw`w-1/2 h-16 bg-green-800 absolute bottom-0 right-0`}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate('Instructions', {
              currentPantryItems: pantry,
              recipeData: recipe
            })
          }}
        >
          <Text style={tw`m-auto text-white text-lg`}>Continue Recipe</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
