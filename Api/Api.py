from fastapi import FastAPI
from pydantic import BaseModel
from services.CarbonImpact import optimize
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

class CarbonImpactRequest(BaseModel):
    nemploye : str
    growth : float
    carbon : float
    mingrowth : float


@app.post("/minimize/carbon_impact")
async def minimizeCarbonImpact(request : CarbonImpactRequest):
    print(request)
    response = optimize(int(request.nemploye), float(request.growth), float(request.carbon), float(request.mingrowth))
    return response