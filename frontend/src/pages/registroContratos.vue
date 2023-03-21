<template>
  <q-page class="page row justify-center">
    <div class="opcion col-12 ">
      <div class="row">
        <q-item tag="label" v-ripple class="col-4">
          <q-item-section avatar>
            <q-radio v-model="state.opcion" val="Contrato" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label><b>Crear contrato</b> </q-item-label>
            <q-item-label>Permite crear un nuevo contrato </q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple class="col-8">
          <q-item-section avatar>
            <q-radio v-model="state.opcion" val="Suplemento" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label><b>Crear una especificacion o un suplemento</b></q-item-label>
            <q-item-label>Permite la realizacion de especificaciones o adicion de suplementos a contratos ya existentes en
              sistema</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div class="contract col-12">
      <q-card class="q-pa-md" v-if="state.opcion == 'Contrato'">
        <div class="row justify-center">
          <div class="col-12 row justify-center">
            <h5 class="text-weight-bolder">Registro de Contrato</h5>
          </div>
        </div>
        <q-separator class="q-mt-xs bg-primary" />
        <form @submit.prevent.stop="onContract">
          <div>
            <div class="row q-ma-md justify-between ">
              <q-input filled dense v-model="state.numProveedor" label="No Proveedor" class="col-2" mask="######"
                hint="año(2)+0+consecutivo(3)" ref="numProveedor" lazy-rules :rules="alertRules.emailRules" />
              <q-select filled dense v-model="state.clasificacionContrato" :options="state.clasificacionContratos"
                label="Clasificacion del contrato" class="col-3 q-mr-md" />
              <q-select filled dense v-model="state.tipoContrato" :options="state.tipoContratos" label="Tipo de contrato"
                class="q-mr-md col-2" />
              <q-select filled dense v-model="state.tipoProveedor" :options="state.tipoProveedores"
                label="Tipo de Proveedor" class="col-3" />
            </div>
            <div class="row q-ma-md justify-between ">
              <q-select class="col-6" use-input input-debounce="0" dense filled v-model="state.empresa"
                :options="state.empresas" @filter="filterEmpresa" label="Empresa">
                <template v-slot:after>
                  <q-btn round dense flat icon="add" @click="state.cardEmpresa = true" />
                </template>
              </q-select>
            </div>
            <q-dialog v-model="state.cardEmpresa" persistent>
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">Empresa</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input dense filled v-model="state.addEmpresa" autofocus class="q-mb-md" label="Empresa" />
                  <q-input dense filled v-model="state.addSucursal" autofocus label="Sucursal" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn flat label="Agreegar empresa" v-close-popup @click="addEmpresa" />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.domicilioLegal" label="Con domicilio legal en:"
                class="q-mr-md col-6" />
              <q-input filled dense v-model="state.codREEUP" label="Codigo REEUP" class="q-mr-md col-2" />
              <q-input filled dense v-model="state.codNIT" label="Codigo NIT" class="col-2" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.cuentaBancaria" label="Cuenta Bancaria" class="q-mr-md col-6" />
              <q-input filled dense v-model="state.agenciaBancaria" label="Agencia Bancaria" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.titular" label="Titular" class="col-2" />
              <q-select filled dense v-model="state.banco" :options="state.bancos" label="Banco" class="col-3" />
              <q-select filled dense v-model="state.objetoDelContrato" :options="state.objetosDelContrato"
                label="Objeto del contrato" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.bancoSitio" label="Banco sitio" class="q-mr-md col-5" />
              <q-input filled dense v-model="state.telefono" label="Telefono" class="q-mr-md col-2" type="tel"
                mask="# - ### - ####" hint="# - ### - ####" />
              <q-input filled dense v-model="state.correo" label="Correo" type="email" class="col-4" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.dictamen" label="Dictamen legal" class="q-mr-md col-2" />
              <q-input filled dense v-model="state.acta" label="Acta" class="q-mr-md col-2" />
              <q-input v-model="state.fechaActa" filled dense type="date" hint="Fecha del Acta" class="q-mr-md col-2" />
              <q-input v-model="state.acuerdo" filled dense autogrow label="Acuerdo" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" />
              <q-input filled dense v-model="state.valorContrato" label="Valor del contrato" class=" col-2" />
              <q-input v-model="state.fechaFirma" filled dense type="date" hint="Fecha de firma" class="q-mr-md col-2" />
              <q-input v-model="state.vigencia" filled dense type="date" hint="Fecha de vencimiento" class="col-2" />
            </div>
            <div class="row q-ma-md justify-between relative">
              <div class="col-6">
                <q-input v-model="state.observaciones" filled dense autogrow label="Observaciones" />
              </div>
              <div class="absolute-bottom-right q-ma-lg">
                <q-btn color="primary" label="Registrar contrato" type="submit" />
                <!-- @click="crearRegistro"  -->
              </div>
            </div>
          </div>
        </form>
      </q-card>
      <q-card class="q-pa-md" v-else>
        <div class="row justify-center">
          <h5 class="text-weight-bolder">Registro de Especificaciones y Suplementos</h5>
          <div class="col-12 row justify-between">
            <div class="row">
              <q-radio v-model="state.opcionSuplemento" val="Especificacion" color="primary" label="Especificacion" />
              <q-radio v-model="state.opcionSuplemento" val="Suplemento" color="primary" label="Suplemento" />
              <q-input filled dense v-model="state.numProveedorSup" label="No Proveedor" class="q-ml-md col-4"
                mask="######" />
            </div>
            <div>
              <q-btn color="primary" label="Buscar contrato" class="q-mr-md" @click="searchSup" />
            </div>
          </div>
        </div>
        <q-separator class="q-mt-xs bg-primary" />
        <form @submit.prevent.stop="onSupplement">
          <div v-if="state.opcionSuplemento == 'Suplemento'">
            <div class="row q-ma-md justify-start ">
              <q-input filled dense v-model="state.numContrato" label="No Contrato" class="q-mr-md col-2"
                ref="numContrato" lazy-rules :rules="alertRules.emailRules" />
              <q-select filled dense v-model="state.tipoContratoSup" :options="state.tipoContratos"
                label="Tipo de contrato" class="q-mr-md col-2" />
              <q-select filled dense v-model="state.objetoDelContratoSup" :options="state.objetosDelContrato"
                label="Objeto del contrato" class="col-4" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.dictamenSup" label="Dictamen legal" class="q-mr-md col-2" />
              <q-input filled dense v-model="state.actaSup" label="Acta" class="q-mr-md col-2" />
              <q-input v-model="state.fechaActaSup" filled dense type="date" hint="Fecha del Acta"
                class="q-mr-md col-2" />
              <q-input v-model="state.acuerdoSup" filled dense autogrow label="Acuerdo" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-select filled dense v-model="state.pagoSup" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-3" />
              <q-input filled dense v-model="state.valorContratoSup" label="Valor del contrato" class=" col-2" />
              <q-input v-model="state.fechaFirmaSup" filled dense type="date" hint="Fecha de firma"
                class="q-mr-md col-2" />
              <q-input v-model="state.vigenciaSup" filled dense type="date" hint="Fecha de vencimiento" class="col-2" />
            </div>
            <div class="row q-ma-md justify-between relative">
              <div class="col-6">
                <q-input v-model="state.observacionesSup" filled dense autogrow label="Observaciones" />
              </div>
              <div class="absolute-bottom-right q-ma-lg">
                <q-btn color="primary" label="Añadir" type="submit" />
                <!-- @click="crearEspcSup" -->
              </div>
            </div>
          </div>
        </form>
        <form @submit.prevent.stop="onEditContract" v-if="state.opcionSuplemento == 'Especificacion'">
          <div>
            <div class="row q-ma-md justify-between ">
              <q-input filled dense v-model="state.numProveedorEdit" readonly label="No Proveedor" class="col-2"
                mask="######" hint="año(2)+0+consecutivo(3)" ref="numProveedor" lazy-rules
                :rules="alertRules.emailRules" />
              <q-select filled dense v-model="state.clasificacionContrato" :options="state.clasificacionContratos"
                label="Clasificacion del contrato" class="col-3 q-mr-md" />
              <q-select filled dense v-model="state.tipoContrato" :options="state.tipoContratos" label="Tipo de contrato"
                class="q-mr-md col-2" />
              <q-select filled dense v-model="state.tipoProveedor" :options="state.tipoProveedores"
                label="Tipo de Proveedor" class="col-3" />
            </div>
            <div class="row q-ma-md justify-between ">
              <q-select class="col-6" use-input input-debounce="0" dense filled v-model="state.empresa"
                :options="state.empresas" @filter="filterEmpresa" label="Empresa">
                <template v-slot:after>
                  <q-btn round dense flat icon="add" @click="state.cardEmpresa = true" />
                </template>
              </q-select>
            </div>
            <q-dialog v-model="state.cardEmpresa" persistent>
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">Empresa</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input dense filled v-model="state.addEmpresa" autofocus class="q-mb-md" label="Empresa" />
                  <q-input dense filled v-model="state.addSucursal" autofocus label="Sucursal" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn flat label="Agreegar empresa" v-close-popup @click="addEmpresa" />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.domicilioLegal" label="Con domicilio legal en:"
                class="q-mr-md col-6" />
              <q-input filled dense v-model="state.codREEUP" label="Codigo REEUP" class="q-mr-md col-2" />
              <q-input filled dense v-model="state.codNIT" label="Codigo NIT" class="col-2" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.cuentaBancaria" label="Cuenta Bancaria" class="q-mr-md col-6" />
              <q-input filled dense v-model="state.agenciaBancaria" label="Agencia Bancaria" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.titular" label="Titular" class="col-2" />
              <q-select filled dense v-model="state.banco" :options="state.bancos" label="Banco" class="col-3" />
              <q-select filled dense v-model="state.objetoDelContrato" :options="state.objetosDelContrato"
                label="Objeto del contrato" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.bancoSitio" label="Banco sitio" class="q-mr-md col-5" />
              <q-input filled dense v-model="state.telefono" label="Telefono" class="q-mr-md col-2" type="tel"
                mask="# - ### - ####" hint="# - ### - ####" />
              <q-input filled dense v-model="state.correo" label="Correo" type="email" class="col-4" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.dictamen" label="Dictamen legal" class="q-mr-md col-2" />
              <q-input filled dense v-model="state.acta" label="Acta" class="q-mr-md col-2" />
              <q-input v-model="state.fechaActa" filled dense type="date" hint="Fecha del Acta" class="q-mr-md col-2" />
              <q-input v-model="state.acuerdo" filled dense autogrow label="Acuerdo" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" />
              <q-input filled dense v-model="state.valorContrato" label="Valor del contrato" class=" col-2" />
              <q-input v-model="state.fechaFirma" filled dense type="date" hint="Fecha de firma" class="q-mr-md col-2" />
              <q-input v-model="state.vigencia" filled dense type="date" hint="Fecha de vencimiento" class="col-2" />
            </div>
            <div class="row q-ma-md justify-between relative">
              <div class="col-6">
                <q-input v-model="state.observaciones" filled dense autogrow label="Observaciones" />
              </div>
              <div class="absolute-bottom-right q-ma-lg">
                <q-btn color="primary" label="Aplicar" type="submit" />
                <!-- @click="crearRegistro"  -->
              </div>
            </div>
          </div>
        </form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, watch, computed } from "vue"
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

