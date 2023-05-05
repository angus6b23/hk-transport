import axios from 'axios';
import axiosRetry from 'axios-retry'

function createStop(item){
    let {stopNameC: nameTC, stopNameE: nameEN, stopId: id, stopSeq: seq } = item.properties;
    let {coordinates: coord} = item.geometry;
    let newStop = {
        nameTC: nameTC.replace('<br>', ''),
        nameEN: nameEN.replace('<br>', ''),
        id: id,
        seq: seq,
        coord: coord,
        etas: [],
        etaMessage: ''
    };
    return newStop
}
function createRoute(item, type){
    let { companyCode: company, routeNameE: routeNo, routeId, serviceMode, specialType, hyperlinkE: infoLink, fullFare, routeSeq: routeDirection, journeyTime} = item.properties; //Deconstruct item;
    let originEN, originTC, destEN, destTC;
    if (item.properties.routeSeq == 1){ //Direction 1 = Inbound
        destTC = item.properties.locEndNameC;
        destEN = item.properties.locEndNameE;
        originTC = item.properties.locStartNameC;
        originEN = item.properties.locStartNameE;
    } else { //Direction 2 = Outbound
        destTC = item.properties.locStartNameC;
        destEN = item.properties.locStartNameE;
        originTC = item.properties.locEndNameC;
        originEN = item.properties.locEndNameE;
    }
    let newRoute = {
        company: company,
        routeNo: routeNo,
        routeId: routeId,
        serviceMode: serviceMode,
        specialType: specialType,
        infoLink: infoLink,
        fullFare: fullFare,
        routeDirection: routeDirection,
        journeyTime: journeyTime,
        destTC: destTC,
        destEN: destEN,
        originTC: originTC,
        originEN: originEN,
        stops: [],
        starred: false,
    }
    if (type == 'bus'){
        newRoute.type = 'bus'
        return newRoute;
    }
    else if (type == 'minibus'){
        newRoute.type = 'minibus'
        let { district } = item.properties;
        newRoute.district = district;
        return newRoute
    }
}

function presentDownloadProgress(progressEvent){
    const loadingProgress = document.querySelector('#loading-progress');
    loadingProgress.textContent = Math.floor(progressEvent.progress * 100) + '%'
}

async function fetchBuses(){
    try{
        axiosRetry(axios, {retry: 3});
        // const busesResponse = await axios('./JSON_BUS.json'); //Use json in from local for debugging purpose
        const busesResponse = await axios(
            'https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json',
            {
                onDownloadProgress: presentDownloadProgress
            }
        ); //Get all buses information from data.gov.hk
        const busesObj = busesResponse.data.features;
        const buses = busesObj.reduce(function(buses, item){ //reduce(function (accumulator, currentValue) { ... }, initialValue)
            const newStop = createStop(item);
            const checkIndex = buses.findIndex(bus => bus.routeId == item.properties.routeId && bus.routeDirection == item.properties.routeSeq); //Check if route of current stop is stored
            if (checkIndex == -1){ //Create route if not found
                const newBusRoute = createRoute(item, 'bus');
                newBusRoute.stops.push(newStop);
                buses.push(newBusRoute);
            } else { //Push the new stop to pre-existing route
                buses[checkIndex].stops.push(newStop);
            }
            return buses;
        }, []); //Initial value for reduce
        // Get service modes from kmb
        try{
            axiosRetry(axios, { retry: 3 });
            const kmbResponse = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/');
            const kmbJson = await kmbResponse.json();
            const checkParenthesis = /\(.*$/; // Remove parenthesis due to different naming
            const kmbFiltered = kmbJson.data.filter(kmb => kmb.serviceType != '1');
            // Search for kmb service mode != 1
            for (const specialRoute of kmbFiltered){
                const checkIndex = buses.findIndex(bus => bus.serviceMode != 'R' && bus.routeNo == specialRoute.route && bus.destEN.replace(checkParenthesis, '') == specialRoute.dest_en.replace(checkParenthesis, ''));
                if (checkIndex != -1){
                    buses[checkIndex].specialType = specialRoute.service_type;
                }
            }
        } catch (err){
            console.error(err);
        }
        try{
            axiosRetry(axios, { retry: 3 });
            const nlbResponse = await axios('https://rt.data.gov.hk/v2/transport/nlb/route.php?action=list');
            const originRegex = /^\w.* \>/;
            const destRegex = /\> \w.*$/;
            const checkParenthesis = / \(Circu.*$/; // Remove parenthesis due to different naming
            for (const element of nlbResponse.data.routes){
                const origin = element.routeName_e.match(originRegex)[0].replace(' >', '');
                const dest = element.routeName_e.match(destRegex)[0].replace('> ', '').replace(checkParenthesis, '');
                const checkIndex = buses.findIndex(bus => bus.company == 'NLB' && bus.routeNo == element.routeNo && bus.destEN == dest && bus.originEN == origin);
                // console.log(`
                // route: ${element.routeNo}
                // Destination: ${dest}
                // Origin: ${origin}
                // Index: ${checkIndex}`)
                if (checkIndex != -1){
                    buses[checkIndex].nlbID = element.routeId;
                }
            }
        } catch(err){
            console.error(err)
        }

        for (let index in buses){
            buses[index].company = buses[index].company.split('+'); //Split bus companys into array
        }
        return buses;
    }
    catch(err){
        console.error(err);
    }
}

async function fetchMinibuses(){
    try{
        let minibuses_response = await fetch('https://static.data.gov.hk/td/routes-fares-geojson/JSON_GMB.json'); //Get all minibuses information from data.gov.hk
        let minibuses_json = await minibuses_response.json();
        let minibuses_obj = minibuses_json.features;
        let minibuses = minibuses_obj.reduce(function(minibuses, item){ //reduce(function (accumulator, currentValue) {  …  }, initialValue)
            let newStop = createStop(item);
            let checkIndex = minibuses.findIndex(minibus => minibus.routeNo == item.properties.routeNameE && minibus.company == item.properties.companyCode && minibus.routeDirection == item.properties.routeSeq && minibus.serviceMode == item.properties.serviceMode); //Check if route of current stop is stored
            if (checkIndex == -1){ //Create route if not found
                let newMinibusRoute = createRoute(item, 'minibus');
                newMinibusRoute.stops.push(newStop);
                minibuses.push(newMinibusRoute);
            } else { //Push the new stop to pre-existing route
                minibuses[checkIndex].stops.push(newStop);
            }
            return minibuses;
        }, []); //Initial value for reduce
        return minibuses;
    }
    catch(err){
        console.error(err);
    }
}

const fetchAll = async () => {
    await Promise.all([fetchBuses, fetchMinibuses]);
    
}
export { fetchBuses, fetchMinibuses }
/* TEST ONLY */
/*
(async()=>{
    let minibuses = await fetchMinibuses();
    let promise1 = await minibuses[1].getStops();
    console.log(minibuses[1].stops);
})();
*/
