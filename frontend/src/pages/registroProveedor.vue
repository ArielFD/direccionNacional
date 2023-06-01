<template>
    <div class="container row items-start justify-center">
        <q-card class="q-ma-md bg-seconday" bordered style="width: 90%; margin-top: 50px">
            <q-card-section>
                <q-table title="Plan de medidas" dense :rows="state.rows" :columns="columnsProveedor"
                    v-model:pagination="pagination" wrap-cells selection="single" v-model:selected="selected">
                    <template v-slot:top>
                        <div style="width: 100%;" class="row justify-between">
                            <div class="col text-h6">
                                <q-btn flat label="Proveedores" class="col  q-pa-xs" />
                            </div>
                            <div class="col text-h6" style="max-width: 175px;">
                                <q-btn color="primary" icon-right="archive" label="Exportar a Ecxel" no-caps
                                        @click="exportTable" />
                            </div>
                        </div>
                    </template>
                </q-table>
                <div class="row justify-end q-mt-md">
                    <q-btn color="primary" label="Agregar" no-caps @click="state.addCard = true" class="q-mr-md" />
                    <q-btn color="primary" label="Editar" no-caps @click="state.editCard = true; state.noEdit=selected[0].No; state.nombreEdit=selected[0].nombre" class="q-mr-md" />
                    <q-btn color="primary" label="Eliminar" no-caps @click="eliminar" />
                </div>
                <q-dialog v-model="state.editCard">
                    <div class="contract col-12">
                        <q-card class="q-pa-md">
                            <div class="row justify-center">
                                <div class="col-12 row justify-center">
                                    <h5 class="text-weight-bolder">Editar Proveedor</h5>
                                </div>
                            </div>
                            <q-separator class="q-mt-xs bg-primary" />
                            <form @submit.prevent.stop="onEdit">
                                <div>
                                    <div class="row q-ma-md justify-between ">
                                        <q-input filled dense v-model="state.noEdit" label="Numero" class="col-3"
                                            lazy-rules :rules="alertRules.emailRules" ref="no" />
                                        <q-input filled dense v-model="state.nombreEdit" label="Nombre"
                                            class="col-7 q-ml-md q-mr-md" lazy-rules :rules="alertRules.emailRules"
                                            ref="nombre" />
                                    </div>
                                    <div class="row q-ma-md justify-between relative">
                                        <div class="absolute-bottom-right q-ma-lg">
                                            <q-btn color="primary" label="Aceptar" type="submit" />
                                            <!-- @click="crearRegistro"  -->
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </q-card>
                    </div>
                </q-dialog>
                <q-dialog v-model="state.addCard">
                    <div class="contract col-12">
                        <q-card class="q-pa-md">
                            <div class="row justify-center">
                                <div class="col-12 row justify-center">
                                    <h5 class="text-weight-bolder">Crear Proveedor</h5>
                                </div>
                            </div>
                            <q-separator class="q-mt-xs bg-primary" />
                            <form @submit.prevent.stop="onCreate">
                                <div>
                                    <div class="row q-ma-md justify-between ">
                                        <q-input filled dense v-model="state.no" label="Numero" class="col-3" lazy-rules
                                            :rules="alertRules.emailRules" ref="no" />
                                        <q-input filled dense v-model="state.nombre" label="Nombre"
                                            class="col-7 q-ml-md q-mr-md" lazy-rules :rules="alertRules.emailRules"
                                            ref="nombre" />
                                    </div>
                                    <div class="row q-ma-md justify-between relative">
                                        <div class="absolute-bottom-right q-ma-lg">
                                            <q-btn color="primary" label="Aceptar" type="submit" />
                                            <!-- @click="crearRegistro"  -->
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </q-card>
                    </div>
                </q-dialog>
            </q-card-section>

        </q-card>

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
const selected = ref([])

const no = ref(null);
const nombre = ref(null);

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
        name: "nombre",
        align: "center",
        label: "Nombre Proveedor",
        field: "nombre",
        sortable: true,
    },
];

const state = reactive({
    no: "",
    nombre: "",
    noEdit: "",
    nombreEdit: "",

    columns: columnsProveedor,
    rows: [],

    editCard: false,
    addCard: false
})

onMounted(() => {
    getProveedores()
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
    //console.log(state.oiginalRows, state.especificos, state.especificos, state.suplementos);
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
        'table-export.xlsx',
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

function getProveedores(params) {
    state.rows = []
    api
        .get(`/proveedors`, authorization)
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                state.rows.push({
                    id: response.data.data[i].id,
                    No: response.data.data[i].attributes.numero,
                    nombre: response.data.data[i].attributes.nombre
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
}

function onCreate(params) {
    no.value.validate();
    nombre.value.validate();

    if (no.value.hasError || nombre.value.hasError) {
        alertRules.alerts[0].message = "Campos obligatorios";
        $q.notify(alertRules.alerts[0]);
    } else {
        crear();
    }
}

function onEdit(params) {
    no.value.validate();
    nombre.value.validate();

    if (no.value.hasError || nombre.value.hasError) {
        alertRules.alerts[0].message = "Campos obligatorios";
        $q.notify(alertRules.alerts[0]);
    } else {
        editar();
    }
}

function crear(params) {
    const dataRest = {
        data: {
            numero: state.no,
            nombre: state.nombre
        }
    }

    api
        .post(`/proveedors`, dataRest, authorization)
        .then(function (response) {
            console.log(response);
            state.addCard = false
            getProveedores()
            state.no = ""
            state.nombre = ""
            alertRules.alerts[1].message = "Proveedor agregado";
            $q.notify(alertRules.alerts[1]);
        }).catch(function (error) {
            console.log(error);
            alertRules.alerts[0].message = "Error al agregar el proveedor";
            $q.notify(alertRules.alerts[0]);
        });
}

function editar(params) {
    const dataRest = {
        data: {
            numero: state.noEdit,
            nombre: state.nombreEdit
        }
    }

    api
        .put(`/proveedors/${selected.value[0].id}`, dataRest, authorization)
        .then(function (response) {
            console.log(response);
            state.editCard=false
            getProveedores()
            selected.value=[]
            alertRules.alerts[1].message = "Proveedor editado";
            $q.notify(alertRules.alerts[1]);
        }).catch(function (error) {
            console.log(error);
            alertRules.alerts[1].message = "Error al editar el proveedor";
            $q.notify(alertRules.alerts[1]);
        });
}

function eliminar(params) {
    api
        .delete(`/proveedors/${selected.value[0].id}`, authorization)
        .then(function (response) {
            console.log(response);
            selected.value=[]
            getProveedores()
            alertRules.alerts[1].message = "Proveedor eliminado";
            $q.notify(alertRules.alerts[1]);
        }).catch(function (error) {
            console.log(error);
            alertRules.alerts[1].message = "Error al eliminar el proveedor";
            $q.notify(alertRules.alerts[1]);
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