const numProveedor = ref(null);
const numContrato = ref(null);

const state = reactive({
  buscar: false,
  opcion: "Contrato",
  numProveedor: "",
  numProveedorEdit: "",
  clasificacionContrato: "",
  clasificacionContratos: ["General", "Marco", "Base permanente"],
  numContrato: "",
  tipoContrato: "",
  tipoContratos: ["Suministro", "Servicio", "Verbales"],
  tipoProveedor: "",
  tipoProveedores: ["TCP", "MIPYME", "CNA", "Empresa Estatal", "Otros"],
  empresa: "",
  empresas: [],
  domicilioLegal: "",
  codREEUP: "",
  codNIT: "",
  cuentaBancaria: "",
  titular: "",
  agenciaBancaria: "",
  banco: "",
  bancos: ["Metropolitano", "Popular de ahorro", "Credito y Comercio", "BICSA", "BFI"],
  bancoSitio: "",
  telefono: "",
  correo: "",
  pago: "",
  pagos: ["Por cheque", "Por cheque certificado", "Por transferencia bancaria", "En Efectivo", "Otros"],
  valorContrato: "",
  fechaFirma: "",
  vigencia: "",
  objetoDelContrato: "",
  objetosDelContrato: ["Servicios Gastronómicos", "Reparación de equipos", "Compraventa de mercancías", "Hospedaje", "Reparación y Mantenimiento Constructivo", "Servicios Especializado", "Servicios Técnicos", "Transportación", "Telefonía", "Otros"],
  observaciones: "",
  dictamen: "",
  acta: "",
  fechaActa: "",
  acuerdo: "",
  opcionSuplemento: "Especificacion",

  numProveedorSup: "",
  numContrato: "",
  tipoContratoSup: "",
  objetoDelContratoSup: "",
  dictamenSup: "",
  actaSup: "",
  fechaActaSup: "",
  acuerdoSup: "",
  pagoSup: "",
  valorContratoSup: "",
  fechaFirmaSup: "",
  vigenciaSup: "",
  observacionesSup: "",

  proveedores: [],
  proveedoresClass: [],

  suplementos: [],
  suplementosClass: [],

  arrEmpresas: [],
  arrEmpresasTemp: [],

  cardEmpresa: false,
  addEmpresa: "",
  addSucursal: "",
})

