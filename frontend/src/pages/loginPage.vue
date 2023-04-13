<template>
  <div class="container row items-center justify-center">
      <q-card class="my-card">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div style="font-size: large;font-weight: 800;text-align: center;">LOGIN</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent.stop="onLogin">
            <q-input class="q-mb-md" ref="nameRef" filled v-model="data.email" label="User o Email" lazy-rules :rules="alertRules.emailRules">
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
            <q-input ref="passRef" class="q-mb-md" v-model="data.password" prefix="Password:" filled
              :type="data.isPwd ? 'password' : 'text'" @keyup.enter="Login" lazy-rules :rules="alertRules.emailRules">
              <template v-slot:append>
                <q-icon :name="data.isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="data.isPwd = !data.isPwd" />
              </template>
            </q-input>
            <!-- <a href="/#/entermail" style="text-decoration: none; color: #1976D2;">Olvidaste la Contraseña?</a> -->
            <q-separator />
            <q-card-actions>
                <q-btn style="width: 100%;" color="primary" label="LOGIN" class="col self-center q-mt-md" type="submit" />
            </q-card-actions>
            <!-- <div style="text-align: center; bottom: 0px;">
              <a href="/#/entermail" style="text-decoration: none; color: #1976D2; text-align: center;">Registrarse</a>
            </div> -->
          </form>
        </q-card-section>
      </q-card>
  </div>
</template>
  
<script setup>
import { reactive,ref } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";

const auth = useAuthStore();
const alertRules = useAlertsRulesStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const nameRef = ref(null);
const passRef = ref(null);

const data = reactive({
  email: "",
  password: "",
  isPwd: true,
})

async function Login() {
  await api
    .post("/auth/local", {
      identifier: data.email,
      password: data.password,
    })
    .then(function (response) {
      console.log(response);
      alertRules.alerts[1].message = "Sesion Iniciada, Bienvenido!!!";
      $q.notify(alertRules.alerts[1]);
      auth.jwt = response.data.jwt;
      auth.user = response.data.user;
      router.push("/reportes");
    })
    .catch(function (error) {
      console.log(error);
      alertRules.alerts[0].message = "Credenciales incorrectas";
      $q.notify(alertRules.alerts[0]);
    });
}

function onLogin() {
  nameRef.value.validate();
  passRef.value.validate();

  if (nameRef.value.hasError || nameRef.value.hasError) {
    alertRules.alerts[0].message = "Credenciales incorrectas";
    $q.notify(alertRules.alerts[0]);
  } else {
    Login();
  }
}
</script>
  
<style scoped>
.my-card {
  max-width: 300px;
  height: 350px;
}

.container {
  background: #005AA7;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #ffffff, #005AA7);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #ffffff, #005AA7);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  height: 100vh;
}
</style>
  
  
  