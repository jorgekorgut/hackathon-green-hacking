from scipy.optimize import minimize

class variable:
    def __init__(self, name, min, max, default, growth_fun=None, carbon_fun=None):
        self.name = name
        self.min = min
        self.max = max
        self.default = default
        self.value = default
        self.carbon_fun = carbon_fun
        self.growth_fun = growth_fun
    def get_default_growth(self):
        return self.growth_fun(self.default)
    def get_default_carbon(self):
        return self.carbon_fun(self.default)


#    country = "France"
def optimize(nemploye, growth, carbon, mingrowth):
    remote_g_fun = lambda x: -x*(x-1)

    linear = lambda minx, maxx, miny, maxy: lambda x: (x-minx) * (maxy-miny)/(maxx-minx) + miny

    diet = variable("diet", 0, 1, 0.3, growth_fun=linear(0,1,1,-2), carbon_fun=linear(0,1,7,0.5))
    coffee = variable("coffee", 0, 10, 1.36, growth_fun=linear(0,10,-0.33, 0.66), carbon_fun=linear(0,10,0, 1.4855))
    remote = variable("remote", 0, 1, 0.15, growth_fun=remote_g_fun, carbon_fun=linear(0,1,0, -234/365))

    growth_f = lambda x: (diet.growth_fun(x[0]) + coffee.growth_fun(x[1]) + remote.growth_fun(x[2]))
    carbon_f = lambda x: (diet.carbon_fun(x[0]) + coffee.carbon_fun(x[1]) + remote.carbon_fun(x[2]))

    growth_f_opt = lambda x: -growth_f(x)
    carbon_f_opt = lambda x: carbon_f(x)

    growth_default = nemploye*(diet.get_default_growth() + coffee.get_default_growth() + remote.get_default_growth())
    carbon_default = nemploye*(diet.get_default_carbon() + coffee.get_default_carbon() + remote.get_default_carbon())

    bnds = ((diet.min, diet.max), (coffee.min, coffee.max), (remote.min, remote.max))

    cons = ({'type': 'ineq', 'fun': lambda x:  (nemploye*growth_f(x)-growth_default)/(growth+growth_default)-mingrowth})

    res = minimize(carbon_f_opt, (diet.value, coffee.value, remote.value), method='SLSQP', bounds=bnds, constraints=cons)

    # print(res.x)
    # print(res.message)
    # print(growth_f(res.x))
    # print(carbon_f(res.x))

    return {"growth" : (100*(nemploye*growth_f(res.x)-growth_default)/(growth+growth_default)),
            "carbon" : (100*(nemploye*carbon_f(res.x)-carbon_default)/(carbon+carbon_default)),
            "diet" : res.x[0],
            "coffee" : res.x[1],
            "remote" : res.x[2],}





