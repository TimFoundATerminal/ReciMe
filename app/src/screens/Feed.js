import React from "react";
import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import tw from 'twrnc';

export default function Feed({ navigation }) {

  const recipes = require('../test-data/maximise-ingredients-recipes.json');

  const styles = StyleSheet.create({
    imageProfile: {
      width: 200,
      height: 100,
    },
  });

  return (
      <ScrollView>

        {recipes.map(recipe =>
          <View
            key={recipe.id}
          >

          <Text>
            {recipe.title}
          </Text>

            {/* Recipe Image */}
            <Image
              style={styles.imageProfile}
              source={{
                uri: recipe.image
              }} />

          </View>
        )}
      </ScrollView >

  );
}
