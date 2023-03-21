<template>
  <div class="page">
    <div class="row q-pa-lg" v-if="!auth.printMode">
      <div class="col-2">
        <h6 class="no-margin text-white">Crear minuta</h6>
      </div>
      <div class="col-3 q-gutter-sm text-white">
        <q-radio v-model="state.opcion" val="Proveedor" label="Proveedor" color="white" />
        <q-radio v-model="state.opcion" val="Suplemento" label="Suplemento" color="white" />
      </div>
      <div class="col-2 q-mr-md">
        <q-input filled dense v-model="state.NoProveedor" label="Proveedor" label-color="white"
          v-if="state.opcion == 'Proveedor'" />
          <div v-if="state.opcion == 'Suplemento'">
            <q-input filled dense v-model="state.NoProveedor" label="Proveedor" label-color="white"/>
            <q-input filled dense v-model="state.suplemento" label="Suplemento" label-color="white"
          />
          </div>
      </div>
      <div class="col">
        <q-btn color="primary" round icon="send" @click="search"/>
      </div>
    </div>
    <div class="row justify-center" v-if="state.vigencia">
                <q-btn flat round color="secondary" icon="print" class="text-white q-mr-xs"
                    @click="auth.printMode = !auth.printMode" v-if="!auth.printMode" />
                <q-btn flat color="secondary" class="printChart text-black q-mr-xs" :label="state.titulo"
                    @click="auth.printMode = !auth.printMode" v-if="auth.printMode" />
            </div>
    <div class="row justify-center"  v-if="state.opcion == 'Proveedor'">
      <div class="minuta col">
        <div class="column">
          <div class="col">
            <div class="row justify-end">
              <q-input dense v-model="state.fecha" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Fecha de entrega</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.NoProveedor" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">No Proveedor</p>
                </template>
              </q-input>
              <q-input dense v-model="state.acuerdo" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Acuerdo</p>
                </template>
              </q-input>
              <q-input dense v-model="state.acta" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Acta</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.nit" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">NIT</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.tipoProveedor" label-color="white" style="width: 300px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Proveedor</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
              <q-input dense v-model="state.objeto" label-color="white" style="width: 300px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Objeto</p>
                </template>
              </q-input>
            </div>
            <div class="row">
              <q-input dense v-model="state.domicilio" label-color="white" style="width: 800px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Domicilio legal</p>
                </template>
              </q-input>
            </div>
            <div class="col">
            <div class="row">
              <q-input dense v-model="state.reeup" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Codigo REEUP</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.vigencia" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Vigencia</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.pago" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Forma de pago</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.cuentaBancaria" label-color="white" style="width: 500px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Cuenta bancaria</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.titular" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Titular</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <q-input dense v-model="state.agenciaBancaria" label-color="white">
              <template v-slot:before>
                <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Sucursal Bancaria(No y
                  Direccion)</p>
              </template>
            </q-input>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.valor" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Valor</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <q-input dense v-model="state.observaciones" label-color="white" autogrow>
              <template v-slot:before>
                <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Observaciones</p>
              </template>
            </q-input>
          </div>
          <div class="col">
            <div class="row justify-around">
              <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Emitido</p>
              <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Revisado</p>
              <p class="text-weight-bolder q-mt-md q-mr-xl" style="font-size:medium;text-align: justify;">Recibido</p>
            </div>
          </div>
          <div class="col">
            <div class="row justify-between">
              <p class="text-weight-bolder col-5 q-mt-md" style="font-size:medium;">Calle 13 # 456 e/
                E y F Vedado,
                Plaza de la Revolución. La Habana. Cuba.<br>
                Telf.: 830 6097,832 2323, 832 1489, 832 1528</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center" v-if="state.opcion == 'Suplemento'">
      <div class="minuta col">
        <div class="column">
          <div class="col">
            <div class="row justify-end">
              <q-input dense v-model="state.fecha" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Fecha de entrega</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.NoProveedor" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">No Proveedor</p>
                </template>
              </q-input>
              <q-input dense v-model="state.acuerdo" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Acuerdo</p>
                </template>
              </q-input>
              <q-input dense v-model="state.acta" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Acta</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.nit" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">NIT</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.tipoProveedor" label-color="white" style="width: 300px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Proveedor</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
              <q-input dense v-model="state.objeto" label-color="white" style="width: 300px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Objeto</p>
                </template>
              </q-input>
            </div>
            <div class="row">
              <q-input dense v-model="state.domicilio" label-color="white" style="width: 800px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Domicilio legal</p>
                </template>
              </q-input>
            </div>
            <div class="col">
            <div class="row">
              <q-input dense v-model="state.reeup" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Codigo REEUP</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.vigencia" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Vigencia</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.pago" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Forma de pago</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.cuentaBancaria" label-color="white" style="width: 500px;">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Cuenta bancaria</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.titular" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Titular</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <q-input dense v-model="state.agenciaBancaria" label-color="white">
              <template v-slot:before>
                <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Sucursal Bancaria(No y
                  Direccion)</p>
              </template>
            </q-input>
          </div>
          <div class="col">
            <div class="row">
              <q-input dense v-model="state.valor" label-color="white">
                <template v-slot:before>
                  <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Valor</p>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col">
            <q-input dense v-model="state.observaciones" label-color="white" autogrow>
              <template v-slot:before>
                <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Observaciones</p>
              </template>
            </q-input>
          </div>
          <div class="col">
            <div class="row justify-around">
              <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Emitido</p>
              <p class="text-weight-bolder q-mt-md" style="font-size:medium;text-align: justify;">Revisado</p>
              <p class="text-weight-bolder q-mt-md q-mr-xl" style="font-size:medium;text-align: justify;">Recibido</p>
            </div>
          </div>
          <div class="col">
            <div class="row justify-between">
              <p class="text-weight-bolder col-5 q-mt-md" style="font-size:medium;">Calle 13 # 456 e/
                E y F Vedado,
                Plaza de la Revolución. La Habana. Cuba.<br>
                Telf.: 830 6097,832 2323, 832 1489, 832 1528</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref ,watch} from "vue";
