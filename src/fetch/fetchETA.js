import axios from 'axios';

class etaResult {
    constructor(seq, etas, note) {
        this.seq = seq;
        this.etas = etas;
        this.note = note;
    }
}

function getTimeDifference(DateA, DateB) {
    return Math.abs(Math.ceil((DateA - DateB) / 60000));
}

export async function fetchKMBETA(route) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const serviceType = (route.specialType == 0) ? 1 : route.specialType; //Service type: R => 1, others => 2 ???
        const direction = (route.direction == 1) ? 'O' : 'I'; //Direction 1 = outbound, 2 = inbound
        const routeResponse = await axios(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${route.routeNo}/${serviceType}`);
        let routeEta = routeResponse.data;
        // Filter for currently selected direction
        routeEta = routeEta.data.filter(x => x.dir == direction);
        // Loop for all elements of filtered array
        routeEta.forEach(element => {
            // Check if current seq already existed
            let index = etaData.data.findIndex(x => x.seq == element.seq);
            if (element.eta) {
                let eta = getTimeDifference(new Date(element.data_timestamp), new Date(element.eta));
                if (index == -1) { //Create new element if current seq exist
                    etaData.data.push(new etaResult(element.seq, [eta], ''));
                } else { //Push eta to existing stop
                    etaData.data[index].etas.push(eta);
                }
            } else {
                if (index == -1) {
                    etaData.data.push(new etaResult(element.seq, [], 'N/A'));
                } else {
                    etaData.data[index].note = 'N/A';
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
        element.etas.sort((a, b) => a - b);
    })
    etaData.status = 'success';
    return etaData;
}

export async function fetchCTBETA(route, stopId) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const companyCode =
            route.company.includes('CTB') ? 'CTB' :
                route.company.includes('NWFB') ? 'NWFB' : null;
        const etaResponse = await axios(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${companyCode}/${stopId}/${route.routeNo}`);
        let stopEta = etaResponse.data.data;
        // console.log(etaResponse);
        stopEta = stopEta.filter(x => { //Filter the result with the direction requested
            if (route.direction == 1) {
                return x.dir == 'O'
            } else {
                return x.dir == 'I'
            }
        });
        stopEta.forEach(element => {
            const eta = getTimeDifference(new Date(element.eta), new Date(element.data_timestamp));
            etaData.data.push(eta);
        })
        etaData.data.sort((a, b) => a - b);
        etaData.status = 'success'
        return etaData;
    } catch (err) {
        console.error(err);
        etaData.status = 'error';
        etaData.data = err;
        return etaData
    }
}

export async function fetchMtrBusEta(route) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const { data } = await axios.post(`https://rt.data.gov.hk/v1/transport/mtr/bus/getSchedule`, {
            "language": "zh",
            "routeName": route.routeNo
        });
        let stopItems = data.busStop;
        for (let item of stopItems){
            let arrivalTimes = []
            for (let i = 0; i < 3; i++){
                if (item.bus[i]) {
                    let time = (item.bus[i].arrivalTimeInSecond == 108000) ? Math.floor(item.bus[i].departureTimeInSecond / 60) : Math.floor(item.bus[i].arrivalTimeInSecond / 60);
                    time = (time < 0) ? 0 : time;
                    arrivalTimes.push(time)
                }
            }
            etaData.data.push({
                stationId: item.busStopId,
                etas: arrivalTimes,
                note: (arrivalTimes.length == 0) ? 'N/A' : ''
            })
        }
        etaData.status = 'success'
        return etaData
        /*
        let filteredStops = []
        if (route.destEN.toLowerCase().includes('circular')){
            filteredStops = data.busStop
        }
        else if (route.direction == 1) {
            filteredStops = data.busStop.filter(item => item.busStopId.includes('-D'))
        } else {
            filteredStops = data.busStop.filter(item => item.busStopId.includes('-U'))
        }
        if (filteredStops.length > 0) {
            // Loop all stops
            for (let i = 0; i < filteredStops.length; i++) {
                let targetStop = filteredStops[i]
                let arrivalTimes = []
                for (let j = 0; j < 3; j++) {
                    if (targetStop.bus[j]) {
                        let time = (targetStop.bus[j].arrivalTimeInSecond == 108000) ? Math.floor(targetStop.bus[j].departureTimeInSecond / 60) : Math.floor(targetStop.bus[j].arrivalTimeInSecond / 60);
                        time = (time < 0) ? 0 : time;
                        arrivalTimes.push(time)

                    }
                }
                etaData.data.push(new etaResult(i + 1, arrivalTimes, ''))
            }
            etaData.status = 'success'
            return etaData
        }
        */
    } catch (err) {
        console.error(err);
        etaData.status = 'error'
        etaData.data = err
        return etaData
    }
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
export async function fetchNLBEta(route) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const routeId = route.routeId;
        const stopIds = route.stops.map(stop => stop.stopId)
        let NLBResponses = stopIds.map(id => {
            if (id != '') {
                return axios(`https://rt.data.gov.hk/v2/transport/nlb/stop.php?action=estimatedArrivals&routeId=${routeId}&stopId=${id}&language=zh`)
            }
        })
        NLBResponses = await axios.all(NLBResponses);
        // console.log(NLBResponses);
        for (let response of NLBResponses) {
            let stopIdRegex = /stopId\=.*\&/
            let stopId = response.config.url.match(stopIdRegex)[0].replace('stopId=', '').replace('&', '')
            let arrivalTimes = [];
            for (let item of response.data.estimatedArrivals) {
                if (item) {
                    let time = getTimeDifference(new Date(item.estimatedArrivalTime), new Date(item.generateTime))
                    arrivalTimes.push(time)
                }
            }
            etaData.data.push({
                stopId: stopId,
                etas: arrivalTimes,
                note: (arrivalTimes.length == 0) ? 'N/A' : ''
            })
        }
        etaData.status = 'success'
        return etaData
    } catch (err) {
        etaData.status = 'fail'
        return etaData;
    }
}

