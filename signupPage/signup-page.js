const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup-form-submit");
const loginButton = document.getElementById('login-form-submit')
const signupErrorMsg = document.getElementById('signup-error-msg')
const signupSuccessMsg = document.getElementById('signup-success-msg')

async function fetchSignup(username, password) {
    let response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST', body: JSON.stringify({ username: username, password: password })
    })
    responseJson = await response.json()
    console.log(response.ok)

    return { response, responseJson }
}

async function isUserExisting(username) {
    let response = await fetch('http://127.0.0.1:5000/user/exist', {
        method: 'POST', body: JSON.stringify({username: username})
    })
    responseJson = await response.json()
    console.log(response.ok)

    return {response, responseJson}
}

signupButton.addEventListener('click', (e) => {
    e.preventDefault()
    const username = signupForm.username.value
    const password = signupForm.password.value
    const confirmPassword = signupForm.confirmPassword.value
    console.log(username)
    if (password != confirmPassword || !password || !confirmPassword) {
        signupErrorMsg.innerHTML = 'Passwords not Coincident'
        signupErrorMsg.style.opacity = 1
        signupSuccessMsg.style.opacity = 0
    } else {
        isUserExisting(username).then(response => {
            if (!response.response.ok) {
                signupErrorMsg.innerHTML = response.responseJson.error
                signupErrorMsg.style.opacity = 1
                signupSuccessMsg.style.opacity = 0
            } else {
                fetchSignup(username, password).then(response => {
                    if (response.response.ok) {
                        signupErrorMsg.style.opacity = 0
                        signupSuccessMsg.style.opacity = 1
                    }
                })
            }
        })
    }
})

loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = '../loginPage/index.html'
})