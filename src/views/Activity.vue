<script>
import Affiche from "@/components/Affiche.vue";

export default{
  components: {Affiche},
  data(){
    return {
      apiKey: '',
      package:[],
      recherche:"",
      menu:false,
      nom:"",
      color:"",
      colorlist:["red","orange","yellow","green","blue","indigo","purple","pink","black","white","gray","brown"]
    }
  },
  mounted() {
    // Maintenant, this.apiKey sera automatiquement mis à jour avec la valeur du getter
    this.apiKey = localStorage.getItem('main');
    this.apiKey = JSON.parse(this.apiKey);
    this.apiKey = this.apiKey.apiKey;
    this.$api.get('/api/activities', {
      headers: {
        'Authorization': `key=${this.apiKey}`,
      }
    })
    .then((response) => {
      this.package = response.data;
      console.log(response.data);
    })
  },
  methods: {
    openMenu() {
      this.menu = !this.menu;
    },
    creeActivity() {
      if(this.nom!=="" && this.color!==""){
      this.$api.post('/api/activities', {
        name: this.nom,
        color: this.color
      }, {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      })
      .then((response) => {
        let item=response.data;
        item.is_enabled=1;
        this.package.push(item);
        this.menu = false;
      })
    }else{
        alert("Veuillez remplir tous les champs");
      }
    },
  }
}

</script>

<template>
<div class="barre">
  <input type="text" v-model="recherche" placeholder="Rechercher une activité">
  <button @click="openMenu">Ajouter</button>
  <div v-if="menu">
    <input type="text" v-model="nom" placeholder="Nom de l'activité">
    <select v-model="color">
      <option disabled value="">Please select one Color</option>
      <option v-for="(item) in this.colorlist">
        {{item}}
      </option>
    </select>
    <button @click="creeActivity">Créé</button>
  </div>
</div>
  <div v-if="this.package.length > 0">
    <div v-for="(item, index) in this.package">
    <affiche  :key="index" :info="item" v-if="recherche === '' || item.name.toLowerCase().includes(recherche.toLowerCase())"/>
    </div>
  </div>
</template>

<style scoped>
.barre {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #cccccc;
}

.barre input[type="text"],
.barre select {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.barre button {
  padding: 8px 15px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.barre button:hover {
  background-color: darkred;
}
</style>