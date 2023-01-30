import axios from 'axios';

export async function fetchBusStopID(route){
    const stopIdData = {
        status: '',
        data: []
    };
    const company = 
    (route.company.includes('CTB')) ? 'CTB' :
    (route.company.includes('NWFB')) ? 'NWFB' : null;
    const direction = (route.routeDirection == 1) ? 'outbound' : 'inbound'; //Direction 1 = outbound, 2 = inbound
    if (!company){
        stopIdData.status = 'unknown_company';
        return stopIdData;
    }
    try{
        const stopResponse = await axios(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${company}/${route.routeNo}/${direction}`);
        stopIdData.data = stopResponse.data.data;
        stopIdData.status = 'success';
        return stopIdData
    } catch(err){
        stopIdData.status = 'error';
        stopIdData.data = err;
        return stopIdData
    }

}