<template>
  <div class="connexion-container">
    <h2>Connexion</h2>
    <form @submit.prevent="submitForm" class="connexion-form">
      <label for="apiKey">Clé API :</label>
      <input type="text" id="apiKey" v-model="apiKey" required class="form-input">

      <button type="submit" class="submit-button">Se connecter</button>
    </form>

    <div v-if="isLoggedIn" class="success-message">
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

<style scoped>
.connexion-container {
  text-align: center;
}

.connexion-form {
  display: inline-block;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: darkred;
}

.success-message {
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style>
