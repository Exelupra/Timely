
<template>
  <div>
    <h2>Connexion</h2>
    <form @submit.prevent="submitForm">
      <label for="apiKey">Clé API :</label>
      <input type="text" id="apiKey" v-model="apiKey" required>

      <button type="submit">Se connecter</button>
    </form>


    <div v-if="isLoggedIn">
      <p>Connexion réussie. Redirection vers l'accueil...</p>
    </div>
  </div>
</template>

<script>
import { useStore } from '../store/store';

export default {
  data() {
    return {
      apiKey: '',
      isLoggedIn: false,
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$api.get('/api/profile', {
          headers: {
            'Authorization': `key=${this.apiKey}`,
          },
        });
        this.isLoggedIn = true;
        useStore().setApiKey(this.apiKey);
        this.$api.defaults.headers['Authorization'] = `key=${this.apiKey}`;

        setTimeout(() => {
          this.$router.push('/');
        }, 1500);
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Erreur lors de la connexion. Veuillez vérifier votre clé API.');
      }
    },
  },
};

</script>
