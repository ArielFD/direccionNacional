<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="!auth.printMode">
      <q-toolbar class="row justify-end" v-if="data.auth">
        <q-btn-group flat >
          <q-btn icon="menu_book" label="Registro" :to="{ name: 'registro' }" padding="md"/>
          <q-btn icon="menu_book" label="Reportes" :to="{ name: 'reportes' }" padding="md"/>
          <!-- <q-btn icon="menu_book" label="Histogramas" :to="{ name: 'histogramas' }" padding="md"/> -->
          <q-btn icon="menu_book" label="Minuta" :to="{ name: 'minuta' }" padding="md"/>
          <q-btn icon="home" label="Cerrar Sesion" @click="cerrarSesion" padding="md"/>
        </q-btn-group>
      </q-toolbar>
      <q-toolbar class="row justify-end" v-if="data.admin">
        <q-btn-group flat >
          <q-btn icon="menu_book" label="Usuarios" :to="{ name: 'usuario' }" padding="md"/>
          <q-btn icon="home" label="Cerrar Sesion" @click="cerrarSesion" padding="md"/>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive,ref,onMounted } from "vue";
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

let data = reactive({
  admin: false,
  auth: false,
  public: false,
  card: false,
  Tittle: ""
})

onMounted(() => {
  getRol()
})

function cerrarSesion(params) {
  auth.jwt=null
  auth.user=null
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
        console.log(response);
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
        console.log(error);
      });
  }
}
</script>
