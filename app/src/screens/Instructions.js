import { useEffect, useState } from "react"
import { getInstructionsCall, getInstructionEquipmentImage } from "../Constants"
import React from 'react';
import {Button, View, Text} from 'react-native';


const finishMeal = (pantry, recipeDetails) => {

    const removeItemURL = `${Constants.API_BASE_URL}/pantry`

    // filter unused ingredients
    const usedIngredients = recipeDetails.usedIngredients

    // loop through every item - get quantity -
    pantry.forEach(pantryItem => {

        const itemQuantity = pantryItem.quantity
        
        const ingredientQuantity = usedIngredients.find(ingredient => ingredient.name == item.name).amount

        const remainingItemAmount = ingredientQuantity - itemQuantity

        // fetch change -- removeItemURL (name, amount, remainingItemAmount)

    })

}


export default function InstructionsPage({ recipe, pantry}) {

    const recipeID = recipe.id

    const [instructions, setInstructions] = useState([])
    const [loading, setLoaing] = useState(true)

    const instructionsCall = getInstructionsCall(recipeID)

    useEffect(() => {

        fetch(instructionsCall)
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
                    instructions ? instructions.steps.map((instructionStep, index) =>
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
                    ) : []
                }
            </ScrollView>

            {/* End meal */}
            <View>
                <Button 
                    onPress={finishMeal}
                />

            </View>
            
        </View>
    )
}