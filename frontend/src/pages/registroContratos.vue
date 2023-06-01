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
              <q-select filled dense v-model="state.proveedor" :options="state.listProveedores"
                label="Proveedor" class="col-3 q-mr-md" />
              <q-input filled dense v-model="state.numProveedor" label="No Proveedor" class="col-2" ref="numProveedor" lazy-rules :rules="alertRules.emailRules" />
                <q-input filled dense v-model="state.numCliente" label="No Cliente" class="col q-ml-md q-mr-md" />
              <q-select filled dense v-model="state.clasificacionContrato" :options="state.clasificacionContratos"
                label="Clasificacion del contrato" class="col-3 q-mr-md" />
              <q-select filled dense v-model="state.tipoContrato" :options="state.tipoContratos" label="Tipo de contrato"
                class="q-mr-md col-2" ref="tcontrato" lazy-rules :rules="alertRules.emailRules"/>
            </div>
            <div class="row q-ma-md ">
              <q-select filled dense v-model="state.tipoProveedor" :options="state.tipoProveedores"
                label="Tipo de Proveedor" class="col-3 q-mr-md" />
              <q-select class="col-6" use-input input-debounce="0" dense filled v-model="state.empresa"
                :options="state.empresas" @filter="filterEmpresa" label="Empresa">
                <template v-slot:after>
                  <q-btn round dense flat icon="add" @click="state.cardEmpresa = true" />
                </template>
              </q-select>
              <q-input filled dense v-model="state.organismo" label="Organismo" class="col-2 q-ml-xl" />
            </div>
            <q-dialog v-model="state.cardEmpresa" persistent>
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">Empresa</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input dense filled v-model="state.addEmpresa" autofocus class="q-mb-md" label="Empresa" />
                  <q-input dense filled v-model="state.addSucursal" label="Sucursal" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Cancelar" v-close-popup />
                  <q-btn flat label="Agregar empresa" v-close-popup @click="addEmpresa" />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.domicilioLegal" autogrow label="Con domicilio legal en:"
                class="q-mr-md col-6" />
              <q-input filled dense v-model="state.codREEUP" label="Codigo REEUP" class="q-mr-md col-2"
                v-if="state.tipoProveedor == 'Empresa Estatal'" mask="###.#.#######" hint="###.#.#######" />
              <q-input filled dense v-model="state.codREEUP" label="Licencia" class="q-mr-md col-2"
                v-if="state.tipoProveedor != 'Empresa Estatal'" />
              <q-input filled dense v-model="state.codNIT" label="Codigo NIT" class="col-2" mask="###########"
                hint="###########" ref="nit" lazy-rules :rules="alertRules.emailRules"/>
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.cuentaBancaria" label="Cuenta Bancaria" class="q-mr-md col-3"
                mask="####-####-####-####" hint="####-####-####-####" ref="cuenta" lazy-rules :rules="alertRules.emailRules"/>
              <q-input filled dense v-model="state.titular" label="Titular" class="col-8" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.agenciaBancaria" label="Agencia Bancaria" class="col-2" mask="####"
                hint="####" />
              <q-select filled dense v-model="state.banco" :options="state.bancos" label="Banco" class="col-3" />
              <q-select filled dense v-model="state.objetoDelContrato" :options="state.objetosDelContrato"
                label="Objeto del contrato" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.bancoSitio" autogrow label="Direccion del banco"
                class="q-mr-md col-5" />
              <q-input filled dense v-model="state.telefono" label="Telefono" class="q-mr-md col-2" type="tel"
                mask="# - ### - ####" hint="# - ### - ####" />
              <q-input filled dense v-model="state.correo" label="Correo" class="col-4" ref="email" lazy-rules :rules="alertRules.emailRules"/>
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.dictamen" label="Dictamen legal" class="q-mr-md col-2" mask="###"
                hint="###" ref="dictamen" lazy-rules :rules="alertRules.emailRules"/>
              <q-input filled dense v-model="state.acta" label="Acta" class="q-mr-md col-1" mask="###" hint="###" ref="acta" lazy-rules :rules="alertRules.emailRules"/>
              <q-input v-model="state.fechaActa" filled dense type="date" hint="Fecha del Acta" class="q-mr-md col-2" ref="facta" lazy-rules :rules="alertRules.emailRules"/>
              <q-input v-model="state.acuerdo" filled dense autogrow label="Acuerdo" class="col-1" mask="###"
                hint="###" ref="acuerdo" lazy-rules :rules="alertRules.emailRules"/>
              <q-input v-model="state.fechaFirma" filled dense type="date" hint="Fecha de firma" class="q-mr-md col-2" ref="firma" lazy-rules :rules="alertRules.emailRules"/>
              <q-input v-model="state.vigencia" filled dense type="date" hint="Fecha de vencimiento" class="col-2" ref="vencimiento" lazy-rules :rules="alertRules.emailRules"/>
            </div>
            <div class="row q-ma-md justify-around">
              <!-- <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" /> -->
              <div>
                Forma de pago:
                <q-checkbox v-model="state.pagos" val="Por cheque" label="Por cheque" color="primary" />
                <q-checkbox v-model="state.pagos" val="Por cheque certificado" label="Por cheque certificado"
                  color="primary" />
                <q-checkbox v-model="state.pagos" val="Por transferencia bancaria" label="Por transferencia bancaria"
                  color="primary" />
                <q-checkbox v-model="state.pagos" val="En efectivo" label="En efectivo" color="primary" />
                <q-checkbox v-model="state.pagos" val="Otros" label="Otros" color="primary" />
              </div>
              <q-input filled dense v-model="state.valorContrato" type="number" label="Valor del contrato"
                class=" col-2" />
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
          <div class="col-12">
            <div class="row  justify-between">
              <div class="col-8">
                <div class="row ">
                  <q-radio v-model="state.opcionSuplemento" val="Especificacion" color="primary" label="Especifico" />
                  <q-radio v-model="state.opcionSuplemento" val="Suplemento" color="primary" label="Suplemento" />
                  <q-toggle v-if="state.opcionSuplemento == 'Suplemento'" v-model="state.value" color="primary" />
                  <q-input filled dense v-model="state.numProveedorSup" label="No Proveedor" mask="########"
                    v-if="!state.value" />
                  <q-input filled dense v-model="state.numProveedorSup" label="No de contrato especifico"
                    mask="###########" v-if="state.value" class="col-3" />
                </div>
              </div>
              <div class="col-2">
                <q-btn color="primary" label="Buscar contrato" class="q-mr-md" @click="searchSup" />
              </div>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-xs bg-primary" />
        <form @submit.prevent.stop="onSupplement">
          <div v-if="state.opcionSuplemento == 'Suplemento'">
            <div class="row q-ma-md justify-start ">
              <q-input filled dense v-model="state.numContrato" label="No Suplemento" class="q-mr-md col-2"
                hint="consecutivo(3)" ref="numProveedor" lazy-rules :rules="alertRules.emailRules" />
                <q-input filled dense v-model="state.numClienteSup" label="No CLiente" class="col q-ml-md q-mr-md" />
              <q-select filled dense v-model="state.tipoContratoSup" :options="state.tipoContratos"
                label="Tipo de contrato" class="q-mr-md col-2" />
              <q-select filled dense v-model="state.objetoDelContratoSup" :options="state.objetosDelContrato"
                label="Objeto del Suplemento" class="col-4" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.dictamenSup" label="Dictamen legal" class="q-mr-md col-2" mask="###"
                hint="###" />
              <q-input filled dense v-model="state.actaSup" label="Acta" class="q-mr-md col-1" mask="###" hint="###" />
              <q-input v-model="state.fechaActaSup" filled dense type="date" hint="Fecha del Acta"
                class="q-mr-md col-2" />
              <q-input v-model="state.acuerdoSup" filled dense autogrow label="Acuerdo" class="col-1" mask="###"
                hint="###" />
              <q-input v-model="state.fechaFirmaSup" filled dense type="date" hint="Fecha de firma"
                class="q-mr-md col-2" />
              <q-input v-model="state.vigenciaSup" filled dense type="date" hint="Fecha de vencimiento" class="col-2" />
            </div>
            <div class="row q-ma-md justify-around">
              <!-- <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" /> -->
              <div>
                Forma de pago:
                <q-checkbox v-model="state.pagos" val="Por cheque" label="Por cheque" color="primary" />
                <q-checkbox v-model="state.pagos" val="Por cheque certificado" label="Por cheque certificado"
                  color="primary" />
                <q-checkbox v-model="state.pagos" val="Por transferencia bancaria" label="Por transferencia bancaria"
                  color="primary" />
                <q-checkbox v-model="state.pagos" val="En efectivo" label="En efectivo" color="primary" />
                <q-checkbox v-model="state.pagos" val="Otros" label="Otros" color="primary" />
              </div>
              <q-input filled dense v-model="state.valorContratoSup" type="number" label="Valor del contrato"
                class=" col-2" />
            </div>
            <div class="row q-ma-md justify-between relative">
              <div class="col-6">
                <q-input v-model="state.observacionesSup" filled dense autogrow label="Observaciones" />
              </div>
              <div>
                Campos amodificar en contrato:
                <q-checkbox v-model="state.campos" val="Objeto" label="Objeto del contrato" color="primary" />
                <q-checkbox v-model="state.campos" val="Vencimiento" label="Vencimiento" color="primary" />
                <q-checkbox v-model="state.campos" val="Forma" label="Forma de pago" color="primary" />
                <q-checkbox v-model="state.campos" val="Valor" label="Valor" color="primary" />
                <q-checkbox v-model="state.campos" val="Observaciones" label="Observaciones" color="primary" />
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
              <q-input filled dense v-model="state.numProveedorEdit" label="No de contrato especifico" class="col-2"
                hint="consecutivo(3)"  ref="numProveedor" lazy-rules :rules="alertRules.emailRules" />
                <q-input filled dense v-model="state.numClienteEdit" label="No Cliente" class="col q-ml-md q-mr-md" />
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
              <q-input filled dense v-model="state.organismoEdit" label="Organismo" class="col-2 q-ml-xl" />
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
              <q-input filled dense v-model="state.domicilioLegal" autogrow label="Con domicilio legal en:"
                class="q-mr-md col-6" />
              <q-input filled dense v-model="state.codREEUP" label="Codigo REEUP" class="q-mr-md col-2"
                v-if="state.tipoProveedor == 'Empresa Estatal'" mask="###.#.#######" hint="###.#.#######" />
              <q-input filled dense v-model="state.codREEUP" label="Licencia" class="q-mr-md col-2"
                v-if="state.tipoProveedor != 'Empresa Estatal'" />
              <q-input filled dense v-model="state.codNIT" label="Codigo NIT" class="col-2" mask="###########"
                hint="###########" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.cuentaBancaria" label="Cuenta Bancaria" class="q-mr-md col-3"
                mask="####-####-####-####" hint="####-####-####-####" />
              <q-input filled dense v-model="state.titular" label="Titular" class="col-8" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.agenciaBancaria" label="Agencia Bancaria" class="col-2" mask="####"
                hint="####" />
              <q-select filled dense v-model="state.banco" :options="state.bancos" label="Banco" class="col-3" />
              <q-select filled dense v-model="state.objetoDelContrato" :options="state.objetosDelContrato"
                label="Objeto del contrato" class="col-5" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.bancoSitio" autogrow label="Direccion del banco"
                class="q-mr-md col-5" />
              <q-input filled dense v-model="state.telefono" label="Telefono" class="q-mr-md col-2" type="tel"
                mask="# - ### - ####" hint="# - ### - ####" />
              <q-input filled dense v-model="state.correo" label="Correo" class="col-4" />
            </div>
            <div class="row q-ma-md justify-between">
              <q-input filled dense v-model="state.dictamen" label="Dictamen legal" class="q-mr-md col-2" mask="###"
                hint="###" />
              <q-input filled dense v-model="state.acta" label="Acta" class="q-mr-md col-1" mask="###" hint="###" />
              <q-input v-model="state.fechaActa" filled dense type="date" hint="Fecha del Acta" class="q-mr-md col-2" />
              <q-input v-model="state.acuerdo" filled dense autogrow label="Acuerdo" class="col-1" mask="###"
                hint="###" />
              <q-input v-model="state.fechaFirma" filled dense type="date" hint="Fecha de firma" class="q-mr-md col-2" />
              <q-input v-model="state.vigencia" filled dense type="date" hint="Fecha de vencimiento" class="col-2" />
            </div>
            <div class="row q-ma-md justify-around">
              <!-- <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" /> -->
              <div>
                Forma de pago:
                <q-checkbox v-model="state.pagos" val="Por cheque" label="Por cheque" color="primary" />
                <q-checkbox v-model="state.pagos" val="Por cheque certificado" label="Por cheque certificado"
                  color="primary" />
                <q-checkbox v-model="state.pagos" val="Por transferencia bancaria" label="Por transferencia bancaria"
                  color="primary" />
                <q-checkbox v-model="state.pagos" val="En efectivo" label="En efectivo" color="primary" />
                <q-checkbox v-model="state.pagos" val="Otros" label="Otros" color="primary" />
              </div>
              <q-input filled dense v-model="state.valorContrato" label="Valor del contrato" type="number"
                class=" col-2" />
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
const nit = ref(null);
const dictamen = ref(null);
const acta = ref(null);
const acuerdo = ref(null);
const cuenta = ref(null);
const tcontrato=ref(null)
const email=ref(null)
const vencimiento=ref(null)
const firma=ref(null)
const facta=ref(null)

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
  pagos: ["Por cheque"],
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

  proveedor:"",
  listProveedores:[],
  arrProveedoresTemp:[],

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

  numClienteEdit:"",
  numClienteSup:"",
  numCliente:"",
  organismo:"",
  organismoEdit:"",

  proveedores: [],
  proveedoresClass: [],

  especificos: [],
  especificosClass: [],

  suplementos: [],
  suplementosClass: [],

  arrEmpresas: [],
  arrEmpresasTemp: [],

  cardEmpresa: false,
  addEmpresa: "",
  addSucursal: "",

  campos: [],
  tempId: "",

  value: false
})

