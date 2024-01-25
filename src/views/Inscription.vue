<template>
  <div>
    <h2>Inscription</h2>
    <template v-if="!apiKey">
      <p>Remplissez le formulaire ci-dessous pour créer un compte et obtenir une clé API.</p>
    <form @submit.prevent="submitForm">
      <label for="fullName">Nom :</label>
      <input type="text" id="fullName" v-model="fullName">

      <label for="email">Adresse e-mail:</label>
      <input type="email" id="email" v-model="email">

      <button type="submit">S'inscrire</button>
    </form>
      <div v-if="error">
        <p>Erreur lors de l'inscription : {{ error }}</p>
      </div>
    </template>
    <div v-if="apiKey">
      <h3>Clé API:</h3>
      <p>{{ apiKey }}</p>
      <router-link to="/">Retour à l'accueil</router-link>
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
