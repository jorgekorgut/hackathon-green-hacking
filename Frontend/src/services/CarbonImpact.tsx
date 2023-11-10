import axios from "axios";

const DOMAIN = "http://localhost:8000"
export async function minimizeCarbonImpact(nemploye: number, growth: number, carbon: number, mingrowth: number) {
    await test();
    const url = DOMAIN + "/minimize/carbon_impact";
    var options = {
        method: 'POST',
        url: url,
        data: {
            "nemploye": nemploye,
            "growth": growth,
            "carbon": carbon,
            "mingrowth": mingrowth,

        }
    };

    return axios.request(options);
}

export async function test() {

    const url = DOMAIN;
    var options = {
        method: 'GET',
        url: url,
    };

    return axios.request(options);
}