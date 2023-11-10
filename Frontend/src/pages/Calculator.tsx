import React, { useEffect, useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Button, FormLabel, Paper } from '@mui/material';
import styled from '@emotion/styled';
import { Line, Scatter } from 'react-chartjs-2';
import { loadData } from '../data/load';
import { SpecsItem } from '../components/SpecsItem';
import { GoalItem } from '../components/GoalsItem';
import { AttributesItem } from '../components/AttributeItem';
import { minimizeCarbonImpact } from '../services/CarbonImpact';
import { Link } from 'react-router-dom';

export interface AtributesProps {
    name: string;
    value: number;
    blocked: boolean;
    min: number;
    max: number;
}

export interface GoalsProps {
    name: string;
    value: number;
    min: number;
    max: number;
    data: number[] | undefined;
}

export interface SpecsProps {
    name: string;
    value: any;
}

export interface CompanyProps {
    name: string;
    specs: SpecsProps[];
    goals: GoalsProps[];
    attributes: AtributesProps[];
    relationship: RelationshipProps[];

}

export interface RelationshipProps {
    firstVariable: string,
    secondVariable: string,
    linkFunction: string,
}

const empty: CompanyProps = {
    name: "",
    specs: [],
    goals: [],
    attributes: [],
    relationship: [],
}

