import { Checkbox, FormLabel, Input, Switch } from "@mui/material";
import { MinMaxSlider } from "./MinMaxSlider";
import { AtributesProps } from "../pages/Calculator";

export function AttributesItem({ attributesProps, handleAttributesChange }: { attributesProps: AtributesProps, handleAttributesChange: any }) {

    function handleCheckboxChange(event: any, checked: boolean) {
        const newProp: AtributesProps = {
            ...attributesProps,
            blocked: checked
        }
        handleAttributesChange(newProp)
    }

    function handleValueChange(value: number) {
        const newProp = {
            ...attributesProps,
            value: value
        }
        handleAttributesChange(newProp);
    }

    return (
        <div className="w-full flex flex-row my-2">

            <FormLabel className="flex flex-row mr-4 items-center">

                {
                    attributesProps.blocked &&
                    "Blocked"
                }
                {
                    !attributesProps.blocked &&
                    "Free"
                }
                <Switch checked={attributesProps.blocked} onChange={handleCheckboxChange} color="error" />
            </FormLabel>
            <FormLabel className="flex flex-col ml-4 w-full">
                {
                    attributesProps.name
                }
                <MinMaxSlider
                    value={attributesProps.value.toFixed(2)}
                    min={attributesProps.min}
                    max={attributesProps.max}
                    handleChange={handleValueChange}
                    normalized={true}
                    disabled={attributesProps.blocked}
                />
            </FormLabel>
        </div>

    )
}