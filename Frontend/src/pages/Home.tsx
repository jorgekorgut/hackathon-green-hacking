import { Paper } from "@mui/material";
import { Link } from "react-router-dom";

export function Home(props: any) {

    return <div className="flex flex-row w-full items-center justify-center mt-48">
        <Paper className="w-96 h-96 m-10 flex flex-col justify-center">
            <h1 className="text-center text-2xl mt-2 text-gray-600  opacity-50">
                Credit Agricole
            </h1>
            <div className="w-60 h-60 flex self-center opacity-50">
                <img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/credit_agricole_logo_icon_170306.png" className="object-scale-down"></img>
            </div>
        </Paper>

        <Link to="/calculator">
            <Paper
                className="w-96 h-96 m-10 flex flex-col justify-center hover:border-gray-500 hover:border-solid hover:border-8 hover:cursor-pointer"
            >
                <h1 className="text-center text-2xl mt-2 text-gray-600">
                    Societe Generale
                </h1>
                <div className="w-60 h-60 flex self-center ">
                    <img src="https://www.societegenerale.com/sites/default/files/logo-societe-generale.png"></img>
                </div>
            </Paper>
        </Link>


        <Paper className="w-96 h-96 m-10 flex flex-col justify-center opacity-50">
            <h1 className="text-center text-2xl mt-2 text-gray-600">
                BNP Paribas
            </h1>
            <div className="w-60 h-60 flex self-center ">
                <img src="https://logos-marques.com/wp-content/uploads/2020/12/BNP-Paribas-logo.png" className="object-scale-down"></img>
            </div>
        </Paper>
    </div>
}