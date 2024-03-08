<template>
  <div class="profile-container">
    <form @submit.prevent="submitForm" class="profile-form">
      <label for="fullName" class="form-label">Nom :</label>
      <input type="text" id="fullName" v-model="fullName" class="form-input" required>

      <label for="email" class="form-label">Adresse e-mail:</label>
      <input type="email" id="email" v-model="email" class="form-input" required>

      <button type="submit" class="submit-button">Enregistrer</button>
    </form>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      email: '',
      successMessage: ''
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
        this.successMessage = 'Informations mises à jour avec succès!';
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  text-align: center;
}

.profile-form {
  display: inline-block;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-label {
  display: block;
  margin-bottom: 5px;
  color: red;
}

.form-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
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
  color: green;
  margin-top: 10px;
}
</style>
