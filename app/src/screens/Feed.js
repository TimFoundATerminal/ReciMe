import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
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

  const recipes = require("../test-data/maximise-ingredients-recipes.json");

  const styles = StyleSheet.create({
    imageProfile: {
      width: 200,
      height: 100,
    },
    innerFrame: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, .5)",
    },
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
