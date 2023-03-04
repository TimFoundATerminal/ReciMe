import { useEffect, useState } from "react"
import { getInstructionsCall, getInstructionEquipmentImage } from "../Constants"
import React from 'react';
import { Pressable, View, Text } from 'react-native';

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


const finishMealRoutine = (currentPantryItems, recipeData) => {
    
    updatePantryAfterMeal(currentPantryItems, recipeData)
    // navigation.navigate('Home')
}

export default function Instructions({ currentPantryItems, recipeData }) {

    
    const recipeID = recipeData.id

    const [instructions, setInstructions] = useState([])
    const [loading, setLoaing] = useState(true)

    const instructionsCallURL = getInstructionsCall(recipeID)

    useEffect(() => {

        fetch(instructionsCallURL)

            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.')
            })
            .then(instructions => {

                setInstructions(instructions)
                setLoaing(false)

            })
            .catch(error => console.error('Error:', error))
    })

    return (

        <View>

            {/* Start Meal */}
            <View>

            </View>

            {/* Instructions */}
            <ScrollView>
                <Text>{!loading ?? "Loading..."}</Text>
                {
                    instructions.steps.map((instructionStep, index) =>
                        <View key={index}>
                            <Text>
                                {`${instructionStep.number}.\n${instructionStep.step}`}
                            </Text>
                            <Image
                                source={{
                                    uri: getInstructionEquipmentImage(recipeId, instructionStep.image)
                                }}
                            />
                        </View>
                    ) 
                }
            </ScrollView>

            {/* End meal */}
            <View>

                <Pressable onPress={finishMealRoutine(currentPantryItems, recipeData)}> 
                    <Text>Finish Meal</Text>
                </Pressable>

            </View>

        </View>
    )
}