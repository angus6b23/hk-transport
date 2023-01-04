// let data = {
//     bus: getBuses(),
//     minibus: getMinibuses()
// }
(async()=>{
    // let buses = await getBuses();
    let minibuses = await getMinibuses();
    let data = {
        bus: buses,
        minibus: minibuses
    }
    console.log(data.minibus);
    data.minibus[0].getStops();
    export {data.bus as bus, data.minibus as minibus}
})();
class route{
    constructor(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink){
        this.company = company;
        this.routeNo = routeNo;
        this.originEN = originEN;
        this.originTC = originTC;
        this.serviceMode = serviceMode;
        this.specialType = specialType;
        this.fullFare = fullFare;
        this.routeDirection = routeDirection;
        this.journeyTime = journeyTime;
        this.infoLink = infoLink;
        this.stops = [];
        this.starred = false;
        this.toggleStar = () => {this.starred = !this.starred}
    }
}
class stop{
    constructor(nameTC, nameEN, id, seq, coord){
        this.nameTC = nameTC.replace('<br>' , '');
        this.nameEN = nameEN.replace('<br>' , '');
        this.id = id;
        this.seq = seq;
        this.coord = coord;
    }
}
class busRoute extends route{
    constructor(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink){
        super(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink);
        this.etas = [];
        this.type = 'bus';
    }
}
class minibusRoute extends route{
    constructor(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink, district){
        super(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink);
        this.type = 'minibus';
        this.district = district;
        this.getStops = () =>{
            console.log(this.stops);
        }
    };
}
function createStop(item){
    let {stopNameC: nameTC, stopNameE: nameEN, stopId: id, stopSeq: seq } = item.properties;
    let {coordinates: coord} = item.geometry;
    let originEN, originTC, destEN, destTC;
    let newStop = new stop(nameTC, nameEN, id, seq, coord);
    return newStop
}
function createRoute(item, type){
    let { companyCode: company, routeNameE: routeNo, serviceMode, specialType, hyperlinkE: infoLink, fullFare, routeSeq: routeDirection, journeyTime} = item.properties;
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
    if (type == 'bus'){
        let newRoute = new busRoute(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink);
        return newRoute;
    }
    else if (type == 'minibus'){
        let { district } = item.properties;
        let newRoute = new minibusRoute(company, routeNo, originEN, originTC, destEN, destTC, serviceMode, specialType, fullFare, routeDirection, journeyTime, infoLink, district);
        return newRoute
    }
}
async function getBuses(){
    let busesResponse = await fetch('https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json'); //Get all buses information from data.gov.hk
    let busesJson = await busesResponse.json();
    let busesObj = busesJson.features;
    let buses = busesObj.reduce(function(buses, item){ //reduce(function (accumulator, currentValue) { ... }, initialValue)
        let newStop = createStop(item);
        let checkIndex = buses.findIndex(bus => bus.routeNo == item.properties.routeNameE && bus.company == item.properties.companyCode && bus.routeDirection == item.properties.routeSeq); //Check if route of current stop is stored
        if (checkIndex == -1){ //Create route if not found
            let newBusRoute = createRoute(item, 'bus');
            newBusRoute.stops.push(newStop);
            buses.push(newBusRoute);
        } else { //Push the new stop to pre-existing route
            buses[checkIndex].stops.push(newStop);
        }
        return buses;
    }, []); //Initial value for reduce
    for (let index in buses){
        buses[index].company = buses[index].company.split('+'); //Split bus companys into array
    }
    return buses;
}

async function getMinibuses(){
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
        // console.log(minibuses.filter(x => x.route_no == 1));
        return minibuses;
    }
    catch(err){
        console.error(err);
    }
}
