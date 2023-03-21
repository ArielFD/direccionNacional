<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="!auth.printMode">
      <q-toolbar class="row justify-end">
        <q-btn-group flat >
          <q-btn icon="menu_book" label="Registro" :to="{ name: 'registro' }" padding="md"/>
          <q-btn icon="menu_book" label="Reportes" :to="{ name: 'reportes' }" padding="md"/>
          <q-btn icon="menu_book" label="Histogramas" :to="{ name: 'histogramas' }" padding="md"/>
          <q-btn icon="menu_book" label="Minuta" :to="{ name: 'minuta' }" padding="md"/>
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

function cerrarSesion(params) {
  auth.jwt=null
  auth.user=null
  alertRules.alerts[1].message = "Sesion Cerrada";
      $q.notify(alertRules.alerts[1]);
  router.push("/login");
}
</script>
