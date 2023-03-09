import { useEffect, useState } from "react"
import { getInstructionsCall, getIngredientsPicture } from "../Constants"
import React from 'react';
import { Pressable, View, Text, Alert, ScrollView, Image } from 'react-native';
import tw from "twrnc";

const updatePantryAfterMeal = (currentPantryItems, recipeData) => {

    // filter unused ingredients
    const usedIngredients = recipeData.usedIngredients

    // loop through every item - get quantity -
    usedIngredients.forEach(ingredient => {

        // calulcate remaining quantity of food in pantry
        const usedPantryItem = currentPantryItems.find(pantryItem => ingredient.name == pantryItem.name)

        // if found -- pantryName == ingredientName
        if (usedPantryItem) {

            const item_API_URL = `${PANTRY_URL}/${usedPantryItem.itemID}`

            const remainingAmount = pantryItem.quantity - usedIngredient.amount

            // EDIT - PUT - UPDATED if quantity > 0
            if (remainingAmount > 0) {

                // if quantity > 0 -> update pantry item

                fetch(item_API_URL, {
                    method: 'PUT',
                    body: JSON.stringify({
                        quantity: remainingAmount
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then((msg) => {
                        console.log(msg)
                    })

                    .catch(error => console.error('Error this update should not be running:', error))

                // DELETE - UPDATED if quantity <= 0 (used up)
            } else {

                // else -> delete pantry item
                fetch(item_API_URL, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .catch(error => console.error('Error this delete should not be running:', error))
            }
        }
    })
}

export default function Instructions({ navigation, route }) {

    const recipeData = route.params.recipeData
    const currentPantryItems = route.params.currentPantryItems

    const recipeID = recipeData.id

    const use_backup_data = true

    const [instructions, setInstructions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const instructionsCallURL = getInstructionsCall(recipeID)

    useEffect(() => {

        if (loading) {
            fetch(use_backup_data ? instructionsCallURL : '')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    return response.text().then(text => { throw new Error(text) })
                })
                .catch(errorMsg => {
                    console.warn('Error:', errorMsg)
                    var backupInstructionsData = require('./backup-data/backup-instructions.json')
                    return backupInstructionsData
                })
                .then(theInstructions => {
                    if (theInstructions != null) {
                        setInstructions(theInstructions[0].steps)
                    } else {
                        setError('Could not use local API :(')
                    }
                    setLoading(false)
                })
        }


    })

    return (

        <View style={tw`flex px-3 py-3`}>

            {() => {
                if (error != null) {
                    return <Alert><Text>{error}</Text></Alert>
                }
            }}

            {/* Title */}
            <Text style={tw`text-[16px] mb-0 font-bold my-2`}>
                {recipeData.title}
            </Text>

            {/* Start Meal */}
            <View>

                <Image
                    style={tw`rounded-3xl w-full h-full `}
                    source={{
                        uri: recipeData.Image
                    }}
                />

            </View>


            <View >

                {/* Instructions */}

                <Text>{!loading ?? "Loading..."}</Text>

                {instructions.map((instructionStep, index) => (
                    <View key={index} style={tw`pb-6 flex flex-row`}>

                        <Text>
                            {instructionStep.number + '. '}
                            {instructionStep.step}
                        </Text>


                    </View>
                ))}

                {/* End meal */}
                <View>

                    <Pressable
                        style={tw`bg-green-700 hover:bg-green-700 py-2 px-4 rounded`}
                        onPress={
                            () => {
                                updatePantryAfterMeal(currentPantryItems, recipeData)
                                navigation.goBack()
                            }
                        }>
                        <Text style={tw` text-white font-bold`}>
                            Finish Meal
                        </Text>
                    </Pressable>

                </View>


            </View>

        </View>
    )
}