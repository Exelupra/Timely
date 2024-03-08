<template>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes Projets</title>
  </head>
  <body>
  <div id="app" class="projects-container">
    <h1>Mes Projets</h1>

    <div v-if="projects.length > 0" class="projects-list">
      <h2>Liste des Projets</h2>
      <ul>
        <li v-for="project in projects" :key="project.id" class="project-item">
          {{ project.name }} - {{ project.description }}
          <button @click="editProject(project)" class="edit-button">Modifier</button>
          <button @click="toggleProjectStatus(project)" class="toggle-button">Activer/Désactiver</button>
        </li>
      </ul>
    </div>

    <div class="add-edit-project">
      <h2>Ajouter/Modifier un Projet</h2>
      <form @submit.prevent="submitProject" class="project-form">
        <label for="projectName">Nom du Projet:</label>
        <input type="text" id="projectName" v-model="projectName" class="form-input" required>
        <label for="projectDescription">Description:</label>
        <input type="text" id="projectDescription" v-model="projectDescription" class="form-input">
        <button type="submit" class="submit-button">{{ editingProject ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>

    <div class="search-project">
      <h2>Recherche par mot-clé</h2>
      <input type="text" v-model="keyword" class="search-input">
      <button @click="searchProjects" class="search-button">Rechercher</button>
    </div>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
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
      keyword: '',
      successMessage: '',
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
        this.handleError(error);
      }
    },
    async submitProject() {
      try {
        if (this.editingProject) {
          await this.updateProject();
        } else {
          await this.addProject();
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async addProject() {
      await this.$api.post('/api/projects', { name: this.projectName, description: this.projectDescription });
      this.fetchProjects();
      this.resetForm();
    },
    editProject(project) {
      this.editingProject = project;
      this.projectName = project.name;
      this.projectDescription = project.description;
    },
    async updateProject() {
      await this.$api.put(`/api/projects/${this.editingProject.id}`, {
        name: this.projectName,
        description: this.projectDescription
      });
      this.fetchProjects();
      this.resetForm();
    },
    async toggleProjectStatus(project) {
      try {
        const action = project.disabled ? 'enable' : 'disable';
        await this.$api.patch(`/api/projects/${project.id}/${action}`);
        project.disabled = !project.disabled; // Inverse l'état actuel
        this.successMessage = `Le projet a été ${project.disabled ? 'désactivé' : 'activé'} avec succès!`;
      } catch (error) {
        this.handleError(error);
      }
    },
    resetForm() {
      this.projectName = '';
      this.projectDescription = '';
      this.editingProject = null;
    },
    async searchProjects() {
      try {
        const response = await this.$api.get(`/api/projects?keywords=${this.keyword}`);
        this.projects = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },
    handleError(error) {
      console.error('Erreur:', error);
      alert('Une erreur s\'est produite. Veuillez réessayer.');
    }
  }
};
</script>
<style>
.projects-container {
  text-align: center;
}

.projects-list {
  margin-bottom: 20px;
}

.project-item {
  margin-bottom: 10px;
  list-style-type: none;
}

.add-edit-project,
.search-project {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-button,
.search-button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover,
.search-button:hover {
  background-color: darkred;
}

.edit-button,
.toggle-button {
  background-color: white;
  color: red;
  border: 1px solid red;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}
.success-message {
  color: green;
  margin-top: 10px;
}
.edit-button:hover,
.toggle-button:hover {
  background-color: red;
  color: white;
}
</style>