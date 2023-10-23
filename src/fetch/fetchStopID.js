import axios from 'axios'

export async function fetchBusStopID(route) {
    const stopIdData = {
        status: '',
        data: [],
    }
    const company = route.company.includes('CTB')
        ? 'CTB'
        : route.company.includes('NWFB')
        ? 'NWFB'
        : null
    const direction = route.routeDirection == 1 ? 'outbound' : 'inbound' //Direction 1 = outbound, 2 = inbound
    if (!company) {
        stopIdData.status = 'unknown_company'
        return stopIdData
    }
    try {
        const stopResponse = await axios(
            `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${company}/${route.routeNo}/${direction}`
        )
        stopIdData.data = stopResponse.data.data
        stopIdData.status = 'success'
        return stopIdData
    } catch (err) {
        stopIdData.status = 'error'
        stopIdData.data = err
        return stopIdData
    }
}

export async function reconstructBusStops(stopData) {
    const returnData = {
        status: '',
        data: [],
    }
    try {
        let urlArray = []
        urlArray = stopData.data.map((stop) => [
            ...urlArray,
            `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/stop/${stop.stop}`,
        ])
        const requests = urlArray.map((url) => axios.get(url))
        const responses = await axios.all(requests)
        for (let i = 0; i < responses.length; i++) {
            const response = responses[i]
            const stop = stopData.data[i]
            const newStop = {
                nameTC: response.data.data.name_tc,
                nameEN: response.data.data.name_en,
                id: stop.stop,
                seq: stop.seq,
                coord: [response.data.data.long, response.data.data.lat],
                etas: [],
                etaMessage: '',
                stopId: stop.stop,
            }
            returnData.data.push(newStop)
        }
        returnData.status = 'success'
        return returnData
        // try change https://www.storyblok.com/tp/how-to-send-multiple-requests-using-axios
        // for (stop of stopData.data) {
        //     const response = await axios(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/stop/${stop.stop}`);
        //     const newStop = {
        //         nameTC: response.data.data.name_tc,
        //         nameEN: response.data.data.name_en,
        //         id: stop.stop,
        //         seq: stop.seq,
        //         coord: [response.data.data.long, response.data.data.lat],
        //         etas: [],
        //         etaMessage: '',
        //         stopId: stop.stop
        //     }
        //     returnData.data.push(newStop);
        // }
        // returnData.status = 'success';
        // return returnData;
    } catch (err) {
        console.error(err)
        returnData.status = 'Error' + err
        return returnData
    }
}
