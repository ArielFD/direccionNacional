<template>
    <div class="page column items-start">
        <div class="opcion col-3">
            <div class="row" v-if="!auth.printMode">
                <q-item tag="label" v-ripple class="col-12" clickable @click="getContratosActivos">
                    <q-item-section avatar>
                        <q-radio v-model="state.opcion" val="opcion1" color="white" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>Cantidad de contratos vigentes por tipo de proveedor</b></q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple class="col-12" clickable @click="getContratosActivos">
                    <q-item-section avatar>
                        <q-radio v-model="state.opcion" val="opcion2" color="white" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>Cantidad de contratos vigentes por tipo de contratos</b></q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple class="col-12" clickable @click="getContratosActivos">
                    <q-item-section avatar>
                        <q-radio v-model="state.opcion" val="opcion3" color="white" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label><b>Cantidad de contratos vigentes por tipo de objeto</b> </q-item-label>
                    </q-item-section>
                </q-item>
            </div>
        </div>
        <div class="col-1" style="width: 100%;">
            <div class="row justify-center">
                <q-btn flat round color="secondary" icon="print" class="text-white q-mr-xs"
                    @click="auth.printMode = !auth.printMode" v-if="state.opcion != '' && !auth.printMode" />
                <q-btn flat color="secondary" class="printChart text-black q-mr-xs" :label="state.titulo"
                    @click="auth.printMode = !auth.printMode" v-if="auth.printMode" />
            </div>
        </div>
        <div style="width: 100%;">
            <apexcharts width="100%" height="350" type="bar" :options="state.chartOptions" :series="state.series">
            </apexcharts>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import apexcharts from "vue3-apexcharts";
import { api } from "src/boot/axios";
import { exportFile, useQuasar } from "quasar";
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
    opcion: "",
    titulo: "",
    actualDate: new Date,
    tipoProveedor: "",
    tipoProveedores: ["TCP", "MIPYME", "CNA", "Empresa Estatal", "Otros"],
    tipoContrato: "",
    tipoContratos: ["Suministro", "Servicio", "Verbales"],
    objetoDelContrato: "",
    objetosDelContrato: ["Servicios Gastronómicos", "Reparación de equipos", "Compraventa de mercancías", "Hospedaje", "Reparación y Mantenimiento Constructivo", "Servicios Especializado", "Servicios Técnicos", "Transportación", "Telefonía", "Otros"],

    chartOptions: {
        legend: {
            showForSingleSeries: true
        },
        stroke: {
            show: true,
            width: 5,
            colors: ['transparent']
        },
        chart: {
            id: "basic-bar",
            animations: {
                speed: 500
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['black']
            },
        },
        colors: ['#005aa8', '#0022ff'],
        xaxis: {
            categories: [],
            labels: {
                maxHeight: 500,
            }
        },
        yaxis: {
            maxValue: 100,
            decimalsInFloat: 2
        }
    },
    series: [
        {
            name: "Contratos vigentes",
            data: [],
        }
    ]
})

onMounted(() => {
})

function getContratosActivos(params) {
    let proveedor = [0, 0, 0, 0, 0]
    let contrato = [0, 0, 0]
    let objeto = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    api
        .get("/contracts?populate=%2A&sort[0]=vencimiento%3Aasc", authorization)
        .then(function (response) {
            const temp = response.data.data
            for (let index = 0; index < temp.length; index++) {
                let date = new Date(temp[index].attributes.vencimiento)
                let diference = Math.ceil((date - state.actualDate) / (1000 * 3600 * 24))
                if (diference > 0 && state.opcion == 'opcion1') {
                    state.titulo = "Cantidad de contratos vigentes por tipo de proveedor"
                    state.tipoProveedores.find((element, pos) => {
                        if (element == temp[index].attributes.tipoProveedor) {
                            proveedor[pos] = proveedor[pos] + 1
                        }
                    })
                }
                if (diference > 0 && state.opcion == 'opcion2') {
                    state.titulo = "Cantidad de contratos vigentes por tipo de contrato"
                    state.tipoContratos.find((element, pos) => {
                        if (element == temp[index].attributes.tipoContrato) {
                            contrato[pos] = contrato[pos] + 1
                        }
                    })
                }
                if (diference > 0 && state.opcion == 'opcion3') {
                    state.titulo = "Cantidad de contratos vigentes por tipo de objeto"
                    state.objetosDelContrato.find((element, pos) => {
                        if (element == temp[index].attributes.objetoContrato) {
                            objeto[pos] = objeto[pos] + 1
                        }
                    })
                }
            }
            if (state.opcion == 'opcion1') {
                state.chartOptions = {
                    xaxis: {
                        categories: state.tipoProveedores
                    }
                };
                state.series = [
                    {
                        name: "Contratos vigentes",
                        data: proveedor,
                    }
                ]
            }
            if (state.opcion == 'opcion2') {
                state.chartOptions = {
                    xaxis: {
                        categories: state.tipoContratos
                    }
                };
                state.series = [
                    {
                        name: "Contratos vigentes",
                        data: contrato,
                    }
                ]
            }
            if (state.opcion == 'opcion3') {
                state.chartOptions = {
                    xaxis: {
                        categories: state.objetosDelContrato
                    }
                };
                state.series = [
                    {
                        name: "Contratos vigentes",
                        data: objeto,
                    }
                ]
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function filterContractos(params) {
    switch (state.opcion) {
        case "opcion1": {

            break;
        }
        case "opcion2": {

            break;
        }
        case "opcion3": {

            break;
        }
        case "opcion4": {

            break;
        }
        default:
            break;
    }
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
    /* background-color: rgb(232, 242, 255); */
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

.my-card {
    width: 100%;
    max-width: 250px
}


.page:has(.printChart) {
    background: #ffffff;
    height: 100vh;
}
</style>