import axios from "axios";

const DOMAIN = "http://localhost:8000"
export async function minimizeCarbonImpact(nemploye: number, growth: number, carbon: number, mingrowth: number, variablesFreedom: boolean[], variablesValue: number[]) {

    const url = DOMAIN + "/minimize/carbon_impact";
    var options = {
        method: 'POST',
        url: url,
        data: {
            "nemploye": nemploye,
            "growth": growth,
            "carbon": carbon,
            "mingrowth": mingrowth,
            "variablesFreedom": variablesFreedom,
            "variablesValue": variablesValue
        }
    };

    return axios.request(options);
}