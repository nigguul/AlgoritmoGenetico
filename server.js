const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const PORT = 14000;
//const HOSTNAME='nexthb.systempe.com.br';
const HOSTNAME='localhost';
const dev = process.env.NODE_ENV !== 'production'
//const dev = false
const app = next({ dev, hostname: HOSTNAME, port: PORT });
const handle = app.getRequestHandler();

const pathsHandler = {
    'getBestRoute': (req, res) => {let data = '';
    req.on('data', info => {
        data += info;
    });

    req.on('end', async () => {
        try {
            data = JSON.parse(data);
            function calculateDistance(route) {
                let totalDistance = 0;
                for (let i = 0; i < route.length - 1; i++) {
                    const cityA = data[route[i]];
                    const cityB = data[route[i + 1]];
                    totalDistance += Math.hypot(cityB.x - cityA.x, cityB.y - cityA.y);
                }
                return totalDistance;
            }
            
            function crossover(parent1, parent2) {
                let child = [];
                let start = Math.floor(Math.random() * parent1.length);
                let end = Math.floor(Math.random() * parent1.length);
            
                for (let i = start; i < end; i++) {
                    child[i] = parent1[i];
                }
            
                parent2.forEach(city => {
                    if (!child.includes(city)) {
                        for (let j = 0; j < parent2.length; j++) {
                            if (!child[j]) {
                                child[j] = city;
                                break;
                            }
                        }
                    }
                });
            
                return child;
            }
            
            function mutate(route, mutationRate) {
                for (let i = 0; i < route.length; i++) {
                    if (Math.random() < mutationRate) {
                        let indexA = Math.floor(Math.random() * route.length);
                        let indexB = Math.floor(Math.random() * route.length);
            
                        let temp = route[indexA];
                        route[indexA] = route[indexB];
                        route[indexB] = temp;
                    }
                }
            
                return route;
            }
            
            function createRoute() {
                let route = [...Array(data.length).keys()];
                for (let i = route.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [route[i], route[j]] = [route[j], route[i]];
                }
                return route;
            }
            
            function initializePopulation(populationSize) {
                let population = [];
                for (let i = 0; i < populationSize; i++) {
                    population.push(createRoute());
                }
                return population;
            }
            
            function geneticAlgorithm(population, generations, mutationRate) {
                let bestRoute;
                let bestDistance = Number.MAX_SAFE_INTEGER;
            
                for (let gen = 0; gen < generations; gen++) {
                    let newPopulation = population.map(route => mutate([...route], mutationRate));
            
                    newPopulation.forEach(route => {
                        let distance = calculateDistance(route);
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestRoute = route;
                        }
                    });
            
                    population = newPopulation;
                }
            
                return bestRoute;
            }

            let populationSize = 100;
            let generations = 1000;
            let mutationRate = 0.05;
            let initialPopulation = initializePopulation(populationSize);

            let bestRoute = geneticAlgorithm(initialPopulation, generations, mutationRate);

            const response = bestRoute.map(index => data[index].city);
            
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(response));
            } catch(err) {
                res.statusCode = 403;
                res.end();
            }
        });
    }
}

// [---] App Initialization [---]
app.prepare().then(() => {
    const httpserver = createServer(async (req, res)  => {
        //console.log("[*] New Request");
        //console.log(req.method);
        //console.log(req.url);

        const parsedUrl = parse(req.url, true);
        let { pathname, query } = parsedUrl;
        pathname = pathname.split('/');
        pathname.splice(0, 1);
        
        try {
            pathsHandler[pathname[0]](req, res);
        } catch (err) {
            handle(req, res, parsedUrl)
        }
    });

    httpserver.listen(process.env.PORT || 14000, async (err) => {
        if (err) throw err
        
        try {
            console.log("> Algoritmo Genético")
            console.log("> Connected in Oracle Client")
            console.log('> Ready on http://localhost:14000');
        } catch (error) {
            console.log(error)
        }
    });
})