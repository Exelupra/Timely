<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  data(){
    return {
      connected: 'none',
      disconnected: 'block'
    }
  },
  components: {
    RouterLink,
    RouterView
  },
  methods:{
    swap(){
      if(this.connected == 'none'){
        this.connected = 'block'
        this.disconnected = 'none'
      }else{
        this.connected = 'none'
        this.disconnected = 'block'
      }
    },
    check(){
      this.$api.get('/api/profile').then((response)=>{
        console.log(response.data);
      }).catch((error)=>{
        console.log(error);
      }
      )
    }
  },
  onMounted(){
    this.check();
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <div id="top">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="100vw" height="100vw" />
      <div id="barre connected" :style="{display:connected}">
      <nav class="pack">
        <RouterLink to="/">Acceuil</RouterLink>
        <RouterLink to="/">paramètre</RouterLink>
        <RouterLink to="/">Activité</RouterLink>
        <RouterLink to="/">Déconnexion</RouterLink>
      </nav>
      </div>
      <div id="barre disconnected" :style="{display:disconnected}">
        <nav class="pack">
          <RouterLink to="/">Acceuil</RouterLink>
          <RouterLink to="/" style="grid-column: 4">Connexion</RouterLink>
        </nav>
      </div>
      </div>
      <div id="bot">
        <p>En cours</p><p>Temps : 10:04:40</p><button @click="swap()">Pause</button>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  background-color: black;
}

.pack{
  display: grid;
  grid-template-columns:repeat(4, 1fr);
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
  margin-left: 3vw;
  height: 100%;
}

.pack a{
  background-color: white;
  display:block;
  height:100%;
  width:22vw;
  padding-top:5%;
  text-align: center;
  text-decoration: none;
  border: 3px solid white;
  background-color:black;
  border-radius: 10px;
  font-size: 1.5vw;
  font-weight: bold;
}

.pack a:hover{
  background-color: grey;
  color: black;
}

.wrapper{
  display:grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.5fr;
}

#bot{
background-color:red;
  align-items: center;
  justify-items: center;
  display:flex;

}

#bot p{
  padding-top: 0.5%;
  font-size: 1vw;
  font-weight: bold;
  color:white;
  padding-left: 1%;
}

#top{
  display:grid;
  grid-template-columns: 5vw 1fr;
  grid-template-rows: 1fr;
}
</style>
