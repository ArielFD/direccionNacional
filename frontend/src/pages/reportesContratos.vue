<template>
    <div class="container row items-start justify-center">
        <q-card class="q-ma-md bg-seconday" bordered style="width: 90%; margin-top: 50px;">
            <q-card-section>
                <q-table title="Plan de medidas" dense :rows="state.rows" :columns="state.columns"
                    v-model:pagination="pagination" wrap-cells selection="single"
                    v-model:selected="selected">
                    <template v-slot:top>
                        <div style="width: 100%;" class="row justify-between">
                            <div class="col-1 text-h6">
                                <q-btn flat label="Contratos" class="col  q-pa-xs" />
                            </div>
                            <div class="col-3">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="state.opcion"
                                    :options="state.opciones" label="Busqueda por:">
                                    <template v-slot:after>
                                        <q-btn round dense flat icon="refresh"
                                            @click="state.columns = columnsProveedor; state.opcion = ''; state.rows = state.oiginalRows; ">
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
                            <div class="col-2 q-pa-xs" v-if="state.opcion == 'Nombre Proveedor'">
                                <q-input filled dense v-model="state.nombreProveedor" label="Nombre Proveedor" class="col-2" />
                            </div>
                            <div class="col-2 q-pa-xs" v-if="state.opcion == 'No Proveedor Especifico'">
                                <q-input filled dense v-model="state.noProveedorEspec" label="No Proveedor Especifico"
                                    class="col-2" />
                            </div>
                            <div class="col-2 q-pa-xs" v-if="state.opcion == 'No Suplemento'">
                                <q-input filled dense v-model="state.noSuplemento" label="No Suplemento" class="col-2" />
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
                                <q-input filled dense v-model="state.noProveedorSup" label="No de especifico"
                                    class="col-2" />
                            </div>
                            <div class="col-2 q-pa-xs" v-if="state.opcion == 'Clasificacion de contrato'">
                                <q-select filled dense v-model="state.clasificacionContrato"
                                    :options="state.clasificacionContratos" label="Clasificacion del contrato"
                                    class="col-3" />
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
                                    <q-input v-model="state.firmaI" filled dense type="date" hint="Desde"
                                        class="q-mr-md col" />
                                    <q-input v-model="state.firmaF" filled dense type="date" hint="Hasta"
                                        class="q-mr-md col" />
                                </div>
                            </div>
                            <div class="col-3 q-pa-xs" v-if="state.opcion == 'Fecha de vencimiento'">
                                <div class="row">
                                    <q-input v-model="state.vigenciaI" filled dense type="date" hint="Desde"
                                        class="q-mr-md col" />
                                    <q-input v-model="state.vigenciaF" filled dense type="date" hint="Hasta"
                                        class="q-mr-md col" />
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
                <div class="row justify-end q-mt-md">
                    <q-btn color="primary" label="Editar" no-caps @click="state.editCard = true" class="q-mr-md" />
                    <q-btn color="primary" label="Eliminar" no-caps @click="eliminar" />
                </div>
                <q-dialog v-model="state.editCard">
                    <div class="contract col-12">
                        <q-card class="q-pa-md" v-if="state.columns[0].label == 'No Proveedor'">
                            <div class="row justify-center">
                                <div class="col-12 row justify-center">
                                    <h5 class="text-weight-bolder">Edicion de Contrato</h5>
                                </div>
                            </div>
                            <q-separator class="q-mt-xs bg-primary" />
                            <div>
                                <div class="row q-ma-md justify-between ">
                                    <q-input filled dense v-model="selected[0].No" label="No Proveedor" class="col-2"
                                        mask="##-###-###" hint="##-###-###" ref="numProveedor" lazy-rules
                                        :rules="alertRules.emailRules"  />
                                        <q-input filled dense v-model="selected[0].numCliente" label="No Cliente" class="col q-ml-md q-mr-md" />
                                    <q-select filled dense v-model="selected[0].clasContrato"
                                        :options="state.clasificacionContratos" label="Clasificacion del contrato"
                                        class="col-3 q-mr-md" />
                                    <q-select filled dense v-model="selected[0].tipoContrato"
                                        :options="state.tipoContratos" label="Tipo de contrato" class="q-mr-md col-2" />
                                    <q-select filled dense v-model="selected[0].tipoProveedor"
                                        :options="state.tipoProveedores" label="Tipo de Proveedor" class="col-3" />
                                </div>
                                <div class="row q-ma-md justify-between ">
                                    <q-select class="col-6" use-input input-debounce="0" dense filled
                                        v-model="selected[0].empresa" :options="state.arrEmpresas" @filter="filterEmpresa"
                                        label="Empresa">
                                    </q-select>
                                    <q-input filled dense v-model="selected[0].organismo" label="Organismo" class="col-2 q-ml-xl" />
                                </div>
                                <div class="row q-ma-md justify-between">
                                    <q-input filled dense v-model="selected[0].domicilio" autogrow
                                        label="Con domicilio legal en:" class="q-mr-md col-6" />
                                    <q-input filled dense v-model="selected[0].reeup" label="Codigo REEUP"
                                        class="q-mr-md col-2" v-if="state.tipoProveedor == 'Empresa Estatal'"
                                        mask="###.#.#######" hint="###.#.#######" />
                                    <q-input filled dense v-model="selected[0].reeup" label="Licencia"
                                        class="q-mr-md col-2" v-if="state.tipoProveedor != 'Empresa Estatal'" />
                                    <q-input filled dense v-model="selected[0].nit" label="Codigo NIT" class="col-2"
                                        mask="###########" hint="###########" />
                                </div>
                                <div class="row q-ma-md justify-between">
                                    <q-input filled dense v-model="selected[0].cuentaBancaria" label="Cuenta Bancaria"
                                        class="q-mr-md col-3" mask="####-####-####-####" hint="####-####-####-####" />
                                    <q-input filled dense v-model="selected[0].titular" label="Titular" class="col-8" />
                                </div>
                                <div class="row q-ma-md justify-between">
                                    <q-input filled dense v-model="selected[0].agenciaBancaria" label="Agencia Bancaria"
                                        class="col-2" mask="####" hint="####" />
                                    <q-select filled dense v-model="selected[0].banco" :options="state.bancos"
                                        label="Banco" class="col-3" />
                                    <q-select filled dense v-model="selected[0].objetoContrato"
                                        :options="state.objetosDelContrato" label="Objeto del contrato" class="col-5" />
                                </div>
                                <div class="row q-ma-md justify-between">
                                    <q-input filled dense v-model="selected[0].bancoSitio" autogrow
                                        label="Direccion del banco" class="q-mr-md col-5" />
                                    <q-input filled dense v-model="selected[0].telefono" label="Telefono"
                                        class="q-mr-md col-2" type="tel" mask="# - ### - ####" hint="# - ### - ####" />
                                    <q-input filled dense v-model="selected[0].correo" label="Correo" class="col-4" />
                                </div>
                                <div class="row q-ma-md justify-between">
                                    <q-input filled dense v-model="selected[0].dictLegal" label="Dictamen legal"
                                        class="q-mr-md col-2" mask="###" hint="###" />
                                    <q-input filled dense v-model="selected[0].acta" label="Acta" class="q-mr-md col-1"
                                        mask="###" hint="###" />
                                    <q-input v-model="selected[0].fechaActa" filled dense type="date"
                                        hint="Fecha del Acta" class="q-mr-md col-2" />
                                    <q-input v-model="selected[0].acuerdo" filled dense autogrow label="Acuerdo"
                                        class="col-1" mask="###" hint="###" />
                                    <q-input v-model="selected[0].firma" filled dense type="date" hint="Fecha de firma"
                                        class="q-mr-md col-2" />
                                    <q-input v-model="selected[0].vencimiento" filled dense type="date"
                                        hint="Fecha de vencimiento" class="col-2" />
                                </div>
                                <div class="row q-ma-md justify-around">
                                    <!-- <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" /> -->
                                    <div>
                                        Forma de pago:
                                        <q-checkbox v-model="selected[0].pago" val="Por cheque" label="Por cheque"
                                            color="primary" />
                                        <q-checkbox v-model="selected[0].pago" val="Por cheque certificado"
                                            label="Por cheque certificado" color="primary" />
                                        <q-checkbox v-model="selected[0].pago" val="Por transferencia bancaria"
                                            label="Por transferencia bancaria" color="primary" />
                                        <q-checkbox v-model="selected[0].pago" val="En efectivo" label="En efectivo"
                                            color="primary" />
                                        <q-checkbox v-model="selected[0].pago" val="Otros" label="Otros"
                                            color="primary" />
                                    </div>
                                    <q-input filled dense v-model="selected[0].importeContrato" type="number"
                                        label="Valor del contrato" class=" col-2" />
                                </div>
                                <div class="row q-ma-md justify-between relative">
                                    <div class="col-6">
                                        <q-input v-model="selected[0].observaciones" filled dense autogrow
                                            label="Observaciones" />
                                    </div>
                                    <div class="absolute-bottom-right q-ma-lg">
                                        <q-btn color="primary" label="Aceptar" @click="editar" v-close-popup />
                                        <!-- @click="crearRegistro"  -->
                                    </div>
                                </div>
                            </div>
                        </q-card>
                        <q-card class="q-pa-md" v-if="state.columns[0].label == 'Numero de contrato'">
                            <div class="row justify-center">
                                <h5 class="text-weight-bolder">Edicion de Suplemento</h5>
                            </div>
                            <q-separator class="q-mt-xs bg-primary" />
                            <div class="row q-ma-md justify-start ">
                                <q-input filled dense v-model="selected[0].noContrato" label="No Suplemento" 
                                    class="q-mr-md col-2" ref="numContrato" lazy-rules :rules="alertRules.emailRules" />
                                    <q-input filled dense v-model="selected[0].numCliente" label="No Cliente" class="col q-ml-md q-mr-md" />
                                <q-select filled dense v-model="selected[0].tipoContrato" :options="state.tipoContratos"
                                    label="Tipo de contrato" class="q-mr-md col-2" />
                                <q-select filled dense v-model="selected[0].objetoContrato"
                                    :options="state.objetosDelContrato" label="Objeto del Suplemento" class="col-4" />
                            </div>
                            <div class="row q-ma-md justify-between">
                                <q-input filled dense v-model="selected[0].dictLegal" label="Dictamen legal"
                                    class="q-mr-md col-2" mask="###" hint="###" />
                                <q-input filled dense v-model="selected[0].acta" label="Acta" class="q-mr-md col-1"
                                    mask="###" hint="###" />
                                <q-input v-model="selected[0].fechaActa" filled dense type="date" hint="Fecha del Acta"
                                    class="q-mr-md col-2" />
                                <q-input v-model="selected[0].acuerdo" filled dense autogrow label="Acuerdo" class="col-1"
                                    mask="###" hint="###" />
                                <q-input v-model="selected[0].firma" filled dense type="date" hint="Fecha de firma"
                                    class="q-mr-md col-2" />
                                <q-input v-model="selected[0].vencimiento" filled dense type="date"
                                    hint="Fecha de vencimiento" class="col-2" />
                            </div>
                            <div class="row q-ma-md justify-around">
                                <!-- <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" /> -->
                                <div>
                                    Forma de pago:
                                    <q-checkbox v-model="selected[0].pago" val="Por cheque" label="Por cheque"
                                        color="primary" />
                                    <q-checkbox v-model="selected[0].pago" val="Por cheque certificado"
                                        label="Por cheque certificado" color="primary" />
                                    <q-checkbox v-model="selected[0].pago" val="Por transferencia bancaria"
                                        label="Por transferencia bancaria" color="primary" />
                                    <q-checkbox v-model="selected[0].pago" val="En efectivo" label="En efectivo"
                                        color="primary" />
                                    <q-checkbox v-model="selected[0].pago" val="Otros" label="Otros" color="primary" />
                                </div>
                                <q-input filled dense v-model="selected[0].importeContrato" type="number"
                                    label="Valor del contrato" class=" col-1" />
                                <q-btn color="primary" label="Aceptar" @click="editar" v-close-popup />
                            </div>

                        </q-card>
                        <div class="contract col-12">
                            <q-card class="q-pa-md" v-if="state.columns[0].label == 'No Especifico'">
                                <div class="row justify-center">
                                    <h5 class="text-weight-bolder">Edicion de Contrato Especifico</h5>
                                </div>
                                <q-separator class="q-mt-xs bg-primary" />
                                <div>
                                    <div class="row q-ma-md justify-between ">
                                        <q-input filled dense v-model="selected[0].No" label="No Proveedor" class="col-2"
                                            mask="##-###-###-###" hint="##-###-###-###" ref="numProveedor"
                                            lazy-rules :rules="alertRules.emailRules"  />
                                            <q-input filled dense v-model="selected[0].numCliente" label="No Cliente" class="col q-ml-md q-mr-md" />
                                        <q-select filled dense v-model="selected[0].clasContrato"
                                            :options="state.clasificacionContratos" label="Clasificacion del contrato"
                                            class="col-3 q-mr-md" />
                                        <q-select filled dense v-model="selected[0].tipoContrato"
                                            :options="state.tipoContratos" label="Tipo de contrato" class="q-mr-md col-2" />
                                        <q-select filled dense v-model="selected[0].tipoProveedor"
                                            :options="state.tipoProveedores" label="Tipo de Proveedor" class="col-3" />
                                    </div>
                                    <div class="row q-ma-md justify-between ">
                                        <q-select class="col-6" use-input input-debounce="0" dense filled
                                            v-model="selected[0].empresa" :options="state.arrEmpresas"
                                            @filter="filterEmpresa" label="Empresa">
                                        </q-select>
                                        <q-input filled dense v-model="selected[0].organismo" label="Organismo" class="col-2 q-ml-xl" />
                                    </div>
                                    <div class="row q-ma-md justify-between">
                                        <q-input filled dense v-model="selected[0].domicilio" autogrow
                                            label="Con domicilio legal en:" class="q-mr-md col-6" />
                                        <q-input filled dense v-model="selected[0].reeup" label="Codigo REEUP"
                                            class="q-mr-md col-2" v-if="state.tipoProveedor == 'Empresa Estatal'"
                                            mask="###.#.#######" hint="###.#.#######" />
                                        <q-input filled dense v-model="selected[0].reeup" label="Licencia"
                                            class="q-mr-md col-2" v-if="state.tipoProveedor != 'Empresa Estatal'" />
                                        <q-input filled dense v-model="selected[0].nit" label="Codigo NIT" class="col-2"
                                            mask="###########" hint="###########" />
                                    </div>
                                    <div class="row q-ma-md justify-between">
                                        <q-input filled dense v-model="selected[0].cuentaBancaria" label="Cuenta Bancaria"
                                            class="q-mr-md col-3" mask="####-####-####-####" hint="####-####-####-####" />
                                        <q-input filled dense v-model="selected[0].titular" label="Titular"
                                            class="col-8" />
                                    </div>
                                    <div class="row q-ma-md justify-between">
                                        <q-input filled dense v-model="selected[0].agenciaBancaria"
                                            label="Agencia Bancaria" class="col-2" mask="####" hint="####" />
                                        <q-select filled dense v-model="selected[0].banco" :options="state.bancos"
                                            label="Banco" class="col-3" />
                                        <q-select filled dense v-model="selected[0].objetoContrato"
                                            :options="state.objetosDelContrato" label="Objeto del contrato" class="col-5" />
                                    </div>
                                    <div class="row q-ma-md justify-between">
                                        <q-input filled dense v-model="selected[0].bancoSitio" autogrow
                                            label="Direccion del banco" class="q-mr-md col-5" />
                                        <q-input filled dense v-model="selected[0].telefono" label="Telefono"
                                            class="q-mr-md col-2" type="tel" mask="# - ### - ####" hint="# - ### - ####" />
                                        <q-input filled dense v-model="selected[0].correo" label="Correo" class="col-4" />
                                    </div>
                                    <div class="row q-ma-md justify-between">
                                        <q-input filled dense v-model="selected[0].dictLegal" label="Dictamen legal"
                                            class="q-mr-md col-2" mask="###" hint="###" />
                                        <q-input filled dense v-model="selected[0].acta" label="Acta"
                                            class="q-mr-md col-1" mask="###" hint="###" />
                                        <q-input v-model="selected[0].fechaActa" filled dense type="date"
                                            hint="Fecha del Acta" class="q-mr-md col-2" />
                                        <q-input v-model="selected[0].acuerdo" filled dense autogrow label="Acuerdo"
                                            class="col-1" mask="###" hint="###" />
                                        <q-input v-model="selected[0].firma" filled dense type="date"
                                            hint="Fecha de firma" class="q-mr-md col-2" />
                                        <q-input v-model="selected[0].vencimiento" filled dense type="date"
                                            hint="Fecha de vencimiento" class="col-2" />
                                    </div>
                                    <div class="row q-ma-md justify-around">
                                        <!-- <q-select filled dense v-model="state.pago" :options="state.pagos" label="Forma de pago"
                class="q-mr-md col-4" /> -->
                                        <div>
                                            Forma de pago:
                                            <q-checkbox v-model="selected[0].pago" val="Por cheque" label="Por cheque"
                                                color="primary" />
                                            <q-checkbox v-model="selected[0].pago" val="Por cheque certificado"
                                                label="Por cheque certificado" color="primary" />
                                            <q-checkbox v-model="selected[0].pago" val="Por transferencia bancaria"
                                                label="Por transferencia bancaria" color="primary" />
                                            <q-checkbox v-model="selected[0].pago" val="En efectivo" label="En efectivo"
                                                color="primary" />
                                            <q-checkbox v-model="selected[0].pago" val="Otros" label="Otros"
                                                color="primary" />
                                        </div>
                                        <q-input filled dense v-model="selected[0].importeContrato" type="number"
                                            label="Valor del contrato" class=" col-2" />
                                    </div>
                                    <div class="row q-ma-md justify-between relative">
                                        <div class="col-6">
                                            <q-input v-model="selected.observaciones" filled dense autogrow
                                                label="Observaciones" />
                                        </div>
                                        <div class="absolute-bottom-right q-ma-lg">
                                            <q-btn color="primary" label="Aceptar" @click="editar" v-close-popup />
                                            <!-- @click="crearRegistro"  -->
                                        </div>
                                    </div>
                                </div>
                            </q-card>
                        </div>
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
        name: "name",
        required: true,
        align: "center",
        label: "Nombre Proveedor",
        field: "name",
        sortable: true,
    },
    {
        name: "numCliente",
        align: "center",
        label: "noCliente",
        field: "numCliente",
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
        name: "firmaT",
        align: "center",
        label: "Fecha de firma",
        field: "firmaT",
        sortable: true,
    },
    {
        name: "vencimientoT",
        align: "center",
        label: "Fecha de vencimiento",
        field: "vencimientoT",
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
        name: "numCliente",
        align: "center",
        label: "noCliente",
        field: "numCliente",
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
        name: "firmaT",
        align: "center",
        label: "Fecha de firma",
        field: "firmaT",
        sortable: true,
    },
    {
        name: "vencimientoT",
        align: "center",
        label: "Fecha de vencimiento",
        field: "vencimientoT",
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
        name: "numCliente",
        align: "center",
        label: "noCliente",
        field: "numCliente",
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
        name: "firmaT",
        align: "center",
        label: "Fecha de firma",
        field: "firmaT",
        sortable: true,
    },
    {
        name: "vencimientoT",
        align: "center",
        label: "Fecha de vencimiento",
        field: "vencimientoT",
        sortable: true,
    }
];

