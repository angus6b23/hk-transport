import { getDistance } from 'geolib'

export default async function getNearbyRoutesPromise(data, maxResults){
    return new Promise((resolve) => getNearbyRoutes(data, maxResults, resolve))
}

function getNearbyRoutes(data, maxResults, resolve) {
    try {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success callback function
                // Make a clone data array with a key min Distance
                let dataWithMinDistance = data.map((item) => {
                    // Iterate through the stops of each route, obtain the smallest distance between current position and stop
                    const minDistance = item.stops.reduce((acc, cur) => {
                        if (cur.coord != undefined) {
                            const distance = getDistance(
                                    {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    },
                                    {
                                        latitude: cur.coord[1],
                                        longitude: cur.coord[0],
                                    }
                            )
                            return Math.min(distance, acc)
                        } else {
                            return acc
                        }
                    }, Infinity) // Starts the stop with Infinity
                    return {...item, minDistance: minDistance}
                })
                // Only show the routes within 1km => slice the results within the config => sort according to the minDistance 
                resolve(dataWithMinDistance.filter(item => item.minDistance < 1000).sort((a, b) => a.minDistance - b.minDistance).slice(0, maxResults))
            },
            () => {
                // Fail call back function
                resolve(new Error('get Location failed'))
            }
        )
    } catch (err) {
        resolve(err)
    }
}
