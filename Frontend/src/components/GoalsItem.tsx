import { FormLabel, Input } from "@mui/material";
import { MinMaxSlider } from "./MinMaxSlider";
import { GoalsProps } from "../pages/Calculator";

export function GoalItem({ goalsProps, handleGoalChange }: { goalsProps: GoalsProps, handleGoalChange: any }) {

    function handleValueChange(value: number) {
        const newProp = {
            ...goalsProps,
            value: value
        }
        handleGoalChange(newProp);
    }

    return (

        <FormLabel className="flex flex-col  mx-4">
            {
                goalsProps.name
            }
            <MinMaxSlider
                value={goalsProps.value.toFixed(2)}
                min={goalsProps.min}
                max={goalsProps.max}
                handleChange={handleValueChange}
            />
        </FormLabel>

    )
}
