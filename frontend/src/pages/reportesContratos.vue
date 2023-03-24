<template>
    <div class="container row items-start justify-center">
        <q-table class="my-sticky-header-table" style="width: 90%; margin-top: 50px;" title="Plan de medidas" dense
            :rows="state.rows" :columns="state.columns" v-model:pagination="pagination" wrap-cells>
            <template v-slot:top>
                <div style="width: 100%;" class="row justify-between">
                    <div class="col-1 text-h6">
                        <q-btn flat label="Contratos" class="col  q-pa-xs" />
                    </div>
                    <div class="col-3">
                        <q-select class="text-black q-pa-xs" dense outlined v-model="state.opcion" :options="state.opciones"
                            label="Busqueda por:">
                            <template v-slot:after>
                                <q-btn round dense flat icon="refresh"
                                    @click="state.columns = columnsProveedor; state.opcion = ''; state.rows = state.oiginalRows">
                                    <q-tooltip class="bg-primary">
                                        Reiniciar busqueda
                                    </q-tooltip>

                                </q-btn>
                            </template>
                        </q-select>
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'No Proveedor'">
                        <q-input filled dense v-model="state.noProveedor" label="No Proveedor" class="col-2" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Empresa'">
                        <q-select class="col-6" use-input input-debounce="0" dense filled v-model="state.empresa"
                            :options="state.empresas" @filter="filterEmpresa" label="Empresa">
                        </q-select>
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Suplementos por contrato'">
                        <q-input filled dense v-model="state.noProveedorSup" label="No Proveedor" class="col-2" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Especificos por contrato'">
                        <q-input filled dense v-model="state.noProveedorSup" label="No Proveedor" class="col-2" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Suplementos por especifico'">
                        <q-input filled dense v-model="state.noProveedorSup" label="No de especifico" class="col-2" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Clasificacion de contrato'">
                        <q-select filled dense v-model="state.clasificacionContrato" :options="state.clasificacionContratos"
                            label="Clasificacion del contrato" class="col-3" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Tipo de proveedor'">
                        <q-select filled dense v-model="state.tipoProveedor" :options="state.tipoProveedores"
                            label="Tipo de Proveedor" class="col-3" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Tipo de contrato'">
                        <q-select filled dense v-model="state.tipoContrato" :options="state.tipoContratos"
                            label="Tipo de contrato" class="col-2" />
                    </div>
                    <div class="col-2 q-pa-xs" v-if="state.opcion == 'Tipo de objeto'">
                        <q-select filled dense v-model="state.objetoDelContrato" :options="state.objetosDelContrato"
                            label="Objeto del contrato" class="col-3" />
                    </div>
                    <div class="col-3 q-pa-xs" v-if="state.opcion == 'Fecha de firma'">
                        <div class="row">
                            <q-input v-model="state.firmaI" filled dense type="date" hint="Desde" class="q-mr-md col" />
                            <q-input v-model="state.firmaF" filled dense type="date" hint="Hasta" class="q-mr-md col" />
                        </div>
                    </div>
                    <div class="col-3 q-pa-xs" v-if="state.opcion == 'Fecha de vencimiento'">
                        <div class="row">
                            <q-input v-model="state.vigenciaI" filled dense type="date" hint="Desde" class="q-mr-md col" />
                            <q-input v-model="state.vigenciaF" filled dense type="date" hint="Hasta" class="q-mr-md col" />
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="row justify-start">
                            <q-btn flat round color="secondary" icon="search" class="text-black q-mr-xs"
                                @click="filterContractos()" />
                            <q-btn color="primary" icon-right="archive" label="Exportar a Ecxel" no-caps
                                @click="exportTable" />

                        </div>
                    </div>
                </div>
            </template>
        </q-table>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
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

const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 17,
});

