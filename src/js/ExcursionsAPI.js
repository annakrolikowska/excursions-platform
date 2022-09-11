class ExcursionsAPI {
    constructor() {
        this.excursionsApiUrl = 'http://localhost:3000/excursions'
        this.ordersApiUrl = 'http://localhost:3000/orders'
    }

    loadData() {
        return fetch(this.excursionsApiUrl)
            .then((resp) => {
                if(resp.ok) { return resp.json(); }
                return Promise.reject(resp)
            })
        }

    addData(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return fetch(this.excursionsApiUrl, options)
                .then((resp) => console.log(resp))
    }

    removeData(id) {
        const options = {method: 'DELETE'}
        return fetch(`${this.excursionsApiUrl}/${id}`, options)
            .then((resp) => console.log(resp))
    }

    updateData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-type' : 'application/json'}
        }
        return fetch(`${this.excursionsApiUrl}/${id}`, options)
            .then((resp) => console.log(resp))
    }

    addOrder(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return fetch(this.ordersApiUrl, options)
                .then((resp) => console.log(resp))
    }
 }


export default ExcursionsAPI;