<script>
export default {
  // Utilisez props pour déclarer la propriété info
  props: {
    info: {
      type: Object, // Remplacez Object par le type de données attendu pour info
      required: true,
    },
  },
  data() {
    return {
      apiKey: '',
      dataInfo: [],
    };
  },
  mounted() {
    this.apiKey = localStorage.getItem('main');
    this.apiKey = JSON.parse(this.apiKey);
    this.apiKey = this.apiKey.apiKey;
    this.dataInfo = this.info;
  },
  methods: {
    // Ajoutez une méthode pour gérer le clic sur le bouton
    toggleEnabled() {
      if(this.dataInfo.is_enabled === 1) {
        this.$api.patch(`/api/activities/${this.dataInfo.id}/disable`, {
          headers: {
            'Authorization': `key=${this.apiKey}`,
          }
        });
        this.dataInfo.is_enabled = 0;
      }else{
        this.$api.patch(`/api/activities/${this.dataInfo.id}/enable`, {
          headers: {
            'Authorization': `key=${this.apiKey}`,
          }
        });
        this.dataInfo.is_enabled = 1;
      }
    },
  },
};

</script>

<template>
  <div :style="{'background-color':this.dataInfo.color}">
  <h1>{{this.dataInfo.name}}</h1>
    <button :style="{ 'background-color': this.dataInfo.is_enabled === 1 ? 'green' : 'red' }" @click="toggleEnabled">Allumer</button>
  </div>
</template>

<style scoped>
</style>