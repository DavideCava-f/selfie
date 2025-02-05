<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value["path"]);

const corsi = ["informatica", "elettronica", "informatica per il management"];

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
];

function validateForm() {
  let username = document.forms["login"]["username"].value;
  let pswd = document.forms["login"]["password"].value;
  let i = 0;
  let found = false;
  while (!found && i < UserEx.length) {
    if (
      (username === UserEx[i].username || username === UserEx[i].email) &&
      pswd === UserEx[i].password
    ) {
      console.log("Login effettuato");
      found = true;
    }
    i++;
  }

  if (!found) {
    alert("Username o password errati");
  } else {
    router.push("/home");
  }
}

function addUser() {
  let name = document.forms["signup"]["name"].value;
  let surname = document.forms["signup"]["surname"].value;
  let username = document.forms["signup"]["username"].value;
  let course = document.getElementById("corsi").selectedIndex;
  let y = document.getElementById("corsi").options;
  let pswd = document.forms["signup"]["pswd"].value;
  let confirmPswd = document.forms["signup"]["confirmPswd"].value;
  if (pswd === confirmPswd) {
    fetch("http://localhost:5173/CreateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: pswd,
        surname: surname,
        email: username,
        course: y[course].text,
      }),
    });
    /*
        UserEx.push({
            name: name,
            username: username,
            password: pswd,
            surname: surname,
            email: username,
            course: y[course].text
        });
        */
    console.log("Utente aggiunto");
    console.log(UserEx[UserEx.length - 1]);
    //router.push('/login');
  } else {
    alert("Le password non coincidono");
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

                  <form
                    name="login"
                    v-if="currentRoute === '/login'"
                    onsubmit="validateForm()"
                  >
                    <p>Please login to your account</p>

                    <div data-mdb-input-init class="form-outline mb-4">
                      <label class="form-label" for="username">Username</label>
                      <input
                        type="email"
                        id="username"
                        class="form-control"
                        placeholder="Phone number or email address"
                        name="username"
                      />
                    </div>

                    <div data-mdb-input-init class="form-outline mb-4">
                      <label class="form-label" for="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        class="form-control"
                        name="password"
                      />
                    </div>

                    <div class="text-center pt-1 mb-5 pb-1">
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                        type="submit"
                        @click="validateForm"
                      >
                        Log in
                      </button>
                      <a class="text-muted" href="#!">Forgot password?</a>
                    </div>

                    <div
                      class="d-flex align-items-center justify-content-center pb-4"
                    >
                      <p class="mb-0 me-2">Don't have an account?</p>
                      <router-link to="/signup">
                        <button
                          type="button"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          class="btn btn-outline-danger"
                        >
                          Create new
                        </button>
                      </router-link>
                    </div>
                  </form>

                  <form
                    name="signup"
                    v-if="currentRoute === '/signup'"
                    class="was-validated"
                    onsubmit="addUser"
                  >
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

                    <label class="form-label" for="corsi">Programme</label>
                    <select
                      class="form-select mb-1"
                      aria-label="Programme"
                      id="corsi"
                      required
                    >
                      <option selected disabled value="">Choose...</option>
                      <option v-for="corso in corsi" class="text-black">
                        {{ corso }}
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      Please choose a programme.
                    </div>

                    <div data-mdb-input-init class="form-outline mb-4">
                      <label class="form-label" for="pswd">Password</label>
                      <input
                        type="password"
                        id="pswd"
                        class="form-control"
                        required
                      />
                      <div class="invalid-feedback">
                        Please choose a password.
                      </div>
                    </div>

                    <div data-mdb-input-init class="form-outline mb-4">
                      <label class="form-label" for="confirmPswd"
                        >Confirm password</label
                      >
                      <input
                        type="password"
                        id="confirmPswd"
                        class="form-control"
                        required
                      />
                      <div class="invalid-feedback">
                        Please confirm your password.
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
                      <router-link to="/login">
                        <button
                          type="button"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          class="btn btn-outline-primary"
                        >
                          Log in
                        </button>
                      </router-link>
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
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
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

<style scoped></style>