onMounted(() => {
  getProveedor()
  getEmpresas()
  getSuplemento()
})

watch(() => state.numProveedor, (value, oldValue) => {
  if (value.length == 6 && state.proveedores.find(element => element == value)) {
    alertRules.alerts[0].message = "El numero de proveedor ya existe";
    $q.notify(alertRules.alerts[0]);
  }
})

watch(() => state.numContrato, (value, oldValue) => {
  if (state.suplementos.find(element => element == value)) {
    alertRules.alerts[0].message = "El numero de suplemento ya existe";
    $q.notify(alertRules.alerts[0]);
  }
})
// ?populate=%2A
watch(() => state.opcion, () => {
  clear()
})

watch(() => state.opcionSuplemento, () => {
  clear()
})

const authorization = {
  headers: {
    Authorization: `Bearer ${auth.jwt}`,
  },
};

function clear() {
  state.numProveedor = "",
    state.clasificacionContrato = "",
    state.numContrato = "",
    state.tipoContrato = "",
    state.tipoProveedor = "",
    state.empresa = "",
    state.domicilioLegal = "",
    state.codREEUP = "",
    state.codNIT = "",
    state.cuentaBancaria = "",
    state.titular = "",
    state.agenciaBancaria = "",
    state.banco = "",
    state.bancoSitio = "",
    state.telefono = "",
    state.correo = "",
    state.pago = "",
    state.valorContrato = "",
    state.fechaFirma = "",
    state.vigencia = "",
    state.objetoDelContrato = "",
    state.observaciones = "",
    state.dictamen = "",
    state.acta = "",
    state.fechaActa = "",
    state.acuerdo = ""
}

