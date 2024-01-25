import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnexionView  from '../views/Connexion.vue'
import InscriptionView from '../views/Inscription.vue'
import ProfilView from '../views/Profil.vue'
import DeconnexionView from '../views/deconnexion.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: ConnexionView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: InscriptionView
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilView
    }
    ,
    {
      path: '/deconnexion',
      name: 'deconnexion',
      component: DeconnexionView
    }
  ]
})

export default router
