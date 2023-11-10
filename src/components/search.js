export const filterData = (data, type, query, lang, maxLength = 20) => {
    let resArr = []
    if (type === 'ferry') {
        resArr = data.filter(
            (item) =>
                item.direction === 1 &&
                (item.routeNameTC.includes(query) ||
                    item.routeNameEN
                        .toLowerCase()
                        .includes(query.toLowerCase()))
        )
    } else if (lang === 'zh' && query < 10) {
        resArr = data.filter(
            (item) =>
                (item.routeNo.length <= 2 &&
                    item.routeNo.indexOf(query.toUpperCase()) === 0) ||
                item.destTC.includes(query)
        )
    } else if (lang === 'zh') {
        resArr = data.filter(
            (item) =>
                item.routeNo.indexOf(query.toUpperCase()) === 0 ||
                item.destTC.toLowerCase().includes(query.toLowerCase())
        )
    } else if (lang === 'en' && query < 10) {
        resArr = data.filter(
            (item) =>
                (item.routeNo.length <= 2 &&
                    item.routeNo.indexOf(query.toUpperCase()) === 0) ||
                item.destEN.includes(query)
        )
    } else if (lang === 'en') {
        resArr = data.filter(
            (item) =>
                item.routeNo.indexOf(query.toUpperCase()) === 0 ||
                item.destEN.toLowerCase().includes(query.toLowerCase())
        )
    }
    // Sort the results by routeNo
    resArr = resArr.sort(function (a, b) {
        a = Number(a.routeNo.replace(/[A-Z]/g, 0))
        b = Number(b.routeNo.replace(/[A-Z]/g, 0))
        return a - b
    })
    return resArr.slice(0, maxLength) // Only show first n results
}

export const getKeypadList = (data) => {
    const newSet = new Set(
        data.map((route) => route.routeNo).filter((no) => no.length <= 5)
    )
    return Array.from(newSet)
}

export const getKeypadLetter = (list) => {
    const regex = /([A-Za-z])/g
    const letters = new Set()
    for (let routeNo of list) {
        if (routeNo.match(regex)) {
            routeNo.match(regex).forEach((val) => letters.add(val))
        }
    }
    return Array.from(letters)
        .sort()
        .map((letter) => {
            return { letter: letter, enable: false }
        })
}

export const updateButtonState = (list, query) => {
    const candidateList = list.filter(
        (no) => no.indexOf(query) === 0 && no.length > query.length
    )
    let letterSet = new Set()
    let numberState = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
    }
    for (let no of candidateList) {
        let nextChar = no[query.length]
        if (nextChar.match(/\d/)) {
            numberState[nextChar] = true
        } else {
            letterSet.add(nextChar)
        }
    }
    const letterState = Array.from(letterSet)
        .sort((a, b) => a.localeCompare(b))
        .map((item) => {
            return { letter: item, enabled: true }
        })
    return {
        numberState: numberState,
        letterState: letterState,
    }
}
