<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  data(){
    return {
      apiKey: 'null',
      status: false
    }
  },
  components: {
    RouterLink,
    RouterView
  },
  methods: {
    swap() {
      this.status = !this.status;
    },
    actualise() {
      this.apiKey = localStorage.getItem('main');
      this.apiKey = JSON.parse(this.apiKey);
      this.apiKey = this.apiKey.apiKey;
    },
  },
  mounted(){
    if(localStorage.getItem('main') === null) {
      localStorage.setItem('main', JSON.stringify({apiKey: 'null'}));
    }
    this.apiKey = localStorage.getItem('main');
    this.apiKey = JSON.parse(this.apiKey);
    this.apiKey = this.apiKey.apiKey;
  },
  watch: {
    $route() {
      this.actualise();
    }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <div id="top">
      <img alt="Vue logo" class="logo" src="@/assets/logo3.svg" width="80vw" height="80vw" />
      <nav class="pack">
        <RouterLink to="/acceuil">Acceuil <img alt="Vue logo" class="logo" src="@/assets/home.svg" width="40vw" height="40vw"/></RouterLink>
        <RouterLink v-if="apiKey !== 'null'" to="/project">Projet <img alt="Vue logo" class="logo" src="@/assets/param.svg" width="40vw" height="40vw"/></RouterLink>
        <RouterLink v-if="apiKey !== 'null'" to="/Activity">Activité <img alt="Vue logo" class="logo" src="@/assets/activity.svg" width="40vw" height="40vw"/></RouterLink>
        <RouterLink v-if="apiKey !== 'null'" to="/stats">Statistique <img alt="Vue logo" class="logo" src="@/assets/stat.svg" width="40vw" height="40vw"/></RouterLink>
        <div v-if="apiKey === 'null'" id="espace"></div>
        <RouterLink v-if="apiKey !== 'null'" to="/profil">Profil <img alt="Vue logo" class="logo" src="@/assets/profil.svg" width="40vw" height="40vw"/></RouterLink>
        <RouterLink v-if="apiKey === 'null'" to="/inscription">Inscription <img alt="Vue logo" class="logo" src="@/assets/login.svg" width="40vw" height="40vw"/></RouterLink>
        <RouterLink v-if="apiKey !== 'null'" to="/deconnexion">Déconnexion <img alt="Vue logo" class="logo" src="@/assets/logout.svg" width="40vw" height="40vw"/></RouterLink>
        <RouterLink v-if="apiKey === 'null'" to="/Connexion">Connexion <img alt="Vue logo" class="logo" src="@/assets/login.svg" width="40vw" height="40vw"/></RouterLink>
      </nav>
      </div>
      <div id="bot">
        <p>// En cours //</p>
        <p>Temps : 10:04:40</p>
        <img v-if="status" alt="Vue logo" class="logo" src="@/assets/pause.svg" width="40vw" height="40vw" @click="swap()"/>
        <img v-if="!status" alt="Vue logo" class="logo" src="@/assets/play.svg" width="40vw" height="40vw" @click="swap()"/>
      </div>
    </div>
  </header>
  <RouterView/>
</template>

<style scoped>
header {
  background-color: black;
}

#top{
  display: flex;
}

#bot{
  display: flex;
  background-color: red;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size:1.5em;
  border: 2px solid orange;
}

#bot button{
  font-size: 1.5em;
}

.pack{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.pack a{
  color: black;
  text-decoration: none;
  background-color: white;
  border: 1px solid grey;
  border-radius: 3px;
  width:20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
}

#espace{
  width: 80%;
}

.pack a:hover{
  background-color: grey;
  color: white;
}

.logo{
  margin: 10px;
}
</style>
