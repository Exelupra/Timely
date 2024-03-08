<template>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes Projets</title>
  </head>
  <body>
  <div id="app">
    <h1>Mes Projets</h1>
    
    <div v-if="projects.length > 0">
      <h2>Liste des Projets</h2>
      <ul>
        <li v-for="project in projects" :key="project.id">
          {{ project.name }} - {{ project.description }}
          <button @click="editProject(project)">Modifier</button>
          <button @click="toggleProjectStatus(project)">Activer/Désactiver</button>
        </li>
      </ul>
    </div>

    <div>
      <h2>Ajouter/Modifier un Projet</h2>
      <form @submit.prevent="submitProject">
        <label for="projectName">Nom du Projet:</label>
        <input type="text" id="projectName" v-model="projectName" required>
        <label for="projectDescription">Description:</label>
        <input type="text" id="projectDescription" v-model="projectDescription">
        <button type="submit">{{ editingProject ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>

    <div>
      <h2>Recherche par mot-clé</h2>
      <input type="text" v-model="keyword">
      <button @click="searchProjects">Rechercher</button>
    </div>
  </div>
  </body>
  </html>
</template>
<script>
export default {
  data() {
    return {
      projects: [],
      projectName: '',
      projectDescription: '',
      editingProject: null,
      keyword: ''
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await this.$api.get('/api/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des données de profil:', error);
      }
    },
    submitProject() {
      if (this.editingProject) {
        this.updateProject();
      } else {
        this.addProject();
      }
    },
    async addProject() {
      try {
        await this.$api.post('/api/projects', { name: this.projectName, description: this.projectDescription })
        this.fetchProjects();
        this.resetForm();
      } catch (error) {
        console.error('Erreur lors du chargement des données de profil:', error);
      }
    },
    editProject(project) {
      this.editingProject = project;
      this.projectName = project.name;
      this.projectDescription = project.description;
    },
    async updateProject() {
      try {
        await this.$api.put(`/api/projects/${this.editingProject.id}`, {
          name: this.projectName,
          description: this.projectDescription
        })
        this.fetchProjects();
        this.resetForm();
      } catch (error) {
        console.error('Erreur lors du chargement des données de profil:', error);
      }
    },
    async toggleProjectStatus(project) {
      try {
        const action = project.disabled ? 'enable' : 'disable';

        await this.$api.patch(`/api/projects/${project.id}/${action}`);
        project.disabled = !project.disabled; // Inverse l'état actuel

      } catch (error) {
        console.error('Erreur lors du chargement des données de profil:', error);
      }
    },
    resetForm() {
      this.projectName = '';
      this.projectDescription = '';
      this.editingProject = null;
    },
    async searchProjects() {
      try {
        const response = await this.$api.get(`/api/projects?keywords=${this.keyword}`)
        this.projects = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des données de profil:', error);
      }
    }
  }
};
</script>
