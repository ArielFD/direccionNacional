
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: true },
    children: [
      { path: '' ,name:"home" , component: () => import('src/pages/home_.vue') },
      { path: 'proveedores' ,name:"registroProveedor" , component: () => import('src/pages/registroProveedor.vue') },
      { path: 'registro' ,name:"registro" , component: () => import('src/pages/registroContratos.vue') },
      { path: 'reportes' ,name:"reportes" , component: () => import('pages/reportesContratos.vue') },
      // { path: 'histogramas' ,name:"histogramas" , component: () => import('pages/histogramasContratos.vue') },
      { path: 'minuta' ,name:"minuta" , component: () => import('pages/minutaContratos.vue') },
      { path: 'usuario' ,name:"usuario" , component: () => import('pages/usuario_.vue') }
    ]
  },
  {
    path: '/login',
    name:"login" ,
    component: () => import('pages/loginPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
