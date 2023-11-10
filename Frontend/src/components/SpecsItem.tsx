import { FormLabel, Input } from "@mui/material";
import { SpecsProps } from "../pages/Calculator";

export function SpecsItem({ specsProps, handleSpecsChange }: { specsProps: SpecsProps, handleSpecsChange: any }) {

    function handleValueChange(event : any)
    {
        const newProp = {
            name: specsProps.name,
            value: event.target.value
        }
        handleSpecsChange(newProp);
    }

    return (

        <FormLabel className="flex flex-col mx-4">
            {
                specsProps.name
            }

            <Input
                value={specsProps.value}
                onChange={handleValueChange}
            />
        </FormLabel>

    )
}