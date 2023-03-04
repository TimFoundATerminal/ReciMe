import { useEffect, useState } from "react"
import { getInstructionsCall, getInstructionEquipmentImage } from "../Constants"

export default function InstructionsPage({ recipeId }) {

    const [instructions, setInstructions] = useState([])
    const [loading, setLoaing] = useState(true)

    const instructionsCall = getInstructionsCall(recipeId)

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
    )
}