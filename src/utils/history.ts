import lodash from 'lodash'

type HistoryNow = { version: number; data: Record<string, unknown>; selected: string };
type HistoryCache = { data: HistoryNow[]; head: number; version: number };

function getPrevious(hh: HistoryCache) {
    if (hh.head > 0) {
        return {...hh.data[hh.head - 1]}
    } else {
        return null
    }
}

function getNext(hh: HistoryCache) {
    if (hh.head < hh.data.length - 1) {
        return {...hh.data[hh.head + 1]}
    } else {
        return null
    }
}

class History {
    cacheTimer: ReturnType<typeof setTimeout> | null = null
    updateTimer: ReturnType<typeof setTimeout> | null = null
    now: HistoryNow | null = null
    _previous: HistoryNow | null = null
    _next: HistoryNow | null = null
    his: HistoryCache | null = null
    catchUpdate = true

    constructor() {
        let his = localStorage.getItem('history')
        let hh: HistoryCache = {data: [{version: 2, data: {default: {}}, selected: 'default'}], head: 0, version: 1}
        if (his) {
            hh = JSON.parse(his)
        } else {
            his = localStorage.getItem('data')
            if (his) {
                hh.data[0] = JSON.parse(his)
            } else {
                hh.data[0] = {version: 2, data: {default: {}}, selected: 'default'}
            }
            localStorage.setItem('history', JSON.stringify(hh))
        }
        this.now = hh.data[hh.head]
        this._previous = getPrevious(hh)
        this._next = getNext(hh)
    }

    save() {
        if (this.cacheTimer) {
            clearTimeout(this.cacheTimer)
        }
        this.cacheTimer = setTimeout(()=>{
            if (!this.his) {
                return
            }
            if (this.his.head > 50) {
                this.his.data = this.his.data.slice(this.his.head - 50)
                this.his.head = 50
            }
            if (this.his.head < this.his.data.length - 20) {
                this.his.data = this.his.data.slice(0, this.his.head + 20)
            }
            localStorage.setItem('history', JSON.stringify(this.his))
            this.his = null
        }, 2000)
    }

    read() {
        if(!this.his) {
            const historyText = localStorage.getItem('history')
            if (historyText) {
                this.his = JSON.parse(historyText) as HistoryCache
            }
        }
    }

    get() {
        if (this.catchUpdate) {
            return {now: this.now, couldNext: this._next !== null, couldPrevious: this._previous !== null}
        } else {
            return {now: this.now, couldNext: false, couldPrevious: false}
        }
    }

    reset(data: HistoryNow) {
        this._previous = null
        this._next = null
        this.his = {data: [data], head: 0, version: 1}
        this.save()
        return this.get()
    }

    next() {
        if (this._next && this.his) {
            this._previous = this.now
            this.now = this._next
            this.read()
            this.his.head++
            this._next = getNext(this.his)
            this.save()
        }
        return this.get()
    }

    previous() {
        if (this._previous && this.his) {
            this._next = this.now
            this.now = this._previous
            this.read()
            this.his.head--
            this._previous = getPrevious(this.his)
            this.save()
        }
        return this.get()
    }

    cancelUpdate() {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer)
        }
    }

    update(data: HistoryNow) {
        if (!this.catchUpdate) {
            return
        }
        if (this.updateTimer) {
            clearTimeout(this.updateTimer)
        }
        this.updateTimer = setTimeout(()=>{
            if (!lodash.isEqual(data, this.now) && this.his) {
                this._previous = this.now
                this.now = data
                this.read()
                this.his.data = this.his.data.slice(0, this.his.head+1)
                this.his.data.push(data)
                this.his.head++
                this._next = null
                this.save()
            }
        }, 500)
    }
}

export default History