onMounted(() => {
  getEmpresas()
  getProveedores()
  getProveedor()
  getSuplemento()
  getEspecifico()
})

// watch(() => state.numProveedor, (value, oldValue) => {
//   if (value.length == 6 && state.proveedores.find(element => element == value)) {
//     alertRules.alerts[0].message = "El numero de proveedor ya existe";
//     $q.notify(alertRules.alerts[0]);
//   }
// })

watch(() => state.proveedor, (value, oldValue) => {
  state.arrProveedoresTemp.forEach(element => {
    if(element.nombre==state.proveedor) state.numProveedor=element.numero
  });
})

watch(() => state.value, (value, oldValue) => {
  clear()
})
//state.opcionSuplemento state.value
// watch(() => state.numContrato, (value, oldValue) => {
//   if (state.suplementos.find(element => element == value)) {
//     alertRules.alerts[0].message = "El numero de suplemento ya existe";
//     $q.notify(alertRules.alerts[0]);
//   }
// })
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
    state.pagos = [],
    state.valorContrato = "",
    state.fechaFirma = "",
    state.vigencia = "",
    state.objetoDelContrato = "",
    state.observaciones = "",
    state.dictamen = "",
    state.acta = "",
    state.fechaActa = "",
    state.acuerdo = "",

    state.numContrato = ""
  state.tipoContratoSup = "",
    state.objetoDelContratoSup = "",
    state.dictamenSup = "",
    state.actaSup = "",
    state.fechaActaSup = "",
    state.acuerdoSup = "",
    state.pagoSup = "",
    state.valorContratoSup = "",
    state.fechaFirmaSup = "",
    state.vigenciaSup = "",
    state.observacionesSup = ""
  state.numContrato = ""
  state.numProveedorEdit = ""
  state.numProveedorSup = "",

  state.numClienteEdit="",
  state.numClienteSup="",
  state.numCliente="",
  state.organismo=""
}

