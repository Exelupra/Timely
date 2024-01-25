<template>
  <div>
    <h2>Déconnexion</h2>
    <p>{{ message }}</p>
    <button @click="logout">Se déconnecter</button>
  </div>
</template>

<script>
import { useStore } from '../store/store';
export default {
  data() {
    return {
      message: '',
    };
  },
  methods: {
    logout() {

      useStore().setApiKey('null');
      this.$api.defaults.headers['Authorization'] = '';


      this.message = 'Déconnexion réussie. Redirection vers l\'accueil...';


      setTimeout(() => {
        this.$router.push('/');
      }, 1500);
    },
  },
};
</script>