function getEmpresas() {
  state.arrEmpresasTemp = [],
    state.arrEmpresas = []
  api
    .get("/empresas", authorization)
    .then(function (response) {
      console.log("🚀 ~ file: registroContratos.vue:267 ~ response:", response)
      for (let index = 0; index < response.data.data.length; index++) {
        state.arrEmpresasTemp.push({
          id: response.data.data[index].id,
          nombre: response.data.data[index].attributes.nombre + ", " + response.data.data[index].attributes.sucursal
        });
      }
      state.arrEmpresasTemp.forEach(element => {
        state.arrEmpresas.push(element.nombre)
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getProveedor() {
  api
    .get("/contracts", authorization)
    .then(function (response) {
      for (let index = 0; index < response.data.data.length; index++) {
        state.proveedores.push(response.data.data[index].attributes.numProveedor);
        state.proveedoresClass.push({ id: response.data.data[index].id, numProveedor: response.data.data[index].attributes.numProveedor })
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getSuplemento() {
  api
    .get("/suplements", authorization)
    .then(function (response) {
      for (let index = 0; index < response.data.data.length; index++) {
        state.suplementos.push(response.data.data[index].attributes.noContrato);
        state.suplementosClass.push({ id: response.data.data[index].id, noContrato: response.data.data[index].attributes.noContrato })
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function filterEmpresa(val, update) {
  if (val === '') {
    update(() => {
      state.empresas = state.arrEmpresas
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    state.empresas = state.arrEmpresas.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}

function onContract() {
  numProveedor.value.validate();
  if (state.numProveedor.length == 6 && state.proveedores.find(element => element == state.numProveedor)) {
    alertRules.alerts[0].message = "El numero de proveedor ya existe";
    $q.notify(alertRules.alerts[0]);
  }
  else if (numProveedor.value.hasError || state.numProveedor.length < 6 || state.numProveedor.length > 6) {
    alertRules.alerts[0].message = "El numero de proveedor se compone de 6 digitos"
    $q.notify(alertRules.alerts[0]);
  } else {
    crearRegistro();
  }
}

function crearRegistro() {
  let tempEntidad = ""
  state.arrEmpresasTemp.forEach(element => {
    if (element.nombre == state.empresa) tempEntidad = { id: element.id }
  });
  const dataRest = {
    data: {
      empresa: tempEntidad,
      numProveedor: state.numProveedor,
      clasificacionContrato: state.clasificacionContrato,
      tipoProveedor:state.tipoProveedor,
      tipoContrato: state.tipoContrato,
      domicilioLegal: state.domicilioLegal,
      codREEUP: state.codREEUP,
      codNIT: state.codNIT,
      cuentaBancaria: state.cuentaBancaria,
      titular: state.titular,
      agenciaBancaria: state.agenciaBancaria,
      banco: state.banco,
      bancoSitio: state.bancoSitio,
      telefono: state.telefono,
      correo: state.correo,
      pago: state.pago,
      valor: state.valorContrato,
      firma: state.fechaFirma,
      vencimiento: state.vigencia,
      objetoContrato: state.objetoDelContrato,
      dictamenLegal: state.dictamen,
      acta: state.acta,
      fechaActa: state.fechaActa,
      acuerdo: state.acuerdo,
      observaciones: state.observaciones
    }
  }

  api
    .post("/contracts", dataRest, authorization)
    .then(function (response) {
      console.log(response);
      alertRules.alerts[1].message = "Contrato agregada";
      $q.notify(alertRules.alerts[1]);
      clear()
      state.proveedores=[]
    state.proveedoresClass=[]
    getProveedor()
    })
    .catch(function (error) {
      console.log(error);
      alertRules.alerts[0].message = "Error al agregar el contrato";
      $q.notify(alertRules.alerts[0]);
    });
}

function addEmpresa() {
  const dataRest = {
    data: {
      nombre: state.addEmpresa,
      sucursal: state.addSucursal
    }
  }
  api
    .post("/empresas", dataRest, authorization)
    .then(function (response) {
      console.log(response);
      getEmpresas()
      state.addEmpresa = "",
        state.addSucursal = ""
      alertRules.alerts[1].message = "Empresa agregada";
      $q.notify(alertRules.alerts[1]);
    })
    .catch(function (error) {
      console.log(error);
      alertRules.alerts[0].message = "Error al agregar la empresa";
      $q.notify(alertRules.alerts[0]);
    });
}

function searchSup() {
  let tempID = ""
  if (state.numProveedorSup.length != 6) {
    alertRules.alerts[0].message = "El numero de proveedor debe tener 6 digitos";
    $q.notify(alertRules.alerts[0]);

  } else {
    state.proveedoresClass.forEach(element => {
      if (element.numProveedor == state.numProveedorSup) tempID = element.id
    });
    if (tempID != "" && state.opcionSuplemento == 'Suplemento') getProveedorId(tempID)
    if (tempID != "" && state.opcionSuplemento == 'Especificacion') getContractId(tempID)
    // state.buscar = !state.buscar
    if (tempID = "") {
      alertRules.alerts[0].message = "El numero de proveedor no existe";
      $q.notify(alertRules.alerts[0]);
    }
  }
}

function getProveedorId(params) {
  api
    .get(`/contracts/${params}?populate=%2A`, authorization)
    .then(function (response) {
      console.log("🚀 ~ file: registroContratos.vue:435 ~ response:", response)
      const attributes = response.data.data.attributes
      state.tipoContratoSup = attributes.tipoContrato,
        state.objetoDelContratoSup = attributes.objetoContrato,
        state.dictamenSup = attributes.dictamenLegal,
        state.actaSup = attributes.acta,
        state.fechaActaSup = attributes.fechaActa,
        state.acuerdoSup = attributes.acuerdo,
        state.pagoSup = attributes.pago,
        state.valorContratoSup = attributes.valor,
        state.fechaFirmaSup = attributes.firma,
        state.vigenciaSup = attributes.vencimiento,
        state.observacionesSup = attributes.observaciones
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getContractId(params) {
  api
    .get(`/contracts/${params}?populate=%2A`, authorization)
    .then(function (response) {
      console.log("🚀 ~ file: registroContratos.vue:435 ~ response:", response)
      state.numProveedorEdit = state.numProveedorSup,
        state.clasificacionContrato = response.data.data.attributes.clasificacionContrato,
        state.tipoContrato = response.data.data.attributes.tipoContrato,
        state.empresa = response.data.data.attributes.empresa.data.attributes.nombre + ", " + response.data.data.attributes.empresa.data.attributes.sucursal
      state.tipoProveedor = response.data.data.attributes.tipoProveedor,
        state.domicilioLegal = response.data.data.attributes.domicilioLegal
      state.codREEUP = response.data.data.attributes.codREEUP
      state.codNIT = response.data.data.attributes.codNIT
      state.cuentaBancaria = response.data.data.attributes.cuentaBancaria
      state.agenciaBancaria = response.data.data.attributes.agenciaBancaria
      state.titular = response.data.data.attributes.titular
      state.banco = response.data.data.attributes.banco
      state.objetoDelContrato = response.data.data.attributes.objetoContrato
      state.bancoSitio = response.data.data.attributes.bancoSitio
      state.telefono = response.data.data.attributes.telefono
      state.correo = response.data.data.attributes.correo
      state.dictamen = response.data.data.attributes.dictamenLegal
      state.acta = response.data.data.attributes.acta
      state.fechaActa = response.data.data.attributes.fechaActa
      state.acuerdo = response.data.data.attributes.acuerdo
      state.pago = response.data.data.attributes.pago
      state.valorContrato = response.data.data.attributes.valor
      state.fechaFirma = response.data.data.attributes.firma
      state.vigencia = response.data.data.attributes.vencimiento
      state.observaciones = response.data.data.attributes.observaciones
    })
    .catch(function (error) {
      console.log(error);
    });
}

function onSupplement() {
  numContrato.value.validate();
  if (state.suplementos.find(element => element == state.numContrato)) {
    alertRules.alerts[0].message = "El numero de contrato ya existe";
    $q.notify(alertRules.alerts[0]);
  }
  else if (numContrato.value.hasError) {
    alertRules.alerts[0].message = "Error al crear el numero de contrato"
    $q.notify(alertRules.alerts[0]);
  } else {
    crearEspcSup();
  }
}

function crearEspcSup(params) {
  let tempID = ""
  state.proveedoresClass.forEach(element => {
    if (element.numProveedor == state.numProveedorSup) tempID = element.id
  });
  if (state.numContrato != "") {
    if (tempID != "") {
      addSuplement(tempID)
      editContract(tempID)
    }
    else {
      alertRules.alerts[0].message = "El numero de proveedor no existe";
      $q.notify(alertRules.alerts[0]);
    }
  } else {
    alertRules.alerts[0].message = "El numero de de contrato es obligatorio";
    $q.notify(alertRules.alerts[0]);
  }
}

function addSuplement(params) {
  const dataRest = {
    data: {
      contract: params,
      noContrato: state.numContrato,
      tipoContrato: state.tipoContratoSup,
      objeto: state.objetoDelContratoSup,
      dictamenLegal: state.dictamenSup,
      acta: state.actaSup,
      fechaActa: state.fechaActaSup,
      acuerdo: state.acuerdoSup,
      pago: state.pagoSup,
      valor: state.valorContratoSup,
      firma: state.fechaFirmaSup,
      vencimiento: state.vigenciaSup,
      observaciones: state.observacionesSup
    }
  }

  api
    .post("/suplements", dataRest, authorization)
    .then(function (response) {
      console.log(response);
      console.log("🚀 ~ file: registroContratos.vue:476 ~ response:", response)
      alertRules.alerts[1].message = `Suplemento agregador al contrato ${state.numProveedorSup}`;
      $q.notify(alertRules.alerts[1]);
    })
    .catch(function (error) {
      console.log(error);
      alertRules.alerts[0].message = "Error al agregar el suplemento";
      $q.notify(alertRules.alerts[0]);
    });
}

function editContract(param) {
  const dataRest = {
    data: {
      tipoContrato: state.tipoContratoSup,
      objetoContrato: state.objetoDelContratoSup,
      dictamenLegal: state.dictamenSup,
      acta: state.actaSup,
      fechaActa: state.fechaActaSup,
      acuerdo: state.acuerdoSup,
      pago: state.pagoSup,
      valor: state.valorContratoSup,
      firma: state.fechaFirmaSup,
      vencimiento: state.vigenciaSup,
      observaciones: state.observacionesSup
    }
  }

  api
    .put(`/contracts/${param}`, dataRest, authorization)
    .then(function (response) {
    })
    .catch(function (error) {

      console.log(error);
    });
}

function onEditContract() {
  editContractEspc();
}

function editContractEspc(param) {
  let tempID = ""
  state.proveedoresClass.forEach(element => {
    if (element.numProveedor == state.numProveedorEdit) tempID = element.id
  });
  let tempEntidad = ""
  state.arrEmpresasTemp.forEach(element => {
    if (element.nombre == state.empresa) tempEntidad = { id: element.id }
  });

  const dataRest = {
    data: {
      empresa: tempEntidad,
      numProveedor: state.numProveedorEdit,
      clasificacionContrato: state.clasificacionContrato,
      tipoContrato: state.tipoContrato,
      domicilioLegal: state.domicilioLegal,
      codREEUP: state.codREEUP,
      codNIT: state.codNIT,
      cuentaBancaria: state.cuentaBancaria,
      titular: state.titular,
      agenciaBancaria: state.agenciaBancaria,
      banco: state.banco,
      bancoSitio: state.bancoSitio,
      telefono: state.telefono,
      correo: state.correo,
      pago: state.pago,
      valor: state.valorContrato,
      firma: state.fechaFirma,
      vencimiento: state.vigencia,
      objetoContrato: state.objetoDelContrato,
      dictamenLegal: state.dictamen,
      acta: state.acta,
      fechaActa: state.fechaActa,
      acuerdo: state.acuerdo,
      observaciones: state.observaciones
    }
  }

  api
    .put(`/contracts/${tempID}`, dataRest, authorization)
    .then(function (response) {
      alertRules.alerts[1].message = "Especificacion realizada";
      $q.notify(alertRules.alerts[1]);
    })
    .catch(function (error) {
      alertRules.alerts[0].message = "Fallo en la especificacion"
      $q.notify(alertRules.alerts[0]);
      console.log(error);
    });
}
</script>

<style scoped>
.contract {
  width: 100%;
  max-width: 1200px;
  /* background-color: rgb(232, 242, 255); */
  margin-top: 50px;
  margin-bottom: 50px;
}

.opcion {
  width: 100%;
  max-width: 1200px;
  /* background-color: rgb(232, 242, 255); */
  margin-top: 50px;
  color: white;
}

.page {
  background: #005AA7;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #ffffff, #005AA7);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #ffffff, #005AA7);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>