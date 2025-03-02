<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
import { use } from 'marked';

var UsersList = ref("");
var pswdStatus = ref(null);
var User = ref("");
var Password = ref("");
var SignUp = ref(null);
const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value["path"]);

let listaCorsi = ["Informatica", "Informatica per il management", "Ingegneria informatica", "Ingegneria elettronica", "Economia", "Storia", "Matematica"];
const corsi = listaCorsi.sort();


let UserEx = [
    {
        name: "Alessandro",
        username: "ale",
        password: "suca",
        surname: "Roncaglia",
        email: "aleron04@gmail.com",
        course: "informatica",
    },
    {
        name: "Nicola",
        username: "nico",
        password: "chiara",
        surname: "Travaglini",
        email: "nicotra@gmail.com",
        course: "informatica",
    },
    {
        name: "admin",
        username: "admin",
        password: "admin",
        surname: "admin",
        email: "admin",
        course: "informatica",
    }
];

function resetValues(){
    User.value= "";
    Password.value= "";
}

async function validateForm() {
    //appena Trava mette a posto le credenziali usa i ref nei controlli per il login
    /*
    await fetch("http://localhost:5173/users")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        UsersList.value = data;
    });*/

    // faccio i controlli prima per vedere se l'utente esiste poi per vedere se la password è corretta
    /*
    if(UsersList.value.find((user) => user.email === User.value)){
        console.log(UsersList.value.find((user) => user.email === User.value).name);
        let Usr=UsersList.value.find((user) => user.email === User.value);
        if(Usr.password === Password.value){
            console.log("Login effettuato");
            router.push("/home");
        }
        else{
            alert("Username o password errati");
        }
    }
    else{
        alert("Utente non trovato");
    }*/
    if(UserEx.find((user) => user.email === User.value)){
        console.log(UserEx.find((user) => user.email === User.value).name);
        let Usr=UserEx.find((user) => user.email === User.value);
        if(Usr.password == Password.value){
            console.log("Login effettuato");
            router.push("/home");
        }
        else{
            alert("Username o password errati");
        }
    }
    else{
        alert("Utente non trovato");
    }
}
//NOTE: fare i controlli non con variabili locali ma con i ref.
async function addUser() {
    let name = document.forms["signup"]["name"].value;
    let surname = document.forms["signup"]["surname"].value;
    let username = document.forms["signup"]["username"].value;
    let course = document.getElementById("corsi").selectedIndex;
    let y = document.getElementById("corsi").options;
    let pswd = document.forms["signup"]["password"].value;
    let confirmPswd = document.forms["signup"]["confirmPswd"].value;
    if (pswd === confirmPswd) {
        await fetch("http://localhost:5173/users")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                UsersList.value = data;
            });

        if(UsersList.value.find((user) => user.email === username)){
            alert("Utente già esistente");
            document.getElementById("username").value = "";
            return;
        }
        else{
            fetch("http://localhost:5173/CreateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    password: pswd,
                    surname: surname,
                    email: username,
                    course: y[course].text,
                }),
            });
            console.log("Utente aggiunto");
            console.log(UserEx[UserEx.length - 1]);
            router.push('/login');
        }     
    } else {
        alert("Le password non coincidono");
    }
}


