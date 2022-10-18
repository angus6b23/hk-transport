export async function fetch_kmb(){
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
        let stop_array = kmb_route_stop_json.data.filter(x => x.route == kmb.route[i].route && x.bound == kmb.route[i].bound)
        stop_array.sort((a,b) => a.seq - b.seq);
        kmb.route[i].stop = stop_array.map(y => y.stop);
    }
    return kmb
}
