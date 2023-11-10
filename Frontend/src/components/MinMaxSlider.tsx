import { Box, Slider, SliderThumb } from "@mui/material";

const minDistance = 1;

export function MinMaxSlider({ value, min, max, handleChange, normalized = false, disabled= false }: any) {

    const normalizedValue = value / (max - min);

    function handleChangeLocally(
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) {

        if (Array.isArray(newValue)) {
            return;
        }

        let boundedValue = newValue;
        if (boundedValue >= max) {
            boundedValue = max;
        }
        if (boundedValue <= min) {
            boundedValue = min;
        }

        handleChange(boundedValue);

    };

    function CustomThumbComponent(props: any) {
        const { children, ...other } = props;
        return (
            <SliderThumb {...other} className={"p-3 text-red-500 "}>
                {children}
            </SliderThumb>
        );
    }

    return <div className="flex">
        <div className="w-10/12 flex relative">
            <Slider
            disabled={disabled}
                sx={{ position: 'absolute', pointerEvents: 'none', color: "gray" }}
                step={null}
                value={[min, max]}
                min={normalized? min:-1}
                max={normalized? max:1}
            />
            <Slider
                disabled={disabled}
                disableSwap
                sx={{ zIndex: 6, color: "gray" }}
                step={0.05}
                value={value}
                min={normalized? min:-1}
                max={normalized? max:1}
                slots={{ thumb: CustomThumbComponent }}
                onChange={handleChangeLocally}
                track={false}
            />
        </div>
        <div className="w-2/12 text-right font-bold">
            {
                normalized? value: value
            }
        </div>  
    </div>
}