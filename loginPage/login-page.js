const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const loginSuccessMsg = document.getElementById('login-success-msg');
const signinButton = document.getElementById('signup-form-submit');

async function fetchLogin(username, password) {
    let response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST', body: JSON.stringify({ username: username, password: password })
    })
    responseJson = await response.json()
    console.log(response.ok)

    return { response, responseJson }
}

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    fetchLogin(username, password).then(response => {
        if (response.response.ok) {
            loginErrorMsg.style.opacity = 0;
            loginSuccessMsg.style.opacity = 1;
            const token = response.responseJson.token
            console.log(token)
            localStorage.setItem('token', token)
            window.location.href = 'home-page.html'
        } else {
            loginSuccessMsg.style.opacity = 0;
            loginErrorMsg.style.opacity = 1;
        }
    })
})

signinButton.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = 'signup-page.html'
})