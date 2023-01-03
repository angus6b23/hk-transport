/*export async function fetch_kmb(){
    let kmb = {stop: [], route: []};
    let kmb_route_response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/')
    let kmb_route_json = await kmb_route_response.json();
    let kmb_route_stop_response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route-stop');
    let kmb_route_stop_json = await kmb_route_stop_response.json();
    let kmb_stop_response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/stop');
    let kmb_stop_json = await kmb_stop_response.json();
    kmb.stop = kmb_stop_json.data;
    kmb.route = [...kmb_route_json.data]
    for (let i = 0; i < kmb.route.length; i++){
        let stop_array = kmb_route_stop_json.data.filter(x => x.route == kmb.route[i].route && x.bound == kmb.route[i].bound && x.service_type == kmb.route[i].service_type);
        stop_array.sort((a,b) => a.seq - b.seq);
        kmb.route[i].stop = stop_array.map(y => y.stop);
    }
    return kmb
}
*/
export async function get_buses(){
    let buses_response = await fetch('https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json'); //Get all buses information from data.gov.hk
    let buses_json = await buses_response.json();
    let buses_obj = buses_json.features;

    let buses = buses_obj.reduce(function(buses, stop){ //reduce(function (accumulator, currentValue) { /* … */ }, initialValue)
        let new_stop = { //Create new stop
                name_tc: stop.properties.stopNameC.replace('<br>' , ''),
                name_en: stop.properties.stopNameE.replace('<br>' , ''),
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
    // console.log(buses.filter(x => x.route_no == 1));
    return buses;
}

export async function get_minibuses(){
    let minibuses_response = await fetch('https://static.data.gov.hk/td/routes-fares-geojson/JSON_GMB.json'); //Get all minibuses information from data.gov.hk
    let minibuses_json = await minibuses_response.json();
    let minibuses_obj = minibuses_json.features;

    let minibuses = minibuses_obj.reduce(function(minibuses, stop){ //reduce(function (accumulator, currentValue) { /* … */ }, initialValue)
        let new_stop = { //Create new stop
                name_tc: stop.properties.stopNameC.replace('<br>' , ''),
                name_en: stop.properties.stopNameE.replace('<br>' , ''),
                id: stop.properties.stopId,
                seq: stop.properties.stopSeq,
                coord: stop.geometry.coordinates
            }
        let filtered_minibus_route = minibuses.filter(minibus => minibus.route_no == stop.properties.routeNameE && minibus.company == stop.properties.companyCode && minibus.route_direction == stop.properties.routeSeq && minibus.service_mode == stop.properties.serviceMode); //Check if route of current stop is stored
        if (filtered_minibus_route.length == 0){ //Create route if not found
            let new_minibus_route = {
                    company: stop.properties.companyCode,
                    district: stop.properties.district,
                    route_id: stop.properties.routeId,
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
                    new_minibus_route.dest_tc = stop.properties.locEndNameC;
                    new_minibus_route.dest_en = stop.properties.locEndNameE;
                    new_minibus_route.orig_tc = stop.properties.locStartNameC;
                    new_minibus_route.orig_en = stop.properties.locStartNameE;
                } else { //Direction 2 = Outbound
                    new_minibus_route.dest_tc = stop.properties.locStartNameC;
                    new_minibus_route.dest_en = stop.properties.locStartNameE;
                    new_minibus_route.orig_tc = stop.properties.locEndNameC;
                    new_minibus_route.orig_en = stop.properties.locEndNameE;
                }
            new_minibus_route.stops.push(new_stop);
            minibuses.push(new_minibus_route);
        } else { //Push the new stop to pre-existing route
            filtered_minibus_route[0].stops.push(new_stop);
        }
        return minibuses;
    }, []); //Initial value for reduce
    // console.log(minibuses.filter(x => x.route_no == 1));
    return minibuses;
}