const state = reactive({
    columns: columnsProveedor,
    actualDate: new Date,
    edicion: false,
    rows: [],
    especificos: [],
    suplementos: [],
    oiginalRows: [],
    opcion: "",
    opciones: ["No Proveedor","Nombre Proveedor", "No Proveedor Especifico", "No Suplemento", "Empresa", "Especificos por contrato", "Suplementos por especifico", "Suplementos por contrato", "Clasificacion de contrato", "Tipo de proveedor", "Tipo de contrato", "Tipo de objeto", "Fecha de firma", "Fecha de vencimiento"],
    noProveedor: "",
    nombreProveedor:"",
    noProveedorEspec: "",
    noSuplemento: "",
    noProveedorSup: "",
    clasificacionContrato: "",
    clasificacionContratos: ["General", "Marco", "Base permanente"],
    tipoContrato: "",
    tipoContratos: ["Suministro", "Servicio", "Verbales"],
    tipoProveedor: "",
    tipoProveedores: ["TCP", "MIPYME", "CNA", "Empresa Estatal", "Otros"],
    objetoDelContrato: "",
    objetosDelContrato: ["Servicios Gastronómicos", "Reparación de equipos", "Compraventa de mercancías", "Hospedaje", "Reparación y Mantenimiento Constructivo", "Servicios Especializado", "Servicios Técnicos", "Transportación", "Telefonía", "Otros"],
    banco: "",
    bancos: ["Metropolitano", "Popular de ahorro", "Credito y Comercio", "BICSA", "BFI"],
    firmaI: "",
    firmaF: "",
    vigenciaI: "",
    vigenciaF: "",
    contratosActivos: 0,
    empresa: "",
    empresas: [],
    arrEmpresas: [],
    arrEmpresasTemp: [],

    editCard: false,
    deleteCard: false
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

onMounted(() => {
    getContratosActivos()
    getContratos()
    getEspecificos()
    getSuplementos()
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
            //console.log("🚀 ~ file: reportesContratos.vue:138 ~ response:", response)
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
            //console.log(error);
        });

}

function getSuplementos(params) {
    state.suplementos = []
    api
        .get("/suplements?", authorization)
        .then(function (response) {
            const data = response.data.data
            for (let index = 0; index < data.length; index++) {
                state.suplementos.push({
                    id: data[index].id,
                    acta: data[index].attributes.acta,
                    numCliente: data[index].attributes.numCliente,
                    acuerdo: data[index].attributes.acuerdo,
                    dictLegal: data[index].attributes.dictamenLegal,
                    fechaActa: data[index].attributes.fechaActa,
                    firma: data[index].attributes.firma,firmaT: data[index].attributes.firma.split('-')[2]+"-"+data[index].attributes.firma.split('-')[1]+"-"+data[index].attributes.firma.split('-')[0],
                    noContrato: data[index].attributes.noContrato,
                    objetoContrato: data[index].attributes.objetoContrato,
                    observaciones: data[index].attributes.observaciones,
                    pago: data[index].attributes.pago.split(", "),
                    tipoContrato: data[index].attributes.tipoContrato,
                    importeContrato: data[index].attributes.valor,
                    vencimiento: data[index].attributes.vencimiento,
                    vencimientoT: data[index].attributes.vencimiento.split('-')[2]+"-"+data[index].attributes.vencimiento.split('-')[1]+"-"+data[index].attributes.vencimiento.split('-')[0],
                })
            }
        })
        .catch(function (error) {
            //console.log(error);
        });
}

function getEspecificos(params) {
    state.especificos = []
    api
        .get("/especificos?populate[0]=empresa&populate[1]=suplements", authorization)
        .then(function (response) {
            const data = response.data.data
            //console.log("🚀 ~ file: reportesContratos.vue:771 ~ data:", data)
            for (let index = 0; index < data.length; index++) {
                state.especificos.push({
                    id: data[index].id,
                    No: data[index].attributes.numProveedor,
                    numCliente: data[index].attributes.numCliente,
                    organismo: data[index].attributes.organismo,
                    acta: data[index].attributes.acta,
                    acuerdo: data[index].attributes.acuerdo,
                    agenciaBancaria: data[index].attributes.agenciaBancaria,
                    banco: data[index].attributes.banco,
                    bancoSitio: data[index].attributes.bancoSitio,
                    clasContrato: data[index].attributes.clasificacionContrato,
                    nit: data[index].attributes.codNIT,
                    reeup: data[index].attributes.codREEUP,
                    correo: data[index].attributes.correo,
                    cuentaBancaria: data[index].attributes.cuentaBancaria,
                    dictLegal: data[index].attributes.dictamenLegal,
                    domicilio: data[index].attributes.domicilioLegal,
                    fechaActa: data[index].attributes.fechaActa,
                    firma: data[index].attributes.firma,
                    firmaT: data[index].attributes.firma.split('-')[2]+"-"+data[index].attributes.firma.split('-')[1]+"-"+data[index].attributes.firma.split('-')[0],
                    objetoContrato: data[index].attributes.objetoContrato,
                    observaciones: data[index].attributes.observaciones,
                    pago: data[index].attributes.pago.split(", "),
                    telefono: data[index].attributes.telefono,
                    tipoContrato: data[index].attributes.tipoContrato,
                    tipoProveedor: data[index].attributes.tipoProveedor,
                    titular: data[index].attributes.titular,
                    importeContrato: data[index].attributes.valor,
                    vencimiento: data[index].attributes.vencimiento,
                    vencimientoT: data[index].attributes.vencimiento.split('-')[2]+"-"+data[index].attributes.vencimiento.split('-')[1]+"-"+data[index].attributes.vencimiento.split('-')[0],
                    cantidadSuplementos: data[index].attributes.suplements.data.length,
                    empresa: data[index].attributes.empresa.data.attributes.nombre + ", " + data[index].attributes.empresa.data.attributes.sucursal
                })
            }
        })
        .catch(function (error) {
            //console.log(error);
        });
}

function getContratos(params) {
    state.oiginalRows = []
    api
        .get("/contracts?populate[0]=suplements&populate[1]=especificos.suplements&populate[2]=empresa&populate[3]=proveedor&sort[0]=vencimiento%3Aasc", authorization)
        .then(function (response) {
            console.log("🚀 ~ file: reportesContratos.vue:138 ~ response:", response)
            const data = response.data.data
            for (let index = 0; index < data.length; index++) {
                //console.log("🚀 ~ file: reportesContratos.vue:813 ~ data:", data[index].attributes.pago)
                if (data[index].attributes.pago == null) data[index].attributes.pago = "Otros"
                state.oiginalRows.push({
                    id: data[index].id,
                    name:data[index].attributes.proveedor.data.attributes.nombre,
                    No: data[index].attributes.numProveedor,
                    numCliente: data[index].attributes.numCliente,
                    organismo:data[index].attributes.organismo,
                    acta: data[index].attributes.acta,
                    acuerdo: data[index].attributes.acuerdo,
                    agenciaBancaria: data[index].attributes.agenciaBancaria,
                    banco: data[index].attributes.banco,
                    bancoSitio: data[index].attributes.bancoSitio,
                    clasContrato: data[index].attributes.clasificacionContrato,
                    nit: data[index].attributes.codNIT,
                    reeup: data[index].attributes.codREEUP,
                    correo: data[index].attributes.correo,
                    cuentaBancaria: data[index].attributes.cuentaBancaria,
                    dictLegal: data[index].attributes.dictamenLegal,
                    domicilio: data[index].attributes.domicilioLegal,
                    fechaActa: data[index].attributes.fechaActa,
                    firma: data[index].attributes.firma,
                    firmaT: data[index].attributes.firma.split('-')[2]+"-"+data[index].attributes.firma.split('-')[1]+"-"+data[index].attributes.firma.split('-')[0],
                    objetoContrato: data[index].attributes.objetoContrato,
                    observaciones: data[index].attributes.observaciones,
                    pago: data[index].attributes.pago.split(", "),
                    telefono: data[index].attributes.telefono,
                    tipoContrato: data[index].attributes.tipoContrato,
                    tipoProveedor: data[index].attributes.tipoProveedor,
                    titular: data[index].attributes.titular,
                    importeContrato: data[index].attributes.valor,
                    vencimiento: data[index].attributes.vencimiento,
                    vencimientoT: data[index].attributes.vencimiento.split('-')[2]+"-"+data[index].attributes.vencimiento.split('-')[1]+"-"+data[index].attributes.vencimiento.split('-')[0],
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
    let rowsPorVencer=[]
    let rowsVencidos=[]
    params.forEach(element => {
        let date = new Date(element.vencimiento)
        let diference = Math.ceil((date - date1) / (1000 * 3600 * 24))
        //console.log(diference);
        if (diference < 7 && diference > 0) {
            rowsPorVencer.push(element)
            countPorVencer++
        }
        if (diference <= 0) {
            rowsVencidos.push(element)
            countVencidos++
        }
    });
    if (countPorVencer > 0) {
        $q.notify({ color: "orange", message: "Contratos que estan por vencer: " + countPorVencer, icon: "warning",actions:[{
            label:"Mostrar",color:'white',handler:()=>{
                state.rows=rowsPorVencer
            }
        }] });
    }
    if (countVencidos > 0) {
        $q.notify({ color: "negative", message: "Contratos vencidos: " + countVencidos, icon: "error",actions:[{
            label:"Mostrar",color:'white',handler:()=>{
                state.rows=rowsVencidos
            }
        }] });
    }
}

function filterContractos() {
    switch (state.opcion) {
        case "No Proveedor": {
            getNoProv()
            break;
        }
        case "Nombre Proveedor": {
            getNombreProv()
            break;
        }
        case "No Proveedor Especifico": {
            getNoProvEspec()
            break;
        }
        case "No Suplemento": {
            getNoSup()
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
                //console.log(element.especificos[index]);
                state.especificos.forEach(elementEsp => {
                    if(element.especificos[index].id==elementEsp.id){
                        state.rows.push(elementEsp)
                    }
                });

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

function getNombreProv(params) {
    state.columns = columnsProveedor
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.name == state.nombreProveedor) state.rows.push(element)
    });
}

function getNoProvEspec(params) {
    state.columns = columnsEspecifico
    state.rows = []
    state.especificos.forEach(element => {
        if (element.No == state.noProveedorEspec) state.rows.push(element)
    });
}

function getNoSup(params) {
    state.columns = columnsSuplemento
    state.rows = []
    state.suplementos.forEach(element => {
        if (element.noContrato == state.noSuplemento) state.rows.push(element)
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
            //console.log("🚀 ~ file: registroContratos.vue:267 ~ response:", response)
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
            //console.log(error);
        });
}

function getSupContrato(params) {
    
    state.columns = columnsSuplemento
    state.rows = []
    state.oiginalRows.forEach(element => {
        if (element.No == state.noProveedorSup) {
            for (let index = 0; index < element.suplementos.length; index++) {
                state.suplementos.forEach(elementEsp => {
                    if(element.suplementos[index].id==elementEsp.id){
                        state.rows.push(elementEsp)
                    }
                });
            }
        }
    });
}

function getSupEspec(params) {
    
    state.columns = columnsSuplemento
    state.rows = []
    state.oiginalRows.forEach(element => {
        //console.log(element.especificos.length);
        for (let index = 0; index < element.especificos.length; index++) {
            if (element.especificos[index].attributes.numProveedor == state.noProveedorSup) {
                for (let j = 0; j < element.especificos[index].attributes.suplements.data.length; j++) {
                    state.suplementos.forEach(elementEsp => {
                    if(element.especificos[index].attributes.suplements.data[j].id==elementEsp.id){
                        state.rows.push(elementEsp)
                    }
                });
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

function editar(params) {
    //console.log(state.columns);
    switch (state.columns[0].label) {
        case 'No Proveedor': {
            let tempEntidad = ""
            state.arrEmpresasTemp.forEach(element => {
                if (element.nombre == selected.value[0].empresa) tempEntidad = { id: element.id }
            });
            const dataRest = {
                data: {
                    numProveedor:selected.value[0].No,
                    acta: selected.value[0].acta,
                    acuerdo: selected.value[0].acuerdo,
                    numCliente: selected.value[0].numCliente,
                    organismo: selected.value[0].organismo,
                    agenciaBancaria: selected.value[0].agenciaBancaria,
                    banco: selected.value[0].banco,
                    bancoSitio: selected.value[0].bancoSitio,
                    clasificacionContrato: selected.value[0].clasContrato,
                    codNIT: selected.value[0].nit,
                    codREEUP: selected.value[0].reeup,
                    correo: selected.value[0].correo,
                    cuentaBancaria: selected.value[0].cuentaBancaria,
                    dictamenLegal: selected.value[0].dictLegal,
                    domicilioLegal: selected.value[0].domicilio,
                    fechaActa: selected.value[0].fechaActa,
                    firma: selected.value[0].firma,
                    objetoContrato: selected.value[0].objetoContrato,
                    observaciones: selected.value[0].observaciones,
                    pago: selected.value[0].pago.join(", "),
                    telefono: selected.value[0].telefono,
                    tipoContrato: selected.value[0].tipoContrato,
                    tipoProveedor: selected.value[0].tipoProveedor,
                    titular: selected.value[0].titular,
                    valor: selected.value[0].importeContrato,
                    vencimiento: selected.value[0].vencimiento,
                    empresa: tempEntidad
                }
            }
            api
                .put(`/contracts/${selected.value[0].id}`, dataRest, authorization)
                .then(function (response) {
                    alertRules.alerts[1].message = "Contrato Editado"
                    $q.notify(alertRules.alerts[1]);
                }).catch(function (error) {
                    //console.log(error);
                    alertRules.alerts[0].message = "Error editando contrato"
                    $q.notify(alertRules.alerts[0]);
                });
            break;
        }
        case 'No Especifico': {
            let tempEntidad = ""
            state.arrEmpresasTemp.forEach(element => {
                if (element.nombre == selected.value[0].empresa) tempEntidad = { id: element.id }
            });
            const dataRest = {
                data: {
                    numProveedor:selected.value[0].No,
                    acta: selected.value[0].acta,
                    acuerdo: selected.value[0].acuerdo,
                    numCliente: selected.value[0].numCliente,
                    organismo: selected.value[0].organismo,
                    agenciaBancaria: selected.value[0].agenciaBancaria,
                    banco: selected.value[0].banco,
                    bancoSitio: selected.value[0].bancoSitio,
                    clasificacionContrato: selected.value[0].clasContrato,
                    codNIT: selected.value[0].nit,
                    codREEUP: selected.value[0].reeup,
                    correo: selected.value[0].correo,
                    cuentaBancaria: selected.value[0].cuentaBancaria,
                    dictamenLegal: selected.value[0].dictLegal,
                    domicilioLegal: selected.value[0].domicilio,
                    fechaActa: selected.value[0].fechaActa,
                    firma: selected.value[0].firma,
                    objetoContrato: selected.value[0].objetoContrato,
                    observaciones: selected.value[0].observaciones,
                    pago: selected.value[0].pago.join(", "),
                    telefono: selected.value[0].telefono,
                    tipoContrato: selected.value[0].tipoContrato,
                    tipoProveedor: selected.value[0].tipoProveedor,
                    titular: selected.value[0].titular,
                    valor: selected.value[0].importeContrato,
                    vencimiento: selected.value[0].vencimiento,
                    empresa: tempEntidad
                }
            }
            api
                .put(`/especificos/${selected.value[0].id}`, dataRest, authorization)
                .then(function (response) {
                    alertRules.alerts[1].message = "Contrato Especifico Editado"
                    $q.notify(alertRules.alerts[1]);
                }).catch(function (error) {
                    //console.log(error);
                    alertRules.alerts[0].message = "Error editando contrato especifico"
                    $q.notify(alertRules.alerts[0]);
                });
            break;
        }
        case 'Numero de contrato': {
            const dataRest = {
                data: {
                    noContrato: selected.value[0].noContrato,
                    acta: selected.value[0].acta,
                    acuerdo: selected.value[0].acuerdo,
                    numCliente: selected.value[0].numCliente,
                    dictamenLegal: selected.value[0].dictLegal,
                    fechaActa: selected.value[0].fechaActa,
                    firma: selected.value[0].firma,
                    objetoContrato: selected.value[0].objetoContrato,
                    observaciones: selected.value[0].observaciones,
                    pago: selected.value[0].pago.join(", "),
                    valor: selected.value[0].importeContrato,
                    tipoContrato: selected.value[0].tipoContrato,
                    vencimiento: selected.value[0].vencimiento
                }
            }
            api
                .put(`/suplements/${selected.value[0].id}`, dataRest, authorization)
                .then(function (response) {
                    alertRules.alerts[1].message = "Suplemento Editado"
                    $q.notify(alertRules.alerts[1]);
                }).catch(function (error) {
                    //console.log(error);
                    alertRules.alerts[0].message = "Error editando suplemento"
                    $q.notify(alertRules.alerts[0]);
                });
            break;
        }
        default:
            break;
    }
}

function eliminar(params) {
    switch (state.columns[0].label) {
        case "No Proveedor": {
            api
                .delete(`/contracts/${selected.value[0].id}`, authorization)
                .then(function (response) {
                    state.rows = []
                    state.noProveedor = ""
                    state.columns = columnsProveedor; state.opcion = ''; state.rows = state.oiginalRows; 
                    getContratos()
                    alertRules.alerts[1].message = "Contrato eliminado"
                    $q.notify(alertRules.alerts[1]);
                }).catch(function (error) {
                    //console.log(error);
                    alertRules.alerts[0].message = "Error eliminando contrato"
                    $q.notify(alertRules.alerts[0]);
                });
            break;
        }
        case "Numero Especifico": {
            api
                .delete(`/especificos/${selected.value[0].id}`, authorization)
                .then(function (response) {
                    state.rows = []
                    state.noProveedorEspec = ""
                    state.columns = columnsProveedor; state.opcion = ''; state.rows = state.oiginalRows; 
                    getEspecificos()
                    alertRules.alerts[1].message = "Contrato Especifico eliminado"
                    $q.notify(alertRules.alerts[1]);
                }).catch(function (error) {
                    //console.log(error);
                    alertRules.alerts[0].message = "Error eliminando contrato especifico"
                    $q.notify(alertRules.alerts[0]);
                });
            break;
        }
        case "Numero de contrato": {
            api
                .delete(`/suplements/${selected.value[0].id}`, authorization)
                .then(function (response) {
                    state.rows = []
                    state.noSuplemento = ""
                    state.columns = columnsProveedor; state.opcion = ''; state.rows = state.oiginalRows; 
                    getSuplementos()
                    alertRules.alerts[1].message = "Suplemento eliminado"
                    $q.notify(alertRules.alerts[1]);
                }).catch(function (error) {
                    //console.log(error);
                    alertRules.alerts[0].message = "Error eliminando suplemento"
                    $q.notify(alertRules.alerts[0]);
                });
            break;
        }
        default:
            break;
    }
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