import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const excursionsApi = new ExcursionsAPI()

const excursionsApiUrl = 'http://localhost:3000/excursions'

const ulExcursionsList = document.querySelector('.panel__excursions')
const liPrototype = document.querySelector('.excursions__item--prototype')

document.addEventListener('DOMContentLoaded', init)


function init() {
    console.log('DOM')
    loadExcurcions()
    addExcursion()
    removeExcursion()
    updateExcursion()
}

function loadExcurcions() {
   excursionsApi.loadData()
        .then(data => {
            insertExcursion(data)
            })
        .catch(err => console.error(err))
    }


function insertExcursion(data) {
    console.log(data)
    resetExcursionList()

    data.forEach(item => {
        const newLiExcursion = createLi(item)
        ulExcursionsList.appendChild(newLiExcursion);
    })
    liPrototype.style.display = 'none'
}

function resetExcursionList() {
    document.querySelectorAll('.excursions__item--new').forEach(element => {
        if (element !==undefined){
            element.remove();
        }
    })
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
    

function addExcursion() {
    const formAdd = document.querySelector('.form--addExc')

    formAdd.addEventListener('submit', (e) => {
        e.preventDefault()
      
        const {title, description, adultPrice, childPrice} = e.target.elements
        const data = {
            title: title.value,
            description: description.value,
            adultPrice: adultPrice.value,
            childPrice: childPrice.value
        }
        excursionsApi.addData(data)
            .catch(err => console.error(err))
            .finally(() => loadExcurcions())
    })
}

 const panelExcursions = document.querySelector('.panel__excursions')

 function removeExcursion() {
    panelExcursions.addEventListener('click', (e) => {
    e.preventDefault()

    const targetEl = e.target

     if(targetEl.className.includes('excursions__field-input--remove')) {
         const currentElement = targetEl.parentElement.parentElement.parentElement
         const id = currentElement.dataset.id;

         excursionsApi.removeData(id)
            .catch(err => console.error(err))
            .finally(() => loadExcurcions())
            }
     })
}

function updateExcursion() {
    panelExcursions.addEventListener('click', (e) => {
        e.preventDefault()

        const targetEl = e.target
        if(targetEl.className.includes('excursions__field-input--update')) {
            const currentElement = targetEl.parentElement.parentElement.parentElement
           
           const spanList = currentElement.querySelectorAll('.edit')
           const isEditable = [...spanList].every(span => span.isContentEditable)

           if(isEditable) {
                const id = currentElement.dataset.id;
                const data = {
                    title: spanList[0].innerText,
                    description:  spanList[1].innerText,
                    adultPrice:  spanList[2].innerText,
                    childPrice:  spanList[3].innerText
                     }

            excursionsApi.updateData(id, data)
                .catch(err => console.error(err))
                .finally( () => { 
                    targetEl.value = 'edytuj';
                    spanList.forEach((span) => {
                        // span.style.border = 'none';
                        span.contentEditable  = false
                        span.classList.remove('edit--active')
                        })
                    });
            } else {
                targetEl.value = 'zapisz';
                spanList.forEach((span) => { 
                    span.contentEditable = true;
                    span.classList.add('edit--active')
                    // span.style.border = '1px dotted black'
                })
            }
         }
    
    })
}

console.log('admin');