import { fetchBuses, fetchMinibuses } from '@/fetch/fetchHKGovData.js'
import localforage from 'localforage'

/*
async function loadAllChunk(){
    return data = {
        bus: await loadChunk('bus'),
        minibus: await loadChunk('minibus'),
        ferry: await loadChunk('ferry'),
        mtr: await loadChunk('mtr'),
        tram: await loadChunk('tram'),
        lightRail: await loadChunk('light-rail')
    };
}
*/

async function loadChunk(type) {
    let data = []
    let keys = await localforage.keys()
    keys = keys.filter((key) => key.indexOf(type) == 0)
    for (let key of keys) {
        const keyData = await localforage.getItem(key)
        data = [...data, ...keyData]
    }
    return data
}

async function loadData(
    key,
    forceReload = false,
    chunk = false,
    progressProxy = null
) {
    let data
    if (chunk) {
        // load chunked data
        // List keys from local forage first
        const keys = await localforage.keys()
        data = []
        // Push items into data array
        for (const keyName of keys) {
            if (keyName.indexOf(key) == 0) {
                const tempData = await localforage.getItem(keyName)
                data = [...data, ...tempData]
            }
        }
        // Sort by routeid then by routedirection
        data.sort((a, b) => {
            if (a.routeId == b.routeId) {
                return a.routeDirection - b.routeDirection
            }
            return a.routeId - b.routeId
        })
        // Return to undefined if chunked data is not loaded
        data = data.length == 0 ? undefined : data
    } else {
        data = await localforage.getItem(key)
    }
    if (!data || forceReload) {
        //If no data from localforage with the given key
        if (key == 'busData') {
            data = await fetchBuses(progressProxy)
        } else if (key == 'minibusData') {
            data = await fetchMinibuses(progressProxy)
        } else {
            return undefined
        }
        setData(key, data, chunk).then(() => data)
    } else {
        //Data found with given key
        return data
    }
}

async function setData(key, value, chunk = false) {
    if (chunk) {
        saveChunk(key, value)
    } else {
        await localforage.setItem(key, value)
    }
}

async function saveChunk(key, value, chunkSize = 50) {
    let chunkCounter = 0
    for (let i = 0; i < value.length; i += 50) {
        let keyName = `${key}-chunk${chunkCounter}`
        let slicedArray = value.slice(i, i + 50)
        await localforage.setItem(keyName, slicedArray)
        chunkCounter += 1
    }
    // Old Working code
    // let arrayLength = value.length;
    // let chunkIndex = 0;
    // while (arrayLength > 0){
    //     let keyName = key + '-chunk' + chunkIndex;
    //     // array.slice(start index, end index);
    //     let spliceArray = value.slice(chunkIndex * 50, chunkIndex * 50 + 50);
    //     arrayLength -= 50;
    //     chunkIndex++
    //     await localforage.setItem(keyName, spliceArray);
    // }
}

export { loadData, setData, loadChunk }
