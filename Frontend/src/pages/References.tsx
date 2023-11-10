import { Paper } from "@mui/material"

export function References() {
    const references = {
        "   Ademe": { "website": "https://www.ademe.fr/", "logo": "https://www.ademe.fr/wp-content/uploads/2022/11/ademe-logo-2022-1.svg" },
        "Statista": { "website": "https://fr.statista.com/", "logo": "https://spaces.statista.com/58cff9e5d0574afe89df7545b6573dd5.jpg" },
        "   Insee": { "website": "https://www.insee.fr/", "logo": "https://www.insee.fr/static/img/impression/LOGO%20INSEE.png" }
    }

    return <div>
        {
            Object.entries(references).map(([key, value]: any) => {
                return <a href={value.website} target="_blank" >
                    <Paper className="flex flex-row justify-between m-10 items-center w-1/3 hover:border-gray-500 hover:border-solid hover:border-l-8 hover:cursor-pointer">

                        <div className="w-60 h-60 flex self-center mx-20">
                            <img src={value.logo} className="object-scale-down m-6"></img>
                        </div>
                        <div className="text-4xl text-gray-600 mx-20">
                            {
                                key
                            }
                        </div>
                    </Paper>
                </a>
            })

        }
    </div >
}