export async function fetchMinibusEta(route) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const routeId = route.routeId;
        const direction = route.direction;
        let minibusResponse = route.stops.map(stop => axios(`https://data.etagmb.gov.hk/eta/route-stop/${routeId}/${direction}/${stop.seq}`));
        minibusResponse = await axios.all(minibusResponse)
        for (let response of minibusResponse) {
            let arrivalTimes = []
            let etas = response.data.data.eta
            let stopId = response.data.data.stop_id
            for (let item of etas) {
                arrivalTimes.push(item.diff)
            }
            etaData.data.push({
                stopId: stopId,
                etas: arrivalTimes,
                note: (arrivalTimes.length == 0) ? 'N/A' : ''
            })
        }
        etaData.status = 'success'
        return etaData
    } catch (err) {
        console.error(err);
        etaData.status = 'failed'
        etaData.data = err;
        return etaData
    }
}

export async function fetchMtrEta(route) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const routeId = route.routeId;
        const direction = route.direction;
        let mtrResponse = route.stops.map(stop => axios(`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${routeId}&sta=${stop.code}`));
        mtrResponse = await axios.all(mtrResponse);
        let etaError = ''
        for (let response of mtrResponse) {
            let arrivalTimes = [];
            let stopCode = response.config.url.match(/sta\=.*$/)[0].replace('sta=', '')
            let etaArray = []
            if (response.data.error){
                etaError = response.data.error.errorMsg
            }
            else if (response.data.data) {
                etaArray = (direction == 1) ? response.data.data[`${routeId}-${stopCode}`]['DOWN'] : response.data.data[`${routeId}-${stopCode}`]['UP']
            }
            if (etaArray) {
                for (let item of etaArray) {
                    arrivalTimes.push(item.ttnt);
                }
            }
            arrivalTimes = arrivalTimes.slice(0, 3);
            etaData.data.push({
                stopId: stopCode,
                etas: arrivalTimes,
                note: (arrivalTimes.length == 0) ? 'N/A' : ''
            })
        }
        etaData.status = (etaError == '') ? 'success' : 'api-error'
        etaData.memo = etaError
        return etaData
    } catch (err) {
        console.error(err);
        etaData.status = 'failed'
        etaData.data = err;
        return etaData
    }
}
export async function fetchLightRailEta(route) {
    let etaData = {
        status: '',
        data: []
    }
    try {
        const routeNo = route.routeNo;
        const destEN = route.destEN;
        let lrResponse = route.stops.map(stop => axios(`https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${stop.stopId}`));
        lrResponse = await axios.all(lrResponse);
        for (let response of lrResponse){
            let routeLists = []
            let arrivalTimes = [];
            let stopId = response.config.url.match(/station\_id\=.*$/)[0].replace('station_id=', '');
            routeLists = response.data.platform_list.forEach(platform => {
                for (let item of platform.route_list){
                    routeLists = [...routeLists, ...item]
                }
            }) 
            routeLists = routeLists.filter(item => item.route_no == routeNo && item.dest_en == destEN);
            for (let item of routeLists){
                arrivalTimes.push(item.time_en.replace(' min', ''));
            }
            etaData.data.push({
                stopId: stopId,
                etas: arrivalTimes,
                note: (arrivalTimes.length == 0) ? 'N/A' : ''
            })
        }
        etaData.status = 'success';
        return etaData
    } catch (err) {
        console.error(err);
        etaData.status = 'failed'
        etaData.data = err;
        return etaData
    }
}