const columnsProveedor = [
    {
        name: "No",
        required: true,
        align: "center",
        label: "No Proveedor",
        field: "No",
        sortable: true,
    },
    {
        name: "empresa",
        align: "center",
        label: "Empresa",
        field: "empresa",
        sortable: true,
    },
    {
        name: "clasContrato",
        align: "center",
        label: "Clasificacion de contrato",
        field: "clasContrato",
        sortable: true,
    },
    {
        name: "tipoProveedor",
        align: "center",
        label: "Tipo de proveedor",
        field: "tipoProveedor",
        sortable: true,
    },
    {
        name: "dictLegal",
        align: "center",
        label: "Dictamen legal",
        field: "dictLegal",
        sortable: true,
    },
    {
        name: "acta",
        align: "center",
        label: "Acta",
        field: "acta",
        sortable: true,
    },
    {
        name: "objetoContrato",
        align: "center",
        label: "Objeto del contrato",
        field: "objetoContrato",
        sortable: true,
    },
    {
        name: "tipoContrato",
        align: "center",
        label: "Tipo del contrato",
        field: "tipoContrato",
        sortable: true,
    },
    {
        name: "importeContrato",
        align: "center",
        label: "Importe del contrato",
        field: "importeContrato",
        sortable: true,
    },
    {
        name: "firma",
        align: "center",
        label: "Fecha de firma",
        field: "firma",
        sortable: true,
    },
    {
        name: "vencimiento",
        align: "center",
        label: "Fecha de vencimiento",
        field: "vencimiento",
        sortable: true,
    },
    {
        name: "cantidadEspecificos",
        align: "center",
        label: "Cantidad de especificos",
        field: "cantidadEspecificos",
        sortable: true,
    },
    {
        name: "cantidadSuplementos",
        align: "center",
        label: "Cantidad de suplementos",
        field: "cantidadSuplementos",
        sortable: true,
    }
];

const columnsEspecifico = [
    {
        name: "No",
        required: true,
        align: "center",
        label: "No Especifico",
        field: "No",
        sortable: true,
    },
    {
        name: "clasContrato",
        align: "center",
        label: "Clasificacion de contrato",
        field: "clasContrato",
        sortable: true,
    },
    {
        name: "tipoProveedor",
        align: "center",
        label: "Tipo de proveedor",
        field: "tipoProveedor",
        sortable: true,
    },
    {
        name: "dictLegal",
        align: "center",
        label: "Dictamen legal",
        field: "dictLegal",
        sortable: true,
    },
    {
        name: "acta",
        align: "center",
        label: "Acta",
        field: "acta",
        sortable: true,
    },
    {
        name: "objetoContrato",
        align: "center",
        label: "Objeto del contrato",
        field: "objetoContrato",
        sortable: true,
    },
    {
        name: "tipoContrato",
        align: "center",
        label: "Tipo del contrato",
        field: "tipoContrato",
        sortable: true,
    },
    {
        name: "importeContrato",
        align: "center",
        label: "Importe del contrato",
        field: "importeContrato",
        sortable: true,
    },
    {
        name: "firma",
        align: "center",
        label: "Fecha de firma",
        field: "firma",
        sortable: true,
    },
    {
        name: "vencimiento",
        align: "center",
        label: "Fecha de vencimiento",
        field: "vencimiento",
        sortable: true,
    },
    {
        name: "cantidadSuplementos",
        align: "center",
        label: "Cantidad de suplementos",
        field: "cantidadSuplementos",
        sortable: true,
    }
];

const columnsSuplemento = [
    {
        name: "noContrato",
        align: "center",
        label: "Numero de contrato",
        field: "noContrato",
        sortable: true,
    },
    {
        name: "objetoContrato",
        align: "center",
        label: "Objeto del Suplemento",
        field: "objetoContrato",
        sortable: true,
    },
    {
        name: "importeContrato",
        align: "center",
        label: "Importe del contrato",
        field: "importeContrato",
        sortable: true,
    },
    {
        name: "firma",
        align: "center",
        label: "Fecha de firma",
        field: "firma",
        sortable: true,
    },
    {
        name: "vencimiento",
        align: "center",
        label: "Fecha de vencimiento",
        field: "vencimiento",
        sortable: true,
    }
];

const state = reactive({
    columns: columnsProveedor,
    actualDate: new Date,
    rows: [],
    oiginalRows: [],
    opcion: "",
    opciones: ["No Proveedor", "Empresa", "Especificos por contrato", "Suplementos por especifico", "Suplementos por contrato", "Clasificacion de contrato", "Tipo de proveedor", "Tipo de contrato", "Tipo de objeto", "Fecha de firma", "Fecha de vencimiento"],
    noProveedor: "",
    noProveedorSup: "",
    clasificacionContrato: "",
    clasificacionContratos: ["General", "Marco", "Base permanente"],
    tipoContrato: "",
    tipoContratos: ["Suministro", "Servicio", "Verbales"],
    tipoProveedor: "",
    tipoProveedores: ["TCP", "MIPYME", "CNA", "Empresa Estatal", "Otros"],
    objetoDelContrato: "",
    objetosDelContrato: ["Servicios Gastronómicos", "Reparación de equipos", "Compraventa de mercancías", "Hospedaje", "Reparación y Mantenimiento Constructivo", "Servicios Especializado", "Servicios Técnicos", "Transportación", "Telefonía", "Otros"],
    firmaI: "",
    firmaF: "",
    vigenciaI: "",
    vigenciaF: "",
    contratosActivos: 0,
    empresa: "",
    empresas: [],
    arrEmpresas: [],
    arrEmpresasTemp: [],
})

