<script>
export default {
  data() {
    return {
      apiKey: '',
      projectList:[],
      activityList:[],
      proj: '',
      act: '',
      encours: false,
      comment: '',
    }
  },
  mounted() {
    this.apiKey = localStorage.getItem('main');
    this.apiKey = JSON.parse(this.apiKey);
    this.apiKey = this.apiKey.apiKey;
    this.$api.get('/api/projects', {
      headers: {
        'Authorization': `key=${this.apiKey}`,
      }
    })
    .then((response) => {
      response.data.forEach((item) => {
        this.projectList.push(item.name)
        if(item.id===localStorage.getItem('idProj')) {
          this.proj = item.name;
        }
      })
      console.log(this.projectList);
    })
    this.$api.get('/api/activities', {
      headers: {
        'Authorization': `key=${this.apiKey}`,
      }
    })
    .then((response) => {
      response.data.forEach((item) => {
        this.activityList.push(item.name)
        if(item.id===localStorage.getItem('idAct')) {
          this.act = item.name;
        }
      })
      console.log(this.activityList);
    })
    if(localStorage.getItem('idProj') !== null && localStorage.getItem('idAct') !== null) {
      this.encours = true;
    }
    //this.proj = localStorage.getItem('idProj');
    //this.act = localStorage.getItem('idAct');
    this.comment = localStorage.getItem('comment');
  },
  methods: {
    startActivity() {
      this.$api.get('/api/projects?keywords='+this.proj, {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      }).then((response) => {
        let id=response.data[0].id;
        localStorage.setItem('idProj', id);
      });
      this.$api.get('/api/activities?keywords='+this.act, {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      }).then((response) => {
        let id=response.data[0].id;
        localStorage.setItem('idAct', id);
      });
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois commence à 0, donc ajoutez 1
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      localStorage.setItem('start', formattedDate);
      localStorage.setItem('comment', '');
    },
    stop(){
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois commence à 0, donc ajoutez 1
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      this.$api.post('/api/time-entries', {
        "project_id": localStorage.getItem('idProj'),
        "activity_id": localStorage.getItem('idAct'),
        "comment": localStorage.getItem('comment'),
        "start":localStorage.getItem('start'),
        "end":formattedDate,
      }, {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      }).then(() => {
        localStorage.removeItem('idProj');
        localStorage.removeItem('idAct');
        localStorage.removeItem('comment');
      });
    },
    updateComment(){
      localStorage.setItem('comment', this.comment);
    }
  }
}

</script>

<template>
  <div>
  <select v-model="proj">
    <option v-for="project in projectList" :key="project" :value="project">{{project}}</option>
  </select>
  <select v-model="act">
    <option v-for="activity in activityList" :key="activity" :value="activity">{{activity}}</option>
  </select>
  <button @click="startActivity">Démarrer</button>
  </div>
  <p v-if="this.proj!=null && this.act!=null">projet en cours : {{this.proj}} avec l'activité  {{this.act}}</p>
  <p>commentaire : <input type="text" v-model="comment" placeholder="Commentaire" @change="updateComment"><button @click="stop" v-if="encours">Stopper</button></p>

</template>

<style scoped>

</style>