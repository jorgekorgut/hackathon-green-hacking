from scipy.optimize import minimize

class variable:
    def __init__(self, name, min, max, default, value=None, growth_fun=None, carbon_fun=None):
        self.name = name
        self.min = min
        self.max = max
        self.default = default
        self.default = default
        self.value = value if value is not None else default
        self.carbon_fun = carbon_fun
        self.growth_fun = growth_fun
    def get_default_growth(self):
        return self.growth_fun(self.default)
    def get_default_carbon(self):
        return self.carbon_fun(self.default)
    def get_value_growth(self):
        return self.growth_fun(self.value)
    def get_value_carbon(self):
        return self.carbon_fun(self.value)


#    country = "France"
def optimize(nemploye, growth, carbon, mingrowth, variablesFreedom, variablesValue):

    parabolic = lambda zero1, zero2: lambda x: -(x-zero1)*(x-zero2)
    linear = lambda minx, maxx, miny, maxy: lambda x: (x-minx) * (maxy-miny)/(maxx-minx) + miny
    zero = lambda x: 0

    diet = variable("diet", 0, 1, 0.3, variablesValue[0], growth_fun=linear(0,1,1,-2), carbon_fun=linear(0,1,7,0.5))
    coffee = variable("coffee", 0, 1, 0.136, variablesValue[1], growth_fun=linear(0,1,-0.33, 0.66), carbon_fun=linear(0,1,0, 1.4855))
    remote = variable("remote", 0, 1, 0.15, variablesValue[2], growth_fun=parabolic(0,1), carbon_fun=linear(0,1,0, -234/365))
    transport = variable("transport", 0, 1, 0.3, variablesValue[3], growth_fun=zero, carbon_fun=linear(0,1,0, -1))
    workingdays = variable("workingdays", 0, 1, 1, variablesValue[4], growth_fun=parabolic(0,1), carbon_fun=linear(0,1,0, -234/365))

    variables = [diet, coffee, remote, transport, workingdays]

    usedVarIndices = []
    for i in range(len(variables)):
        if variablesFreedom[i]:
            usedVarIndices.append(i)

    growth_f = lambda x: sum([variables[usedVarIndices[i]].growth_fun(x[i]) for i in range(len(usedVarIndices))]) + sum([0 if variablesFreedom[i] else variables[i].get_value_growth()  for i in range(len(variablesFreedom))]) 
    carbon_f = lambda x: sum([variables[usedVarIndices[i]].carbon_fun(x[i]) for i in range(len(usedVarIndices))]) + sum([0 if variablesFreedom[i] else variables[i].get_value_carbon()  for i in range(len(variablesFreedom))]) 

    growth_f_opt = lambda x: -growth_f(x)
    carbon_f_opt = lambda x: carbon_f(x)

    growth_default = nemploye*sum([var.get_default_growth() for var in variables])
    carbon_default = nemploye*sum([var.get_default_carbon() for var in variables])

    bnds = [(variables[i].min, variables[i].max) for i in usedVarIndices] 

    cons = ({'type': 'ineq', 'fun': lambda x:  (nemploye*growth_f(x)-growth_default)/(growth+growth_default)-mingrowth})

    res = minimize(carbon_f_opt, [variables[i].value for i in usedVarIndices], method='SLSQP', bounds=bnds, constraints=cons)

    for i in range(len(usedVarIndices)):
        variables[usedVarIndices[i]].value = res.x[i]

    # print(res.x)
    # print(res.message)
    # print(growth_f(res.x))
    # print(carbon_f(res.x))

    return {"growth" : (100*(nemploye*growth_f(res.x)-growth_default)/(growth+growth_default)),
            "carbon" : (100*(nemploye*carbon_f(res.x)-carbon_default)/(carbon+carbon_default)),
            "variablesValue" : [var.value for var in variables]}





