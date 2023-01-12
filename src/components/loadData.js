import { fetchBuses, fetchMinibuses } from '@/components/fetchData.js';
import localforage from 'localforage';

async function loadData(key, firstTime = false, forceReload = false){
    let data = await localforage.getItem(key);
    if (!data || forceReload){ //If not data for given key
        if (key == 'busData'){
            data = await fetchBuses();
        }
        else if (key == 'minibusData'){
            data = await fetchMinibuses();
        } else {
            return undefined
        }
        localforage.setItem(key, data)
        .then(()=>data);
    }
    else { //Data found for given key
        return data;
    }
}

async function setData(key, value){
    await localforage.setItem(key, value);
}

export { loadData, setData }
