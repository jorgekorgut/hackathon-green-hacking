import { CompanyProps } from "../pages/Calculator";

const initialValue: CompanyProps = {
    name: "Societe Generale",
    specs: [
        { name: "Country", value: "France" },
        { name: "Number of employees", value: "117000" },
        { name: "Turnover", value: "28100000000" }
    ],
    goals: [
        { name: "Growth (%)", value: 0.05, min: -0.5, max: 0.5, data: undefined },
        { name: "Carbon Emission (%)", value: -0.05, min: -0.5, max: 0.5, data: undefined },
        { name: "Employee Happiness", value: 0.5, min: -1, max: 1, data: undefined },
        { name: "Brand corporate identity", value: 0.6, min: -1, max: 1, data: undefined }
    ],
    attributes: [
        { name: "Vegetarian meal rate per week", value: 0.6, blocked: false, min: 0, max: 7 },
        { name: "Number of coffees consumed per employee per day", value: 1, blocked: false, min: 0, max: 10 },
        { name: "Teleworking rate per week", value: 0.3, blocked: false, min: 0, max: 7 },
        { name: "Public transportation taken per day", value: 0.3, blocked: false, min: 0, max: 5 },
        { name: "Number of workdays per week", value: 5, blocked: false, min: 3, max: 5 },
        { name: "Number of trees planted per month (1e3)", value: 60, blocked: false, min: 0, max: 100 },
    ],
    relationship: [
        { firstVariable: "Vegetarian meal rate per week", secondVariable: "Growth (%)", linkFunction: "Math.sqrt(x)/100" },
        { firstVariable: "Vegetarian meal rate per week", secondVariable: "Carbon Emission (%)", linkFunction: "1/((x+10)/20)-2" },
        { firstVariable: "Number of coffees consumed per employee per day", secondVariable: "Growth (%)", linkFunction: "Math.sqrt(x+5)/100" },
        { firstVariable: "Brand corporate identity", secondVariable: "Growth (%)", linkFunction: "1/(x+10)/10" },
        { firstVariable: "Employee Happiness", secondVariable: "Growth (%)", linkFunction: "Math.sqrt(x+5)/100" },
    ]
}

export function loadData() {
    return initialValue;
}