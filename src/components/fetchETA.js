class etaResult{
    constructor(seq, etas, note){
        this.seq = seq;
        this.etas = etas;
        this.note = note;
    }
}
function getTimeDifference(DateA, DateB){
    return Math.abs(Math.ceil((DateA - DateB) / 60000));
}

export async function fetchKMBETA(route){
    let etaData = {
        status: '',
        data: []
    }
    try {
        let serviceType = (route.serviceMode == 'T') ? 2 : 1; //Service type: R => 1, others => 2 ???
        let direction = (route.routeDirection == 1) ? 'O' : 'I'; //Direction 1 = outbound, 2 = inbound
        let routeResponse = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${route.routeNo}/${serviceType}`);
        // Return Network error if response not ok
        if (!routeResponse.ok){
            etaData.status = 'netError'
            return { etaData }
        }
        let routeEta = await routeResponse.json();
        // Filter for currently selected direction
        routeEta = routeEta.data.filter(x => x.dir == direction);
        // Loop for all elements of filtered array
        routeEta.forEach(element => {
            // Check if current seq already existed
            let index = etaData.data.findIndex(x => x.seq == element.seq);
            if (element.eta){
                let eta = getTimeDifference(new Date(element.data_timestamp), new Date(element.eta));
                if (index == -1){ //Create new element if current seq exist
                    etaData.data.push(new etaResult(element.seq, [eta], ''));
                } else {
                    etaData.data[index].etas.push(eta);
                }
            } else {
                if (index == -1) {
                    etaData.data.push(new etaResult(element.seq, [], 'NA'));
                } else {
                    etaData.data[index].note = 'NA';
                }
            }
        });
    } catch (err) {
        console.error(err);
        etaData.status = 'netError'
        return { etaData }
    }
    // Sort etas before returning
    etaData.data.forEach(element => {
        element.etas.sort((a,b)=>a-b);
    })
    etaData.status = 'success';
    return etaData;
}
    /*
    if (route.company.includes('CTB') || route.company.includes('NWFB') || route.company.includes('NLB')) {
        let company = (route.company.includes('CTB')) ? 'CTB' :
            (route.company.includes('NWFB')) ? 'NWFB' :
                (route.company.includes('NLB')) ? 'NLB' : null;
        let direction = (route.routeDirection == 1) ? 'outbound' : 'inbound'; //Direction 1 = outbound, 2 = inbound
        try {
            if (route.stops[0].stop_id == '') {
                // Get Bus stop ids first
                let route_response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${company}/${route.routeNo}/${direction}`);
                let route_data = await route_response.json();
                route_data = route_data.data;
                // Insert the stop ids into bus object
                for (stop of route.stops) {
                    let index = route_data.findIndex(x => x.seq == stop.seq);
                    stop.stop_id = route_data[index].stop;
                }
            }
            // Get etas
            direction = (route.routeDirection == 1) ? 'O' : 'I';
            for (const stop of route.stops) {
                let eta_response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${company}/${stop.stop_id}/${route.routeNo}`);
                let eta_data = await eta_response.json();
                eta_data = eta_data.data.filter((x) => x.dir == direction);
                // console.log(eta_data);
                for (const eta of eta_data) {
                    if (eta.eta != '') {
                        let current_time = new Date(eta.data_timestamp);
                        let eta_time = new Date(eta.eta);
                        let eta_duration = Math.ceil((eta_time - current_time) / 60000);
                        (eta_duration < 0) ? eta_duration = 0 : null;
                        stop.etas.push(eta_duration)
                    }
                }
            }
            // console.log(route_data);
        } catch (err) {
            console.error(err);
        }
    }
    for (stop of route.stops) {
        if (stop.etas.length == 0) {
            stop.eta_message = 'no_available_bus'
        } else {
            stop.etas.sort((a, b) => a - b);
            stop.eta_display = [...stop.etas];
        }
    } */