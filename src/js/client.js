import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

const ordersApiUrl = 'http://localhost:3000/orders'
const excursionsApiUrl = 'http://localhost:3000/excursions'

const excursionsApi = new ExcursionsAPI()

document.addEventListener('DOMContentLoaded', init)
const ulExcursionsList = document.querySelector('.panel__excursions')
const liPrototype = document.querySelector('.excursions__item--prototype')
const panelExc = document.querySelector('.panel__excursions')
const panelSummary = document.querySelector('.panel__summary')
const formOrder = document.querySelector('.panel__order')


document.querySelector('.order__total-price-value').innerText = '0 PLN'


function init() {
    console.log('DOM')
    loadExcursions()
    panelExc.addEventListener('submit', getOrderValues)
    panelSummary.addEventListener('click', deleteOrder)
    formOrder.addEventListener('submit', errorCheck )
}

function loadExcursions() {
    excursionsApi.loadData()
         .then(data => {
             insertExcursion(data)
             })
         .catch(err => console.error(err))
     }

     function insertExcursion(data) {
        data.forEach(item => {
            const newLiExcursion = createLi(item)
            ulExcursionsList.appendChild(newLiExcursion);
        })
        liPrototype.style.display = 'none'
    }
    
    function createLi(item) {
        const newLiExcursion = liPrototype.cloneNode(true)
        newLiExcursion.classList.remove('excursions__item--prototype')
        newLiExcursion.classList.add('excursions__item--new')
        

        const title = newLiExcursion.querySelector('.excursions__title');
        const description = newLiExcursion.querySelector('.excursions__description');
        const adultPrice = newLiExcursion.querySelector('.excursions__field-name--adultPrice');
        const childPrice = newLiExcursion.querySelector('.excursions__field-name--childPrice');

        newLiExcursion.dataset.id = item.id
        title.innerText = item.title;
        description.innerText = item.description;
        adultPrice.innerText = item.adultPrice;
        childPrice.innerText = item.childPrice;

        return newLiExcursion
    }

    let order = []

    function addOrder() { 
        resetOrder()
            order.forEach((item) => {
                const summaryPrototypeLi = document.querySelector('.summary__item--prototype')
                const newOrderItem =  summaryPrototypeLi.cloneNode(true)
                newOrderItem.classList.remove('summary__item--prototype')
                newOrderItem.classList.add('summary__item--chosen')

                const summaryName = newOrderItem.querySelector('.summary__name') 
                summaryName.innerText = item.title 

                const adultPriceText = `dorośli: ${item.adultsNumber} x ${item.adultPrice} PLN`
                const childPriceText = `,dzieci: ${item.childrenNumber} x ${item.childPrice} PLN`

                const summaryPrices = newOrderItem.querySelector('.summary__prices')
                summaryPrices.innerText = adultPriceText + childPriceText
                
                const sumPrice = priceCalculation(item.adultPrice, item.adultsNumber, item.childPrice, item.childrenNumber)
                const excursionPrice = newOrderItem.querySelector('.summary__total-price')
                excursionPrice.innerText = `${sumPrice} PLN`

                panelSummary.appendChild(newOrderItem)
            })
            setTotalPrice( updateTotalPrice() );
        } 


    function getOrderValues(e) {
        e.preventDefault();
        const adultsNumber = Number(e.target.elements.adultPrice.value);
        const childrenNumber = Number(e.target.elements.childPrice.value);

        if(Number.isNaN(adultsNumber) || Number.isNaN(childrenNumber)) {
            alert('Dane są niepoprawne. Proszę wpisać liczbę w zamówieniu!');
        } else if(adultsNumber === 0 && childrenNumber === 0) {
            alert('Należy wpisać ilość')
        } else {
            const title = e.target.parentElement.querySelector('.excursions__title').innerText
            const adultPrice = e.target.querySelector('[name="adultPrice"]').previousElementSibling.innerText
            const childPrice = e.target.querySelector('[name="childPrice"]').previousElementSibling.innerText

            addOrderItem(title, adultsNumber, adultPrice, childrenNumber, childPrice)
        }
    }

    function addOrderItem(title, adultsNumber, adultPrice, childrenNumber, childPrice) {
        order.push({title: title,  
            adultsNumber: adultsNumber,
            adultPrice: adultPrice,
            childrenNumber: childrenNumber,
            childPrice: childPrice})
            addOrder()
    }

    function priceCalculation(price1, qty1, price2, qty2) {
        const sumPrice = (parseFloat(price1) * parseFloat(qty1)) + (parseFloat(price2) * parseFloat(qty2))
        return sumPrice
    }

    function updateTotalPrice() {
        let totalPrice = 0;

        const priceTotalList = document.querySelectorAll('.summary__item--chosen .summary__total-price');
        priceTotalList.forEach(item => {
            totalPrice += parseInt(item.innerText);
        })
        return totalPrice;
    }
    function setTotalPrice(price) {
        const totalPriceSpan = document.querySelector('.order__total-price-value')
        totalPriceSpan.innerText = `${price} PLN`;
    }

    function deleteOrder(e) {
        e.preventDefault()
        if(e.target.className.includes('summary__btn-remove')) {
            e.target.parentElement.parentElement.remove()
        }
        setTotalPrice( updateTotalPrice() );
    }

    function resetOrder() {
        document.querySelectorAll('.summary__item--chosen').forEach(element => {
            if (element !==undefined){
                element.remove();
            }
        })
    }

    function sendOrder(e) {    
        const ordersTitle = []
       
        e.preventDefault() 
        const targetEl = e.target
        const currentElement = targetEl.parentElement
        const name = currentElement.querySelector('[name="name"]')
        const email = currentElement.querySelector('[name="email"]')
        const totalPrice = currentElement.querySelector('.order__total-price-value').innerText
        const orderList = currentElement.querySelectorAll('.summary__item--chosen')
        orderList.forEach(item => {
            ordersTitle.push({title: item.querySelector('.summary__name').innerText})

        const data = {
            name: name.value,
            email: email.value,
            totalPrice: totalPrice,
            title: ordersTitle
        }
        console.log(data)
        console.log(totalPrice)
        console.log(ordersTitle)

        excursionsApi.addOrder(data)
        .catch(err => console.error(err))
        .finally(() => loadExcursions())
        })
    }

    formOrder.noValidate = true    

    function errorCheck(e) {
        e.preventDefault()
        resetErrors() 
        const name = e.target.elements.name
        const email = e.target.elements.email 

        const errors = []

        if(name.value.length === 0) {
            errors.push(name)
        }

        if(email.value.length === 0 ||!email.value.includes('@'))  {
            errors.push(email)
        }

        if(errors.length === 0) {
            sendOrder(e)
            
            alert('Zamówienie zostało wysłane') 
            document.querySelector('.panel__order').reset()
            document.querySelectorAll('.summary__item--chosen').forEach(element => {
                element.remove();
            }); 
            setTotalPrice( updateTotalPrice() );
        
        } else {
            e.preventDefault();
            errors.forEach((error) => {
                error.style.border = '1px solid red'
                })
                const errorParagraph = document.createElement('p')
                errorParagraph.classList.add('order--error')
                errorParagraph.innerText = 'Proszę wypełnić poprawnie pole'
                formOrder.appendChild(errorParagraph)
        }
    }

    function resetErrors() {
        document.querySelectorAll('.order__field-input').forEach(element => {
        element.style.border = 'none';
        })
        document.querySelectorAll('.order--error').forEach(element => {
            element.remove();
        })
}

console.log('client');