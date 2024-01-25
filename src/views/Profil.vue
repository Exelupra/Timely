<template>
  <div>
    <h2>Profil</h2>
    <form @submit.prevent="submitForm">
      <label for="fullName">Nom :</label>
      <input type="text" id="fullName" v-model="fullName" required>

      <label for="email">Adresse e-mail:</label>
      <input type="email" id="email" v-model="email" required>

      <button type="submit">Enregistrer</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      email: '',
    };
  },
  created() {
    this.loadUserData();
  },
  methods: {
    async loadUserData() {
      try {
        const response = await this.$api.get('/api/profile');
        this.fullName = response.data.name;
        this.email = response.data.email;

      } catch (error) {
        console.error('Erreur lors du chargement des données de profil:', error);
      }
    },
    async submitForm() {
      try {
        await this.$api.put('/api/profile', {
          name: this.fullName,
          email: this.email,
        });

      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    },
  },
};
</script>