function wrapCsvValue(val, formatFn, row) {
    let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

    formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

    formatted = formatted.split('"').join('""')
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')

    return `"${formatted}"`
}

function exportTable() {
    // naive encoding to csv format
    const content = [state.columns.map(col => wrapCsvValue(col.label))].concat(
        state.rows.map(row => state.columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
            col.format,
            row
        )).join(','))
    ).join('\r\n')

    const status = exportFile(
        'table-export.xls',
        content,
        'text/csv'
    )

    if (status !== true) {
        $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
        })
    }
}

onMounted(() => {
    getContratosActivos()
    getContratos()
    getEmpresas()
})

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

function getContratosActivos(params) {
    api
        .get("/contracts?populate=%2A&sort[0]=vencimiento%3Aasc", authorization)
        .then(function (response) {
            console.log("🚀 ~ file: reportesContratos.vue:138 ~ response:", response)
            const data = response.data.data
            for (let index = 0; index < data.length; index++) {
                let date = new Date(data[index].attributes.vencimiento)
                let diference = Math.ceil((date - state.actualDate) / (1000 * 3600 * 24))
                if (diference > 0) {
                    state.contratosActivos++
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

function getContratos(params) {
    api
        .get("/contracts?populate[0]=suplements&populate[1]=especificos.suplements&populate[2]=empresa&sort[0]=vencimiento%3Aasc", authorization)
        .then(function (response) {
            console.log("🚀 ~ file: reportesContratos.vue:138 ~ response:", response)
            const data = response.data.data
            for (let index = 0; index < data.length; index++) {
                state.oiginalRows.push({
                    id: data[index].id,
                    No: data[index].attributes.numProveedor,
                    clasContrato: data[index].attributes.clasificacionContrato,
                    tipoProveedor: data[index].attributes.tipoProveedor,
                    dictLegal: data[index].attributes.dictamenLegal,
                    acta: data[index].attributes.acta,
                    objetoContrato: data[index].attributes.objetoContrato,
                    tipoContrato: data[index].attributes.tipoContrato,
                    importeContrato: data[index].attributes.valor,
                    firma: data[index].attributes.firma,
                    vencimiento: data[index].attributes.vencimiento,
                    cantidadSuplementos: data[index].attributes.suplements.data.length,
                    cantidadEspecificos: data[index].attributes.especificos.data.length,
                    suplementos: data[index].attributes.suplements.data,
                    especificos: data[index].attributes.especificos.data,
                    empresa: response.data.data[index].attributes.empresa.data.attributes.nombre + ", " + response.data.data[index].attributes.empresa.data.attributes.sucursal
                })

            }
            state.rows = state.oiginalRows
            contratosPorTerminar(state.rows)
        })
        .catch(function (error) {
            console.log(error);
        });

}

function contratosPorTerminar(params) {
    let countVencidos = 0
    let countPorVencer = 0
    let date1 = new Date()
    params.forEach(element => {
        let date = new Date(element.vencimiento)
        let diference = Math.ceil((date - date1) / (1000 * 3600 * 24))
        console.log(diference);
        if (diference < 7 && diference > 0) countPorVencer++
        if (diference <= 0) countVencidos++
    });
    if (countPorVencer > 0) {
        alertRules.alerts[2].message = "Contratos que estan por vencer: " + countPorVencer
        $q.notify(alertRules.alerts[2]);
    }
    if (countVencidos > 0) {
        alertRules.alerts[0].message = "Contratos vencidos: " + countVencidos
        $q.notify(alertRules.alerts[0]);
    }
}

function filterContractos() {
    switch (state.opcion) {
        case "No Proveedor": {
            getNoProv()
            break;
        }
        case "Empresa": {
            getEmpresa()
            break;
        }
        case "Especificos por contrato": {
            getEspecContrato()
            break;
        }
        case "Suplementos por contrato": {
            getSupContrato()
            break;
        }
        case "Suplementos por especifico": {
            getSupEspec()
            break;
        }
        case "Clasificacion de contrato": {
            getClasificacion()
            break;
        }
        case "Tipo de proveedor": {
            tipoProveedor()
            break;
        }
        case "Tipo de contrato": {
            tipoContrato()
            break;
        }
        case "Tipo de objeto": {
            tipoObjeto()
            break;
        }
        case "Fecha de firma": {
            fecha()
            break;
        }
        case "Fecha de vencimiento": {
            vencimiento()
            break;
        }
        default:
            break;
    }
}

function getEspecContrato(params) {
    state.columns = columnsEspecifico
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.No == state.noProveedorSup) {
            for (let index = 0; index < element.especificos.length; index++) {
                console.log(element.especificos[index]);
                state.rows.push({
                    id: element.especificos[index].id,
                    No: element.especificos[index].attributes.numProveedor,
                    clasContrato: element.especificos[index].attributes.clasificacionContrato,
                    tipoProveedor: element.especificos[index].attributes.tipoProveedor,
                    dictLegal: element.especificos[index].attributes.dictamenLegal,
                    acta: element.especificos[index].attributes.acta,
                    objetoContrato: element.especificos[index].attributes.objetoContrato,
                    tipoContrato: element.especificos[index].attributes.tipoContrato,
                    importeContrato: element.especificos[index].attributes.valor,
                    firma: element.especificos[index].attributes.firma,
                    vencimiento: element.especificos[index].attributes.vencimiento,
                    cantidadSuplementos: element.especificos[index].attributes.suplements.data.length,
                    suplementos: element.especificos[index].attributes.suplements.data
                })
                
            }
        }
    });
}

function getNoProv(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.No == state.noProveedor) state.rows.push(element)
    });
}