function getEmpresas() {
  state.arrEmpresasTemp = [],
    state.arrEmpresas = []
  api
    .get("/empresas", authorization)
    .then(function (response) {
      //console.log("🚀 ~ file: registroContratos.vue:267 ~ response:", response)
      for (let index = 0; index < response.data.data.length; index++) {
        if (response.data.data[index].attributes.sucursal) {
          state.arrEmpresasTemp.push({
            id: response.data.data[index].id,
            nombre: response.data.data[index].attributes.nombre + ", " + response.data.data[index].attributes.sucursal
          });
        }
        else {
          state.arrEmpresasTemp.push({
            id: response.data.data[index].id,
            nombre: response.data.data[index].attributes.nombre
          });
        }
      }
      state.arrEmpresasTemp.forEach(element => {
        state.arrEmpresas.push(element.nombre)
      });
    })
    .catch(function (error) {
      //console.log(error);
    });
}

function getProveedores() {
  state.arrEmpresasTemp = [],
    state.arrEmpresas = []
  api
    .get("/proveedors", authorization)
    .then(function (response) {
      console.log("🚀 ~ file: registroContratos.vue:565 ~ response:", response)
      for (let index = 0; index < response.data.data.length; index++) {
          state.arrProveedoresTemp.push({
            id: response.data.data[index].id,
            nombre: response.data.data[index].attributes.nombre,
            numero: response.data.data[index].attributes.numero
          });
        
      }
      state.arrProveedoresTemp.forEach(element => {
        state.listProveedores.push(element.nombre)
      });
    })
    .catch(function (error) {
      //console.log(error);
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
      //console.log(error);
    });
}