import { api } from "src/boot/axios";
import { exportFile,useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";

const auth = useAuthStore();
const alertRules = useAlertsRulesStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const authorization = {
    headers: {
        Authorization: `Bearer ${auth.jwt}`,
    },
};

const state = reactive({
  opcion: "Proveedor",
  titulo: "",
  NoProveedor: "",
  suplemento: "",
  acuerdo:"",
  acta:"",
  nit:"",
  proveedor:"",
  objeto:"",
  domicilio:"",
  reeup:"",
  vigencia:"",
  pago:"",
  titular:"",
  noSucursal:"",
  direccionSucursal:"",
  valor:"",
  observaciones:"",
  fecha:"",
  agenciaBancaria:"",
  tipoProveedor:"",
  cuentaBancaria:""
})

watch(() => state.opcion, (value, oldValue) => {
  state.titulo= "",
  state.acuerdo="",
  state.acta="",
  state.nit="",
  state.proveedor="",
  state.objeto="",
  state.domicilio="",
  state.reeup="",
  state.vigencia="",
  state.pago="",
  state.titular="",
  state.noSucursal="",
  state.direccionSucursal="",
  state.valor="",
  state.observaciones="",
  state.fecha="",
  state.agenciaBancaria="",
  state.tipoProveedor="",
  state.cuentaBancaria=""
})


function search(params) {
  if(state.opcion=="Proveedor") getProveedor()
  if(state.opcion=="Suplemento") getSuplemento()
}

function getProveedor() {
  state.titulo="Minuta contrato"
  api
    .get("/contracts", authorization)
    .then(function (response) {
      for (let index = 0; index < response.data.data.length; index++) {
        if(state.NoProveedor==response.data.data[index].attributes.numProveedor){
          console.log(response.data.data[index].attributes);
          const {acta,acuerdo,agenciaBancaria,codNIT,codREEUP,domicilioLegal,firma,vencimiento,valor,titular,pago,observaciones,objetoContrato,tipoProveedor,cuentaBancaria}=response.data.data[index].attributes
          state.acuerdo=acuerdo
          state.acta=acta
          state.nit=codNIT
          state.reeup=codREEUP
          state.domicilio=domicilioLegal
          // state.fecha=firma
          const vence=new Date(vencimiento).toLocaleDateString('en-GB')
          state.vigencia=vence
          state.valor=valor
          state.titular=titular
          state.pago=pago
          state.observaciones=observaciones
          state.objeto=objetoContrato
          state.agenciaBancaria=agenciaBancaria
          state.tipoProveedor=tipoProveedor
          state.cuentaBancaria=cuentaBancaria
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getSuplemento() {
  state.titulo="Minuta suplemento"
  api
    .get("/suplements?populate=%2A", authorization)
    .then(function (response) {
      console.log("🚀 ~ file: minutaContratos.vue:417 ~ response:", response)
      
      for (let index = 0; index < response.data.data.length; index++) {
        if(state.NoProveedor==response.data.data[index].attributes.contract.data.attributes.numProveedor && state.suplemento==response.data.data[index].attributes.noContrato){
          console.log(response.data.data[index].attributes);
          const {acta,acuerdo,firma,vencimiento,valor,pago,observaciones,objetoContrato}=response.data.data[index].attributes
          state.acuerdo=acuerdo
          state.acta=acta
          state.nit=response.data.data[index].attributes.contract.data.attributes.codNIT
          state.reeup=response.data.data[index].attributes.contract.data.attributes.codREEUP
          state.domicilio=response.data.data[index].attributes.contract.data.attributes.domicilioLegal
          // state.fecha=firma
          const vence=new Date(vencimiento).toLocaleDateString('en-GB')
          state.vigencia=vence
          state.valor=valor
          state.titular=response.data.data[index].attributes.contract.data.attributes.titular
          state.pago=pago
          state.observaciones=observaciones
          state.objeto=objetoContrato
          state.agenciaBancaria=response.data.data[index].attributes.contract.data.attributes.agenciaBancaria
          state.tipoProveedor=response.data.data[index].attributes.contract.data.attributes.tipoProveedor
          state.cuentaBancaria=response.data.data[index].attributes.contract.data.attributes.cuentaBancaria
        }
      }
    })
    .catch(function (error) {
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
  height: 100vh;
}

.minuta {
  /* border: 1px solid; */
  height: 80vh;
  max-width: 1000px;
}

.page:has(.printChart) {
    background: #ffffff;
    height: 100vh;
}
</style>