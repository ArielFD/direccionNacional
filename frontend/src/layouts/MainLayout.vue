<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="!auth.printMode">
      <q-toolbar class="row justify-end" v-if="data.auth">
        <q-btn-group flat>
          <q-btn icon="menu_book" label="Proveedores" :to="{ name: 'registroProveedor' }" padding="md" />
          <q-btn icon="menu_book" label="Contratos" :to="{ name: 'registro' }" padding="md" />
          <q-btn icon="menu_book" label="Buscar" :to="{ name: 'reportes' }" padding="md" />
          <!-- <q-btn icon="menu_book" label="Histogramas" :to="{ name: 'histogramas' }" padding="md"/> -->
          <q-btn icon="menu_book" label="Imprimir" :to="{ name: 'minuta' }" padding="md" />
          <q-btn icon="settings" label="Configuracion" @click="data.cardUser = true" padding="md" />
          <q-dialog v-model="data.cardUser">
            <q-card class="my-card ">
              <q-card-section>
                <div class="text-h6">Editar Usuario</div>
              </q-card-section>
              <form @submit.prevent.stop="onEdit">
                <q-card-section class="">
                  <q-input outlined dense v-model="data.usernameEdit" label="Nombre de Usuario" class="my-input"
                    lazy-rules :rules="alertRules.inputRules" ref="usernameEdit" />
                  <q-input outlined dense v-model="data.emailEdit" label="Email" lazy-rules :rules="alertRules.emailRules"
                    ref="emailEdit">
                    <template v-slot:prepend>
                      <q-icon name="mail" />
                    </template>
                  </q-input>
                  <q-input outlined dense class="my-input q-mb-md" v-model="data.passwordEdit" prefix="Password:"
                    :type="data.isPwd ? 'password' : 'text'" lazy-rules :rules="alertRules.passRules" ref="passwordEdit">
                    <template v-slot:append>
                      <q-icon :name="data.isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="data.isPwd = !data.isPwd" />
                    </template>
                  </q-input>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                  <q-btn flat color="primary" label="Editar" type="submit" />
                </q-card-actions>
              </form>
            </q-card>
          </q-dialog>
          <q-btn icon="home" label="Cerrar Sesion" @click="cerrarSesion" padding="md" />
        </q-btn-group>
      </q-toolbar>
      <q-toolbar class="row justify-end" v-if="data.admin">
        <q-btn-group flat>
          <q-btn icon="menu_book" label="Usuarios" :to="{ name: 'usuario' }" padding="md" />
          <q-btn icon="home" label="Cerrar Sesion" @click="cerrarSesion" padding="md" />
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-page-container class="container">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
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

const usernameEdit=ref(null);
const emailEdit=ref(null);
const passwordEdit=ref(null);

let data = reactive({
  admin: false,
  auth: false,
  public: false,
  cardUser: false,
  Tittle: "",
  usernameEdit:"",
  emailEdit:"",
  passwordEdit:"",
  isPwd:true,
  idUser:""
})

onMounted(() => {
  getRol()
})

function cerrarSesion(params) {
  auth.jwt = null
  auth.user = null
  alertRules.alerts[1].message = "Sesion Cerrada";
  $q.notify(alertRules.alerts[1]);
  router.push("/login");
}

function getRol(params) {
  if (auth.jwt == "" || auth.jwt == null) {
    data.admin = false
    data.auth = false
    data.public = true
    data.Tittle = "SIGAE"
  }
  else {
    api
      .get("/users/me?populate=%2A", {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        //console.log(response);
        data.usernameEdit=response.data.username
        data.emailEdit=response.data.email
        data.idUser=response.data.id
        if (
          response.data.role.name === "Admin") {
          data.admin = true
          data.auth = false
          data.public = false
          // data.Tittle = "SIGAE-" + response.data.role.name + "-" + response.data.username
        }
        if (
          response.data.role.name === "Authenticated") {
          data.auth = true
          data.admin = false
          data.public = false
          // data.Tittle = "SIGAE-" + response.data.role.name + "-" + response.data.username
        }
      })
      .catch(function (error) {
        //console.log(error);
      });
  }
}

function onEdit() {
  usernameEdit.value.validate();
  emailEdit.value.validate();
  passwordEdit.value.validate();

  if (usernameEdit.value.hasError || emailEdit.value.hasError || passwordEdit.value.hasError) {
    alertRules.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alertRules.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}

function Edit(params) {
  const dataRest = {
    email: data.emailEdit,
    username: data.usernameEdit,
    password: data.passwordEdit
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/users/${data.idUser}`, dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      data.cardUser = false
      alertRules.alerts[1].message = "Usuario editado";
      $q.notify(alertRules.alerts[1]);
      // auth.postTraza("Usuario editado", "Satisfactorio")
      getRol()
    })
    .catch(function (error) {
      alertRules.alerts[0].message = "Error al editar el usuario";
      $q.notify(alertRules.alerts[0]);
      // auth.postTraza("Usuario editado", "Fallo")
      //console.log(error);
    });
}
</script>
