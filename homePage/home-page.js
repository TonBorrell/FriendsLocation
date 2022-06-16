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

if (token == null) {
    window.location.href = '../loginPage/index.html'
}

getUser(token).then(response => {
    const username = response?.username || 'Test'
    userText.innerHTML = `Hola ${username}`
})

const locationList = document.getElementById('location-list')
getLocations(token).then(response => {
    console.log(response)
    for (let i in response) {
        locationList.innerHTML += '<div id="location">' + response[i].city + '</div>'
    }
})

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
addLocationButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (formAddLocation.innerHTML == '' || formAddLocation.innerHTML == '<div id="succesMsg">Location added!</div>') {
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
                    formAddLocation.innerHTML = '<div id="succesMsg">Location added!</div>'
                } 
            })
        } else {
            formAddLocation.innerHTML = ''
        }
    }
})