function getEmpresa(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.empresa == state.empresa) state.rows.push(element)
    });
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

function getSupContrato(params) {
    state.columns = columnsSuplemento
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.No == state.noProveedorSup) {
            for (let index = 0; index < element.suplementos.length; index++) {
                state.rows.push({
                    id: element.suplementos[index].id,
                    noContrato: element.suplementos[index].attributes.noContrato,
                    importeContrato: element.suplementos[index].attributes.valor,
                    firma: element.suplementos[index].attributes.firma,
                    vencimiento: element.suplementos[index].attributes.vencimiento,
                    objetoContrato: element.suplementos[index].attributes.objetoContrato
                })
            }
        }
    });
}

function getSupEspec(params) {
    state.columns = columnsSuplemento
    state.rows = []
    state.oiginalRows.forEach(element => {
        console.log(element.especificos.length);
        for (let index = 0; index < element.especificos.length; index++) {
            if (element.especificos[index].attributes.numProveedor == state.noProveedorSup) {
                for (let j = 0; j < element.especificos[index].attributes.suplements.data.length; j++) {
                state.rows.push({
                    id: element.especificos[index].attributes.suplements.data[j].id,
                    noContrato: element.especificos[index].attributes.suplements.data[j].attributes.noContrato,
                    importeContrato:element.especificos[index].attributes.suplements.data[j].attributes.valor,
                    firma: element.especificos[index].attributes.suplements.data[j].attributes.firma,
                    vencimiento: element.especificos[index].attributes.suplements.data[j].attributes.vencimiento,
                    objetoContrato: element.especificos[index].attributes.suplements.data[j].attributes.objetoContrato
                })
            }
            }
        }
    });
}

function getClasificacion(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.clasContrato == state.clasificacionContrato) state.rows.push(element)
    });
}

function tipoProveedor(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.tipoProveedor == state.tipoProveedor) state.rows.push(element)
    });
}

function tipoContrato(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.tipoContrato == state.tipoContrato) state.rows.push(element)
    });
}

function tipoObjeto(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.objetoContrato == state.objetoDelContrato) state.rows.push(element)
    });
}

function fecha(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        let firma = new Date(element.firma)
        let start = new Date(state.firmaI)
        let end = new Date(state.firmaF)
        if (start <= firma && end >= firma) state.rows.push(element)
    });
}

function vencimiento(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        let vencimiento = new Date(element.vencimiento)
        let start = new Date(state.vigenciaI)
        let end = new Date(state.vigenciaF)
        if (start <= vencimiento && end >= vencimiento) state.rows.push(element)
    });
}
</script>

<style scoped>
.container {
    background: #005AA7;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #ffffff, #005AA7);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #ffffff, #005AA7);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    height: 100vh;
}
</style>>