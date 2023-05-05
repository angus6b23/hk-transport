import { fetchBuses, fetchMinibuses } from '@/fetch/fetchHKGovData.js';
import localforage from 'localforage';

async function loadData(key, forceReload = false, chunk = false, progressProxy = null){
    let data;
    if (chunk){
        // load chunked data
        // List keys from local forage first
        const keys = await localforage.keys();
        data = [];
        // Push items into data array
        for (const keyName of keys){
            if (keyName.indexOf(key) == 0) {
                const tempData = await localforage.getItem(keyName);
                data = [...data, ...tempData];
            }
        }
        // Sort by routeid then by routedirection
        data.sort((a,b) =>{
            if (a.routeId == b.routeId){
                return a.routeDirection - b.routeDirection
            }
            return a.routeId - b.routeId
        })
        // Return to undefined if chunked data is not loaded
        data = (data.length == 0) ? undefined : data;
    } else {
        data = await localforage.getItem(key);
    }
    if (!data || forceReload){ //If no data from localforage with the given key
        if (key == 'busData'){
            data = await fetchBuses(progressProxy);
        }
        else if (key == 'minibusData'){
            data = await fetchMinibuses(progressProxy);
        } else {
            return undefined
        }
        setData(key, data, chunk)
            .then(()=>data);
    }
    else { //Data found with given key
        return data;
    }
}

async function setData(key, value, chunk = false){
    if (chunk){
        saveChunk(key, value)
    } else {
        await localforage.setItem(key, value);
    }
}

async function saveChunk(key, value = []){
    let arrayLength = value.length;
    let chunkIndex = 0;
    while (arrayLength > 0){
        let keyName = key + '-chunk' + chunkIndex;
        // array.slice(start index, end index);
        let spliceArray = value.slice(chunkIndex * 100, chunkIndex * 100 + 100);
        arrayLength -= 100;
        chunkIndex++
        await localforage.setItem(keyName, spliceArray);
    }
}

export { loadData, setData }