export const goalsGraphOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: false,
        },
    },
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function Calculator() {
    const [companyProps, setCompanyProps] = useState<CompanyProps>(empty);
    const cachedVariablesRelatioship = useMemo<JSX.Element[]>(generateVariablesGraphData, [companyProps?.relationship]);

    useEffect(() => {
        const data = loadData();
        setCompanyProps(data);
    }, [])

    function handleCompanyPropsChange(name: string, value: any) {
        setCompanyProps((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    function generateVariablesGraphData() {
        return companyProps.relationship.map((currentRelationship: RelationshipProps, indexKey: number) => {

            const nDiscretion = 100;
            const step = 0.1;
            let graphData: { x: number, y: number }[] = [];
            for (var i = 0; i < nDiscretion * step; i += step) {
                let x = i;
                var y: number = eval(currentRelationship.linkFunction);
                graphData.push({ x: i, y: y });
            }

            const data = {
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: graphData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ],
            };

            const options = {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: currentRelationship.secondVariable + " in function of " + currentRelationship.firstVariable
                    },
                },
            };

            return <Scatter
                key={indexKey}
                options={options}
                data={data}
            />
        })
    }

    function handleGoalChange(props: GoalsProps) {

        const updatedGoals = companyProps.goals.map((localProps: GoalsProps) => {
            if (localProps.name === props.name) {
                localProps = { ...localProps, ...props }
            }
            return localProps;
        })

        setCompanyProps((prevProps: any) => ({
            ...prevProps,
            goals: updatedGoals
        }))

        //updateGoals();
    }

    function handleAttributesChange(props: AtributesProps) {
        
        const updatedAttributes = companyProps.attributes.map((localProps: AtributesProps) => {
            if (localProps.name === props.name) {
                localProps = { ...localProps, ...props }
            }
            return localProps;
        })
        
        setCompanyProps((prevProps: any) => ({
            ...prevProps,
            attributes: updatedAttributes
        }))
    }

    function handleSpecsChange(props: SpecsProps) {

        const updatedSpecs = companyProps.specs.map((localProps: SpecsProps) => {
            if (localProps.name === props.name) {
                localProps = props
            }
            return localProps;
        })

        setCompanyProps((prevProps: any) => ({
            ...prevProps,
            specs: updatedSpecs
        }))
    }

    async function handlePredictCLick() {
        try {
            if (companyProps) {
                const nemploye = companyProps.specs.filter((specs: SpecsProps) => {
                    if (specs.name === "Number of employees") {
                        return true;
                    }
                    return false
                })[0].value

                const growth = 10000;
                const carbon = 635000;

                const mingrowth = companyProps.goals.filter((goals: GoalsProps) => {
                    if (goals.name === "Growth (%)") {
                        return true;
                    }
                    return false
                })[0].value

                const freedom = companyProps.attributes.map((value : AtributesProps)=>{
                    return !value.blocked;
                })
                
                const variablesValue = companyProps.attributes.map((value : AtributesProps)=>{
                    return (value.value-value.min)/(value.max-value.min);
                })


                const response: any = await minimizeCarbonImpact(nemploye, growth, carbon, mingrowth, freedom, variablesValue);
                const newGoals: GoalsProps = {
                    name: "Growth (%)",
                    value: response.data.growth / 100,
                } as GoalsProps
                handleGoalChange(newGoals);

                const newCarbon: GoalsProps = {
                    name: "Carbon Emission (ratio)",
                    value: response.data.carbon / 100,
                } as GoalsProps
                handleGoalChange(newCarbon);

                const updatedAttributes = companyProps.attributes.map((value:AtributesProps)=>{

                    if(value.name==="Vegetarian meal rate per week"){
                        value.value =  response.data.variablesValue[0] * (value.max-value.min) + value.min;
                    }
                    else if(value.name==="Number of coffees consumed per employee per day"){
                        value.value =  response.data.variablesValue[1] * (value.max-value.min) + value.min;
                    } 
                    else if(value.name==="Teleworking rate per week"){
                        value.value =  response.data.variablesValue[2] * (value.max-value.min) + value.min;
                    } 
                    else if(value.name==="Public transportation taken per day"){
                        value.value =  response.data.variablesValue[3] * (value.max-value.min) + value.min;
                    } 
                    else if(value.name==="Number of workdays per week"){
                        value.value =  response.data.variablesValue[4] * (value.max-value.min) + value.min;
                    }

                    return value;
                })

                handleCompanyPropsChange('attributes', updatedAttributes);
            }


        } catch (error: any) {
            console.log(error)
        }

    }

    function handleReferenceCLick() {

    }

    function updateGoals() {
        const updatedGoals = companyProps.goals.map((currentGoals: GoalsProps) => {

            let slope = 0;
            companyProps.relationship.forEach((currentRelationship: RelationshipProps) => {
                if (currentRelationship.secondVariable === currentGoals.name) {

                    const currentAttributes = companyProps.attributes.filter((attributeSearch: AtributesProps) => {
                        if (attributeSearch.name === currentRelationship.firstVariable) {
                            return true;
                        }
                        return false;
                    })

                    if (currentAttributes.length > 0) {

                        const x = currentAttributes[0].value;
                        let y = eval(currentRelationship.linkFunction);
                        slope += y;
                    }
                }
            })

            return { ...currentGoals, value: slope }
        })
        handleCompanyPropsChange("goals", updatedGoals);
    }

    function generateGoalsData() {

        const labels = ['2/2023', '1/2024', '2/2024', '1/2025', '2/2025', '1/2026', '2/2026', '1/2027'];
        const step = 0.5;

        const datasets: any = companyProps.goals.map((currentGoals: GoalsProps) => {

            const nDiscretion = labels.length;
            let graphData = [];
            for (var i = 0; i < nDiscretion * step; i += step) {
                let x = i;
                let y = i * currentGoals.value;
                graphData.push(y);
            }
            const color = getRandomColor();
            return {
                label: currentGoals.name,
                data: graphData,
                borderColor: color,
                backgroundColor: color,
            }
        })

        const data = {
            labels,
            datasets: datasets,
        };

        return data;
    }

    const CustomButton = styled(Button)((theme: any) => ({
        "&.MuiButtonBase-root": {
            textTransform: "none",
            borderWidth: "1px",
            borderBlock: "solid"
        }
    }))

    return (

        <div className='flex flex-col h-full w-full'>
            <div className="App flex w-full flex-row h-80">
                <div className='w-1/3 h-full'>
                    <h1 className='text-center text-2xl text-gray-600 my-4'>
                        Company Specs
                    </h1>
                    <Paper className='flex flex-col p-4 pl-4 pr-12 m-2 h-full overflow-y-scroll'>
                        {
                            companyProps.specs.map((value: SpecsProps, index: number) => {
                                return <SpecsItem
                                    key={index}
                                    specsProps={value}
                                    handleSpecsChange={handleSpecsChange}
                                />
                            })
                        }
                    </Paper>
                </div>
                <div className='w-1/3'>
                    <h1 className='text-center text-2xl text-gray-600 my-4'>
                        Goals
                    </h1>
                    <Paper className='flex flex-col p-4 pl-4 pr-12 m-2 h-full  overflow-y-scroll'>
                        {
                            companyProps.goals.map((localProps: GoalsProps, index: number) => {
                                return <GoalItem
                                    key={index}
                                    goalsProps={localProps}
                                    handleGoalChange={handleGoalChange}
                                />
                            })
                        }
                    </Paper>
                </div>
                <div className='w-1/3'>
                    <h1 className='text-center text-2xl text-gray-600 my-4'>
                        Variables
                    </h1>
                    <Paper className='flex flex-col p-4 pl-4 pr-12 m-2 h-full overflow-y-scroll'>
                        {
                            companyProps.attributes.map((localProps: AtributesProps, index: number) => {
                                return <AttributesItem
                                    key={index}
                                    attributesProps={localProps}
                                    value-refresh={localProps.value}
                                    handleAttributesChange={handleAttributesChange}
                                />
                            })
                        }
                    </Paper>
                </div>
            </div>
            <div className="App flex w-full flex-row h-96 mt-32">
                <div className='w-1/3 h-full'>
                    <h1 className='text-center text-2xl text-gray-600 my-4'>
                        Variables relationships
                    </h1>
                    <Paper className='flex flex-row p-4 m-2 h-full overflow-x-scroll justify-start'>
                        {
                            cachedVariablesRelatioship
                        }
                    </Paper>
                </div>
                <div className='w-1/3 h-full'>
                    <h1 className='text-center text-2xl text-gray-600 my-4'>
                        Prediction
                    </h1>
                    <Paper className='flex flex-col px-2 m-2 h-full items-center justify-center'>
                        <Line
                            options={goalsGraphOptions}
                            data={generateGoalsData()}
                        />
                    </Paper>
                </div>
                <div className='w-1/3 h-full flex flex-col justify-center align-middle items-center'>
                    <CustomButton
                        className='text-center !text-2xl !text-gray-600 my-4 '
                        sx={{ marginBottom: 2 }}
                        onClick={handlePredictCLick}>
                        Predict
                    </CustomButton>
                    <Link
                        className='text-center !text-2xl !text-gray-600 my-4 '
                        to={'/references'}>
                        References
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default Calculator;
