import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnexionView  from '../views/Connexion.vue'
import InscriptionView from '../views/Inscription.vue'
import ProfilView from '../views/Profil.vue'
import DeconnexionView from '../views/deconnexion.vue'
import ActivityView from '../views/Activity.vue'
import StatsView from '../views/Stats.vue'
import Project from '@/views/Projet.vue'
import acceuilView from '@/views/Acceuil.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/broken',
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
    },
    {
      path: '/activity',
      name: 'activity',
      component: ActivityView
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/',
      name: 'acceuil',
      component: acceuilView
    }
  ]
})

export default router