function seePswd() {

    if(pswdStatus === false){
        pswdStatus = true;
        document.getElementById("see").style.display = "block";
        document.getElementById("notsee").style.display = "none";
    }
    else{
        pswdStatus = false;
        document.getElementById("see").style.display = "none";
        document.getElementById("notsee").style.display = "block";
    }

    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function cseePswd() {
    let status=document.getElementById("csee").style.display;
    if(status === "none"){
        document.getElementById("csee").style.display = "block";
        document.getElementById("cnotsee").style.display = "none";
    }
    else{
        document.getElementById("csee").style.display = "none";
        document.getElementById("cnotsee").style.display = "block";
    }

    var x = document.getElementById("confirmPswd");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

</script>


<template>
    <section class="h-100 gradient-form" style="background-color: #eee">
        <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-xl-10">
            <div
                class="card rounded-3 text-black"
                style="background-color: rgba(251, 173, 173, 1)"
            >
                <div class="row g-0">
                <div class="col-lg-6">
                    <div class="card-body p-md-5 mx-md-4">
                    <div class="text-center">
                        <img
                        src="@/assets/UniboLogo.png"
                        style="width: 185px"
                        alt="logo"
                        />
                    </div>

                    <form name="login" v-if="!SignUp" action="validateForm" class="novalidate">
                        <p>Please login to your account</p>

                        <div data-mdb-input-init class="form-outline mb-4">
                        <label class="form-label" for="username">Username</label>
                        <input type="email" id="username" v-model="User" class="form-control" placeholder="Phone number or email address" name="username" required/>
                        <div class="invalid-feedback">
                            Please enter a valid email address.
                        </div>
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                        <label class="form-label" for="password">Password</label>
                        <div class="input-group">
                        <input
                            type="password"
                            id="password"
                            class="form-control"
                            name="password"
                            v-model="Password"
                            required
                        />
                        <div class="input-group-text">
                                <svg style="display:none;" xmlns="http://www.w3.org/2000/svg" id="see" @click="seePswd" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                </svg>
                                <svg  xmlns="http://www.w3.org/2000/svg" id="notsee" @click="seePswd" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                </svg>
                            </div>
                        <div class="invalid-feedback">
                            Please enter a password.
                        </div>
                        </div>
                        </div>

                        <div class="text-center pt-1 mb-5 pb-1">
                        <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                            type="submit"
                            @click.prevent="validateForm"
                        >
                            Log in
                        </button>
                        
                        </div>

                        <div
                        class="d-flex align-items-center justify-content-center pb-4"
                        >
                        <p class="mb-0 me-2">Don't have an account?</p>
                        
                            <button
                            type="button"
                            data-mdb-button-init
                            data-mdb-ripple-init
                            class="btn btn-outline-danger"
                            @click="SignUp = true; resetValues()"
                            >
                            Create new
                            </button>
                        
                        </div>
                    </form>
                    <form name="signup" v-if="SignUp" class="was-validated" onsubmit="addUser">
                        <p>Create your account</p>

                        <div data-mdb-input-init class="form-outline mb-1">
                        <label class="form-label" for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            class="form-control"
                            name="name"
                            required
                        />
                        <div class="invalid-feedback">Please choose a name.</div>
                        </div>

                        <div data-mdb-input-init class="form-outline mb-1">
                        <label class="form-label" for="surname">Surname</label>
                        <input
                            type="text"
                            id="surname"
                            class="form-control"
                            name="surname"
                            required
                        />
                        <div class="invalid-feedback">
                            Please choose a surname.
                        </div>
                        </div>

                        <div data-mdb-input-init class="form-outline mb-1">
                        <label class="form-label" for="form2Example11"
                            >Username</label
                        >
                        <input
                            type="text"
                            id="username"
                            class="form-control"
                            placeholder="Email address"
                            name="username"
                            required
                        />
                        <div class="invalid-feedback">
                            Please choose a username.
                        </div>
                        </div>

                        <label class="form-label" for="corsi">Programme</label> <!-- corso di studi -->
                        <select class="form-select mb-1" aria-label="Programme" id="corsi" required>
                            
                            
                            <option selected disabled id="choose">Choose...</option>
                            <option v-for="corso in corsi" class="text-black">
                                {{ corso }}
                            </option>
                        </select>
                        <div class="invalid-feedback">
                        Please choose a programme.
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                        <label class="form-label" for="password">Password</label>
                        <div class="input-group">
                            <input type="password" id="password" class="form-control" required/>
                            
                            <div class="input-group-text">
                                <svg style="display:none;" xmlns="http://www.w3.org/2000/svg" id="see" @click="seePswd" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" id="notsee" @click="seePswd" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                </svg>
                            </div>
                            <div class="invalid-feedback">
                            Please choose a password.
                            </div>
                        </div>
                        
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                        <label class="form-label" for="confirmPswd"
                            >Confirm password</label
                        >
                        <div class="input-group">
                            <input
                                type="password"
                                id="confirmPswd"
                                class="form-control"
                                required
                            />
                            <div class="input-group-text">
                                <svg style="display:none;" xmlns="http://www.w3.org/2000/svg" id="csee" @click="cseePswd" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                </svg>
                                <svg  xmlns="http://www.w3.org/2000/svg" id="cnotsee" @click="cseePswd" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                </svg>
                            </div>
                            <div class="invalid-feedback">
                            Please confirm your password.
                            </div>
                        </div>
                        
                        </div>

                        <div class="text-center pt-1 mb-5 pb-1">
                        <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            class="btn btn-danger btn-block fa-lg gradient-custom-2 mb-3"
                            type="submit"
                            @click.prevent="addUser"
                        >
                            Sign up
                        </button>
                        </div>

                        <div
                        class="d-flex align-items-center justify-content-center pb-4"
                        >
                        <p class="mb-0 me-2">You already have an account?</p>
                            <button
                            type="button"
                            data-mdb-button-init
                            data-mdb-ripple-init
                            class="btn btn-outline-primary"
                            @click="SignUp = false"
                            >
                            Log in
                            </button>
                        
                        </div>
                    </form>
                    </div>
                </div>
                <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div class="text-black px-3 py-4 p-md-5 mx-md-4">
                    <h1 class="mb-4">SELFIE</h1>
                    <h3 class="mb-4">
                        Studying and Enjoying Life with Friends In Education
                    </h3>
                    <p class="small mb-0">
                        Welcome to Selfie here you will be able to:
                        <ul>
                            <li>
                                Use our fantastic calendar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/></svg>
                            </li>
                            <li>Organize your study sessions and use the Pomodoro Timer</li>
                            <li>Write and share notes with your friends</li>
                        </ul> 
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </section>
</template>


<style scoped>

</style>