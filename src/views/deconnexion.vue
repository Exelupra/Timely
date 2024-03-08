<template>
  <div class="logout-container">
    <h2>Déconnexion</h2>
    <p>{{ message }}</p>
    <button @click="logout" class="logout-button">Se déconnecter</button>
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

<style scoped>
.logout-container {
  text-align: center;
}

.logout-button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.logout-button:hover {
  background-color: darkred;
}
</style>
