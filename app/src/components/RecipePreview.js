import React, { useEffect, useState } from "react";
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
  FlatList,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import tw from "twrnc";

export default function RecipePreview({
  recipe,
  setModalVisible,
  modalVisible,
}) {
  const [portionSize, setPortionSize] = useState(1);
  const [macrosVisible, setMacrosVisible] = useState(false);

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
            thumbStyle={tw`bg-green-400 w-8 h-8 rounded-full`}
            minimumTrackTintColor={tw`bg-green-400`}
            maximumValue={5}
            onValueChange={(value) => setPortionSize(value)}
          />
          <Text style={tw`text-center text-lg p-2`}>
            {portionSize} Portion(s)
          </Text>
        </View>

        <Pressable
          style={tw`w-3/4 mx-auto h-12 bg-neutral-300 justify-center items-center`}
          onPress={() => setMacrosVisible(!macrosVisible)}
        >
          <Text style={tw`text-lg`}>View Macros</Text>
        </Pressable>
        {macrosVisible && (
          <View
            visible={macrosVisible}
            style={tw`w-3/4 mx-auto h-40 bg-neutral-300 justify-center items-center`}
          >
            <Text>MACROS CONTENT HERE</Text>
          </View>
        )}

        <View style={tw`flex-row p-8`}>
          <View style={tw`flex m-auto`}>
            <Text style={tw`text-lg pb-2 text-center`}>Ingredients</Text>
            <FlatList
              data={[
                { key: "9 garlic cloves" },
                { key: "1 fresh chilli" },
                { key: "1 onion, diced" },
              ]}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16 }}>- {item.key}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={tw`flex m-auto`}>
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
          </View>
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
          }}
        >
          <Text style={tw`m-auto text-white text-lg`}>Continue Recipe</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
