<template>
  <div class="inscription-container">
    <h2>Inscription</h2>
    <template v-if="!apiKey">
      <p>Remplissez le formulaire ci-dessous pour créer un compte et obtenir une clé API.</p>
      <form @submit.prevent="submitForm" class="inscription-form">
        <label for="fullName">Nom :</label>
        <input type="text" id="fullName" v-model="fullName" class="form-input">

        <label for="email">Adresse e-mail:</label>
        <input type="email" id="email" v-model="email" class="form-input">

        <button type="submit" class="submit-button">S'inscrire</button>
      </form>
      <div v-if="error" class="error-message">
        <p>Erreur lors de l'inscription : {{ error }}</p>
      </div>
    </template>
    <div v-if="apiKey" class="api-key-section">
      <h3>Clé API:</h3>
      <p>{{ apiKey }}</p>
      <router-link to="/" class="return-link">Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      email: '',
      apiKey: null,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$api.post('/api/apikeys', {
          name: this.fullName,
          email: this.email,
        });

        this.apiKey = response.data.key;
        this.error = null;
      } catch (error) {
        this.error = error.response.data.errors;
        this.error = this.error.toString().replace(/[[\]']+/g,"");
      }
    },
  },
};
</script>
<style scoped>
.inscription-container {
  text-align: center;
}

.inscription-form {
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

.error-message {
  color: red;
  margin-top: 10px;
}

.api-key-section {
  margin-top: 20px;
}

.return-link {
  color: red;
  text-decoration: underline;
  cursor: pointer;
}

.return-link:hover {
  color: darkred;
}
</style>
