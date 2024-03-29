const userText = document.getElementById('name-header')
const token = localStorage.getItem('token')
const logoutButton = document.getElementById('logout-button')
const addLocationButton = document.getElementById('add-location-button')

async function getUser(token) {
    let response = await fetch(`http://127.0.0.1:5000/getuser/${token}`, {
        method: 'GET'
    })
    responseJson = await response.json()
    return responseJson
}

async function getLocations(token) {
    let response = await fetch(`http://127.0.0.1:5000/getlocations/${token}`, {
        method: 'GET'
    })
    responseJson = await response.json()
    return responseJson
}

async function addLocation(country, city, street) {
    let response = await fetch('http://127.0.0.1:5000/locations', {
        method: 'POST', body: JSON.stringify({ userId: token, friend: 'Ton', country: country, city: city, street: street })
    })
    responseJson = await response.json()
    return responseJson
}

// Reset locations list after location is added
async function addNewLocations(token) {
    getLocations(token).then(response => {
        console.log(response)
        locationList.innerHTML = ''
        for (let i in response) {
            locationList.innerHTML += `<div id="location-${response[i].locationId}" class="location">` + response[i].city + '</div>'
        }
    })
}

function reloadPage() {
    addNewLocations(token)
    formAddLocation.innerHTML = '<div id="succesMsg">Location Added!</div>'
}

if (token == null) {
    window.location.href = '../loginPage/index.html'
}

getUser(token).then(response => {
    const username = response?.username || 'Test'
    userText.innerHTML = `Hola ${username}`
})

// Create Location list after login
const locationList = document.getElementById('location-list')
addNewLocations(token)

//Logout if button is clicked
logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    window.location.href = '../loginPage/index.html'
})

//Logout if localStorage is removed manually
window.addEventListener('storage', () => {
    if (localStorage.getItem('token') === null) {
        window.location.href = '../loginPage/index.html'
    }
})

const formAddLocation = document.getElementById('add-location-form')
const addNewLocationButton = document.getElementById('add-location-button')
addLocationButton.addEventListener('click', (e) => {
    e.preventDefault()
    addNewLocationButton.style.marginBottom = '20px'
    if (formAddLocation.innerHTML == '' || formAddLocation.innerHTML == '<div id="succesMsg">Location Added!</div>') {
        formAddLocation.innerHTML = '<input type="text" name="country" id="country-field" class="add-location-form-field" placeholder="Country">'
        formAddLocation.innerHTML += '<input type="text" name="city" id="city-field" class="add-location-form-field" placeholder="City">'
        formAddLocation.innerHTML += '<input type="text" name="street" id="street-field" class="add-location-form-field" placeholder="Street">'
    } else {
        const country = formAddLocation.country.value;
        const city = formAddLocation.city.value;
        const street = formAddLocation.street.value;
        if (country != '' && city != '' && street != '') {
            addLocation(country, city, street).then(response => {
                if (response.ok) {
                    formAddLocation.innerHTML = '<div id="succesMsg">Adding Location...</div>'
                    addNewLocationButton.style.marginBottom = '0px'
                    setTimeout(reloadPage, 1000)
                }
            })
        } else {
            formAddLocation.innerHTML = ''
        }
    }
})