import axios from 'axios'
import axiosRetry from 'axios-retry'
import localforage from 'localforage'
import sha256 from 'sha256'

axiosRetry(axios, { retry: 3 });

const fetchAPIData = async (baseURL = 'https://api.12a.app/hk-transport', el) => {
	try{
		// Generate hashes from localForage
		let localHashes = {}
		let storageKeys = await localforage.keys();
		for (let key of storageKeys){
			localHashes[key] = sha256(JSON.stringify(await localforage.getItem(key)));
		}
		// Get remote Hashes
		const { data: remoteHashes} = await axios(`${baseURL}/get-hash`);
		let objSize = Object.keys(remoteHashes).length;
		let current = 0
		// Compare Hashes and generate
		for (let keyName in remoteHashes){
			const progress = document.querySelector('#loading-progress')
			if (progress){
				progress.textContent = `${current}/${objSize}`
			}
			if (el){
				const data = { current: current, objSize: objSize}
				const event = new CustomEvent('downloadProgress', { 'detail': data });
				el.dispatchEvent(event);
			}
			if (!localHashes[keyName] || localHashes[keyName] !== remoteHashes[keyName]){
				const { data: remoteData } = await axios(`${baseURL}/chunked/${keyName}.json`)

				await localforage.setItem(keyName, remoteData);
			}
			current++
		}
		return true
	} catch (err){
		console.error(err);
		return false;
	}
}

export default fetchAPIData
