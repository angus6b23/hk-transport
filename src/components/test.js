async function get_buses(){
    let buses_response = await fetch('https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json'); //Get all buses information from data.gov.hk
    let buses_json = await buses_response.json();
    let buses_obj = buses_json.features;

    let buses = buses_obj.reduce(function(buses, stop){ //reduce(function (accumulator, currentValue) { /* … */ }, initialValue)
        let new_stop = { //Create new stop
                name_tc: stop.properties.stopNameC,
                name_en: stop.properties.stopNameE,
                id: stop.properties.stopId,
                seq: stop.properties.stopSeq,
                coord: stop.geometry.coordinates
            }
        let filtered_bus_route = buses.filter(bus => bus.route_no == stop.properties.routeNameE && bus.company == stop.properties.companyCode && bus.route_direction == stop.properties.routeSeq && bus.service_mode == stop.properties.serviceMode); //Check if route of current stop is stored
        if (filtered_bus_route.length == 0){ //Create route if not found
            let new_bus_route = {
                    company: stop.properties.companyCode,
                    route_no: stop.properties.routeNameE,
                    service_mode: stop.properties.serviceMode,
                    special_type: stop.properties.specialType,
                    link: stop.properties.hyperlinkE,
                    full_fare: stop.properties.fullFare,
                    route_direction: stop.properties.routeSeq,
                    journey_time: stop.properties.journeyTime,
                    stops: []
            }
            if (stop.properties.routeSeq == 1){ //Direction 1 = Inbound
                    new_bus_route.dest_tc = stop.properties.locEndNameC;
                    new_bus_route.dest_en = stop.properties.locEndNameE;
                    new_bus_route.orig_tc = stop.properties.locStartNameC;
                    new_bus_route.orig_en = stop.properties.locStartNameE;
                } else { //Direction 2 = Outbound
                    new_bus_route.dest_tc = stop.properties.locStartNameC;
                    new_bus_route.dest_en = stop.properties.locStartNameE;
                    new_bus_route.orig_tc = stop.properties.locEndNameC;
                    new_bus_route.orig_en = stop.properties.locEndNameE;
                }
            new_bus_route.stops.push(new_stop);
            buses.push(new_bus_route);
        } else { //Push the new stop to pre-existing route
            filtered_bus_route[0].stops.push(new_stop);
        }
        return buses;
    }, []); //Initial value for reduce
    for (let index in buses){
        buses[index].company = buses[index].company.split('+'); //Split bus companys into array
    }
    console.log(buses.filter(x => x.route_no.indexOf('277X') == 0));
}
get_buses();