function getEspecifico() {
  api
    .get("/especificos", authorization)
    .then(function (response) {
      for (let index = 0; index < response.data.data.length; index++) {
        state.especificos.push(response.data.data[index].attributes.numProveedor);
        state.especificosClass.push({ id: response.data.data[index].id, numProveedor: response.data.data[index].attributes.numProveedor })
      }
    })
    .catch(function (error) {
      //console.log(error);
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
      //console.log(error);
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
  nit.value.validate();
  dictamen.value.validate();
  acta.value.validate();
  acuerdo.value.validate();
  cuenta.value.validate();
  tcontrato.value.validate();
  email.value.validate();
  vencimiento.value.validate();
  firma.value.validate();
  facta.value.validate();
  
  //console.log(state.numProveedor.length);
  let fechaF = new Date(state.fechaFirma)
  let fechaA = new Date(state.fechaActa)
  // if (state.numProveedor.length == 10 && state.proveedores.find(element => element == state.numProveedor)) {
  //   alertRules.alerts[0].message = "El numero de proveedor ya existe";
  //   $q.notify(alertRules.alerts[0]);
  // }
  // if (numProveedor.value.hasError || state.numProveedor.length != 10) {
  //   alertRules.alerts[0].message = "El numero de proveedor se compone de 8 digitos"
  //   $q.notify(alertRules.alerts[0]);
  // }
  if (fechaF < fechaA) {
    alertRules.alerts[0].message = "La fecha de firma debe ser mayor que la fecha de acta"
    $q.notify(alertRules.alerts[0]);
  }
  if (numProveedor.value.hasError || tcontrato.value.hasError || email.value.hasError || vencimiento.value.hasError || firma.value.hasError || facta.value.hasError || nit.value.hasError || dictamen.value.hasError || acta.value.hasError || acuerdo.value.hasError || cuenta.value.hasError) {
    alertRules.alerts[0].message = "Campos obligatorios"
    $q.notify(alertRules.alerts[0]);
  }  else {
    crearRegistro();
  }
}

function crearRegistro() {
  let tempEntidad = ""
  let tempProveedor=""
  state.arrEmpresasTemp.forEach(element => {
    if (element.nombre == state.empresa) tempEntidad = { id: element.id }
  });
  state.arrProveedoresTemp.forEach(element => {
    if (element.nombre == state.proveedor) tempProveedor = { id: element.id }
  });
  state.pago = state.pagos.join(", ")

  const dataRest = {
    data: {
      proveedor:tempProveedor,
      empresa: tempEntidad,
      numProveedor: state.numProveedor,
      organismo:state.organismo,
      numCliente:state.numCliente,
      clasificacionContrato: state.clasificacionContrato,
      tipoProveedor: state.tipoProveedor,
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
      //console.log(response);
      alertRules.alerts[1].message = "Contrato agregada";
      $q.notify(alertRules.alerts[1]);
      clear()
      state.proveedores = []
      state.proveedoresClass = []
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
      //console.log(response);
      getEmpresas()
      state.addEmpresa = "",
        state.addSucursal = ""
      alertRules.alerts[1].message = "Empresa agregada";
      $q.notify(alertRules.alerts[1]);
    })
    .catch(function (error) {
      //console.log(error);
      alertRules.alerts[0].message = "Error al agregar la empresa";
      $q.notify(alertRules.alerts[0]);
    });
}

function searchSup() {
  let tempID = ""
  //console.log("🚀 ~ file: registroContratos.vue:655 ~ searchSup ~ state.numProveedorSup.length:", state.numProveedorSup.length)
  // if (state.numProveedorSup.length < 8) {
  //   alertRules.alerts[0].message = "El numero de proveedor debe tener 8 digitos";
  //   $q.notify(alertRules.alerts[0]);

  // } else 
  if (!state.value) {
    //console.log("Aqui");
    state.proveedoresClass.forEach(element => {
      if (element.numProveedor == state.numProveedorSup) tempID = element.id
    });
    if (tempID != "" && state.opcionSuplemento == 'Suplemento') getProveedorId(tempID); state.tempId = tempID
    if (tempID != "" && state.opcionSuplemento == 'Especificacion') getContractId(tempID); state.tempId = tempID
    // state.buscar = !state.buscar
  }
  else if (state.value) {
    //console.log("Aqui");
    state.especificosClass.forEach(element => {
      if (element.numProveedor == state.numProveedorSup) tempID = element.id
    });
    if (tempID != "" && state.opcionSuplemento == 'Suplemento') getEspecificoId(tempID); state.tempId = tempID
    if (tempID != "" && state.opcionSuplemento == 'Especificacion') getContractId(tempID); state.tempId = tempID
    // state.buscar = !state.buscar
  }
  if (tempID = "") {
    alertRules.alerts[0].message = "El numero de proveedor no existe";
    $q.notify(alertRules.alerts[0]);
  }
}

function getProveedorId(params) {
  api
    .get(`/contracts/${params}?populate=%2A`, authorization)
    .then(function (response) {
      //console.log("🚀 ~ file: registroContratos.vue:435 ~ response:", response)
      const attributes = response.data.data.attributes
      //console.log("🚀 ~ file: registroContratos.vue:689 ~ attributes:", attributes)
      state.numContrato = response.data.data.attributes.numProveedor + "" + (response.data.data.attributes.suplements.data.length + 1).toString().padStart(3, 0)
      state.tipoContratoSup = attributes.tipoContrato,
      state.numCliente=attributes.numCliente,
        state.objetoDelContratoSup = attributes.objetoContrato,
        state.dictamenSup = attributes.dictamenLegal,
        state.actaSup = attributes.acta,
        state.fechaActaSup = attributes.fechaActa,
        state.acuerdoSup = attributes.acuerdo,
        state.pagoSup = attributes.pago,
        state.valorContratoSup = attributes.valor,
        state.fechaFirmaSup = attributes.firma,
        state.vigenciaSup = attributes.vencimiento,
        state.observacionesSup = attributes.observaciones,

        state.objetoDelContrato = attributes.objetoContrato,
        state.pago = attributes.pago,
        state.valorContrato = attributes.valor,
        state.observaciones = attributes.observaciones,
        state.vigencia = attributes.vencimiento
      state.pagos = attributes.pago.split(", ")
    })
    .catch(function (error) {
      //console.log(error);
    });
}

function getEspecificoId(params) {
  api
    .get(`/especificos/${params}?populate=%2A`, authorization)
    .then(function (response) {
      //console.log("🚀 ~ file: registroContratos.vue:435 ~ response:", response)
      const attributes = response.data.data.attributes
      state.numContrato = response.data.data.attributes.numProveedor + "" + (response.data.data.attributes.suplements.data.length + 1).toString().padStart(3, 0)
      state.numClienteEdit=attributes.numCliente,
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
        state.observacionesSup = attributes.observaciones,

        state.objetoDelContrato = attributes.objetoContrato,
        state.pago = attributes.pago,
        state.valorContrato = attributes.valor,
        state.observaciones = attributes.observaciones,
        state.vigencia = attributes.vencimiento

      state.pagos = attributes.pago.split(", ")
    })
    .catch(function (error) {
      //console.log(error);
    });
}

function getContractId(params) {
  api
    .get(`/contracts/${params}?populate=%2A`, authorization)
    .then(function (response) {
      //console.log("🚀 ~ file: registroContratos.vue:435 ~ response:", response)
      state.numProveedorEdit = response.data.data.attributes.numProveedor + "" + (response.data.data.attributes.especificos.data.length + 1).toString().padStart(3, 0),
        state.clasificacionContrato = response.data.data.attributes.clasificacionContrato,
        state.tipoContrato = response.data.data.attributes.tipoContrato,
        state.numCliente=response.data.data.attributes.numCliente,
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
      state.pagos = state.pago.split(", ")
      state.valorContrato = response.data.data.attributes.valor
      state.fechaFirma = response.data.data.attributes.firma
      state.vigencia = response.data.data.attributes.vencimiento
      state.observaciones = response.data.data.attributes.observaciones
    })
    .catch(function (error) {
      //console.log(error);
    });
}

function onSupplement() {
  // numContrato.value.validate();
  let fechaF = new Date(state.fechaFirmaSup)
  let fechaA = new Date(state.fechaActaSup)
  // if (state.suplementos.find(element => element == state.numContrato)) {
  //   alertRules.alerts[0].message = "El numero de contrato ya existe";
  //   $q.notify(alertRules.alerts[0]);
  // }
  // else if (numContrato.value.hasError) {
  //   alertRules.alerts[0].message = "Error al crear el numero de contrato"
  //   $q.notify(alertRules.alerts[0]);
  // }
  if (fechaF < fechaA) {
    alertRules.alerts[0].message = "La fecha de firma debe ser mayor que la fecha de acta"
    $q.notify(alertRules.alerts[0]);
  } else if (!state.value) {
    crearContractSup(state.value);
  }
  else if (state.value) {
    crearEspecificSup(state.value);
  }
}

function crearContractSup(params) {
  let tempID = ""
  state.proveedoresClass.forEach(element => {
    if (element.numProveedor == state.numProveedorSup) tempID = element.id
  });
  if (state.numContrato != "") {
    if (tempID != "") {
      addSuplement(tempID, params)
      editContract(tempID)
    }
    else {
      alertRules.alerts[0].message = "El numero de proveedor no existe";
      $q.notify(alertRules.alerts[0]);
    }
  } else {
    alertRules.alerts[0].message = "El numero de contrato es obligatorio";
    $q.notify(alertRules.alerts[0]);
  }
}

function crearEspecificSup(params) {
  let tempID = ""
  state.especificosClass.forEach(element => {
    if (element.numProveedor == state.numProveedorSup) tempID = element.id
  });
  if (state.numContrato != "") {
    if (tempID != "") {
      addSuplement(tempID, params)
      editEspecifico(tempID)
    }
    else {
      alertRules.alerts[0].message = "El numero de proveedor no existe";
      $q.notify(alertRules.alerts[0]);
    }
  } else {
    alertRules.alerts[0].message = "El numero de contrato es obligatorio";
    $q.notify(alertRules.alerts[0]);
  }
}

function addSuplement(params, params2) {
  let dataRest
  if (!params2) {
    dataRest = {
      data: {
        contract: params,
        numCliente:state.numClienteSup,
        noContrato: state.numContrato,
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
  } else {
    dataRest = {
      data: {
        especifico: params,
        numCliente:state.numClienteSup,
        noContrato: state.numContrato,
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
  }

  api
    .post("/suplements", dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      //console.log("🚀 ~ file: registroContratos.vue:476 ~ response:", response)
      alertRules.alerts[1].message = `Suplemento agregador al contrato ${state.numProveedorSup}`;
      $q.notify(alertRules.alerts[1]);
      getProveedor()
      getSuplemento()
      getEspecifico()
      clear()
    })
    .catch(function (error) {
      //console.log(error);
      alertRules.alerts[0].message = "Error al agregar el suplemento";
      $q.notify(alertRules.alerts[0]);
    });
}

function editContract(param) {
  state.pagoSup = state.pagos.join(", ")
  let objeto = "", pago = "", valor = "", vencimiento = "", observaciones = ""
  state.campos.indexOf("Objeto") != -1 ? objeto = state.objetoDelContratoSup : objeto = state.objetoDelContrato
  //console.log("🚀 ~ file: registroContratos.vue:776 ~ editContract ~ state.campos.indexOf('Objeto'):", state.campos.indexOf("Objeto"))
  state.campos.indexOf("Valor") != -1 ? pago = state.pagoSup : pago = state.pago
  state.campos.indexOf("Forma") != -1 ? valor = state.valorContratoSup : valor = state.valorContrato
  state.campos.indexOf("Vencimiento") != -1 ? vencimiento = state.vigenciaSup : vencimiento = state.vigencia
  state.campos.indexOf("Observaciones") != -1 ? observaciones = state.observacionesSup : observaciones = state.observaciones

  const dataRest = {
    data: {
      objetoContrato: objeto,
      pago: pago,
      valor: valor,
      vencimiento: vencimiento,
      observaciones: observaciones
    }
  }
  //console.log("🚀 ~ file: registroContratos.vue:784 ~ editContract ~ dataRest:", dataRest)


  api
    .put(`/contracts/${param}`, dataRest, authorization)
    .then(function (response) {
    })
    .catch(function (error) {

      //console.log(error);
    });
}

function editEspecifico(param) {
  state.pagoSup = state.pagos.join(", ")
  let objeto = "", pago = "", valor = "", vencimiento = "", observaciones = ""
  state.campos.indexOf("Objeto") != -1 ? objeto = state.objetoDelContratoSup : objeto = state.objetoDelContrato
  //console.log("🚀 ~ file: registroContratos.vue:776 ~ editContract ~ state.campos.indexOf('Objeto'):", state.campos.indexOf("Objeto"))
  state.campos.indexOf("Valor") != -1 ? pago = state.pagoSup : pago = state.pago
  state.campos.indexOf("Forma") != -1 ? valor = state.valorContratoSup : valor = state.valorContrato
  state.campos.indexOf("Vencimiento") != -1 ? vencimiento = state.vigenciaSup : vencimiento = state.vigencia
  state.campos.indexOf("Observaciones") != -1 ? observaciones = state.observacionesSup : observaciones = state.observaciones

  const dataRest = {
    data: {
      objetoContrato: objeto,
      pago: pago,
      valor: valor,
      vencimiento: vencimiento,
      observaciones: observaciones
    }
  }
  //console.log("🚀 ~ file: registroContratos.vue:784 ~ editContract ~ dataRest:", dataRest)


  api
    .put(`/especificos/${param}`, dataRest, authorization)
    .then(function (response) {
    })
    .catch(function (error) {

      //console.log(error);
    });
}

function onEditContract() {
  let fechaF = new Date(state.fechaFirma)
  let fechaA = new Date(state.fechaActa)
  if (fechaF < fechaA) {
    alertRules.alerts[0].message = "La fecha de firma debe ser mayor que la fecha de acta"
    $q.notify(alertRules.alerts[0]);
  } else {
    editContractEspc();
  }
}

function editContractEspc(param) {
  let tempEntidad = ""
  state.arrEmpresasTemp.forEach(element => {
    if (element.nombre == state.empresa) tempEntidad = { id: element.id }
  });
  state.pago = state.pagos.join(", ")
  const dataRest = {
    data: {
      empresa: tempEntidad,
      contract: state.tempId,
      numCLiente:state.numClienteEdit,
      organismo:state.organismoEdit,
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
    .post(`/especificos`, dataRest, authorization)
    .then(function (response) {
      //console.log("🚀 ~ file: registroContratos.vue:859 ~ response:", response)
      alertRules.alerts[1].message = "Especificacion realizada";
      $q.notify(alertRules.alerts[1]);
      getProveedor()
      getSuplemento()
      getEspecifico()
      clear()
    })
    .catch(function (error) {
      alertRules.alerts[0].message = "Fallo en la especificacion"
      $q.notify(alertRules.alerts[0]);
      //console.log(error);
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

}</style>