import axios from 'axios'
import axiosRetry from 'axios-retry'
import localforage from 'localforage'
import sha256 from 'sha256'

axiosRetry(axios, { retry: 3 });

const fetchAPIData = async (baseURL = 'http://127.0.0.1:5000/hk-transport') => {
	try{
		// Generate hashes from localForage
		let localHashes = {}
		let storageKeys = await localforage.keys();
		for (let key of storageKeys){
			localHashes[key] = sha256(JSON.stringify(await localforage.getItem(key)));
		}
		// Get remote Hashes
		const { data: remoteHashes} = await axios(`${baseURL}/get-hash`);
		// Compare Hashes and generate
		for (let keyName in remoteHashes){
			if (!localHashes[keyName] || localHashes[keyName] !== remoteHashes[keyName]){
				const { data: remoteData } = await axios(`${baseURL}/chunked/${keyName}.json`)
				await localforage.setItem(keyName, remoteData);
			}
		}
		return true
	} catch (err){
		console.error(err);
		return false;
	}
}

export default fetchAPIData