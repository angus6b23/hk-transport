import axios from 'axios'
import axiosRetry from 'axios-retry'
import localforage from 'localforage'
import sha256 from 'sha256'

axiosRetry(axios, { retry: 3 })

const fetchAPIData = async (
    baseURL = 'https://api.12a.app/hk-transport',
    el
) => {
    try {
        // Generate hashes from localForage
        let localHashes = {}
        let storageKeys = await localforage.keys()
        for (let key of storageKeys) {
            localHashes[key] = sha256(
                JSON.stringify(await localforage.getItem(key))
            )
        }
        // Get remote Hashes
        const { data: remoteHashes } = await axios(`${baseURL}/get-hash`)

        // Compare Hashes and generate
        const filesToDownload = []
        for (let keyName in remoteHashes) {
            if (
                !localHashes[keyName] ||
                localHashes[keyName] !== remoteHashes[keyName]
            ) {
                filesToDownload.push(keyName)
            }
        }
        const objSize = filesToDownload.length
        let current = 0
        const axiosPromises = filesToDownload.map((keyName) =>
            axios({
                method: 'get',
                baseURL: baseURL,
                url: `/chunked/${keyName}.json`,
            }).then(({ data }) => {
                current++
                emitEvent(el, current, objSize)
                return localforage.setItem(keyName, data)
            })
        )
        await Promise.all(axiosPromises)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}
const emitEvent = (el, current, objSize) => {
    const progress = document.querySelector('#loading-progress')
    if (progress) {
        progress.textContent = `${current}/${objSize}`
    }
    const data = { current: current, objSize: objSize }
    const event = new CustomEvent('downloadProgress', {
        detail: data,
    })
    if (el) {
        el.dispatchEvent(event)
    }
}
export default fetchAPIData
