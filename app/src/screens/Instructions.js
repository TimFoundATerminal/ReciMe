import { useEffect, useState } from "react"
import { getInstructionsCall, getInstructionEquipmentImage } from "../Constants"
import React from 'react';
import { Pressable, View, Text, Alert, ScrollView } from 'react-native';

const updatePantryAfterMeal = (currentPantryItems, recipeData) => {

    const PANTRY_URL = `${Constants.API_BASE_URL}/pantry`

    // filter unused ingredients
    const usedIngredients = recipeData.usedIngredients

    // loop through every item - get quantity -
    currentPantryItems.forEach(pantryItem => {

        const item_API_URL = `${PANTRY_URL}/${pantryItem.id}`

        // calulcate remaining quantity of food in pantry
        const usedAmount = usedIngredients.find(ingredient => ingredient.name == item.name).amount
        const remainingAmount = usedAmount - pantryItem.quantity

        if (remainingAmount > 0) {

            // if quantity > 0 -> update pantry item
            const updatedPantryItem = pantry
            updatedPantryItem.quantity = remainingAmount

            fetch(item_API_URL, {
                method: 'PUT',
                body: JSON.stringify(updatedPantryItem),
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .catch(error => console.error('Error this update should not be running:', error))

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
    })
}

export default function Instructions({ navigation, route }) {

    const recipeData = route.params.recipeData
    const currentPantryItems = route.params.currentPantryItems

    const recipeID = recipeData.id

    const LOCAL_TEST = false

    const [instructions, setInstructions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const instructionsCallURL = getInstructionsCall(recipeID)

    useEffect(() => {

        if (loading) {
            fetch(LOCAL_TEST ? instructionsCallURL : '' )
                .then(response => {
                    console.error(response)
                    if (response.ok) {
                        return response.json();
                    }
                    return response.text().then(text => { throw new Error(text) })
                })
                .catch(errorMsg =>  {
                    console.warn('Error:', errorMsg)
                    return null
                })   
                .then(theInstructions => {
                    if (theInstructions != null) {
                        setInstructions(theInstructions)
                    } else {
                        setError('Could not use local API :(')
                    }
                    setLoading(false)
                })
        }


    })

    return (

        <View>

            {() => {
                if (error != null) {
                    return <Alert>{error}</Alert>
                }
            }}

            {/* Start Meal */}
            <View>

            </View>

            {/* Instructions */}
            <ScrollView>
                <Text>{!loading ?? "Loading..."}</Text>
                {
                    !instructions ?? instructions.steps.map((instructionStep, index) =>
                        <View key={index}>
                            <Text>
                                {`${instructionStep.number}.\n${instructionStep.step}`}
                            </Text>
                            <Image
                                source={{
                                    uri: getInstructionEquipmentImage(recipeID, instructionStep.image)
                                }}
                            />
                        </View>
                    )
                }
            </ScrollView>

            {/* End meal */}
            <View>

                <Pressable onPress={updatePantryAfterMeal(currentPantryItems, recipeData)}>
                    <Text>Finish Meal</Text>
                    {/* then navigation.goBack() to go back to feed */}
                </Pressable>

            </View>

        </View>
    )
}