<script>
import { Chart } from 'chart.js';
import 'chart.js/auto';


export default {
  data() {
    return {
      apiKey: '',
      package:[],
      debut:null,
      fin:null,
      temps:"0h0min",
      chosenProj: "all",
      projetList: [],
      projetTemps: [],
      timeList: [],

    }
  },
  mounted() {
    this.debut=new Date().toISOString().slice(0, 10);
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.fin=today.toISOString().slice(0, 10);
    this.apiKey = localStorage.getItem('main');
    this.apiKey = JSON.parse(this.apiKey);
    this.apiKey = this.apiKey.apiKey;
    this.actulist();
    this.makeChart();
  },
  methods:{
    actulist(){
      this.$api.get('/api/time-entries?from='+this.debut+'&to='+this.fin, {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      })
      .then((response) => {
        this.package = response.data;
        if(this.chosenProj!="all"){
        this.package= this.package.filter((item) => {
          return item.project_id == this.chosenProj;
        });
        }
        this.projetList = this.package.reduce((acc, obj) => {
          if (!acc.includes(obj.project_id)) {
            acc.push(obj.project_id);
          }
          return acc;
        }, []);
        this.projetList = [...new Set(this.package.map(obj => obj.project_id))];
        const projects = {};

// Itérer à travers chaque entrée dans this.package
        this.package.forEach(entry => {
          const projectId = entry.project_id;
          const startTime = new Date(entry.start);
          const endTime = new Date(entry.end);

          // Calculer la durée en millisecondes
          const duration = endTime - startTime;

          // Ajouter la durée au projet correspondant dans le tableau projects
          if (!projects[projectId]) {
            projects[projectId] = 0;
          }

          projects[projectId] += duration;
        });

// Convertir la durée totale en heures, minutes, secondes, etc. selon vos besoins
        const timeList = Object.entries(projects).map(([projectId, duration]) => {
          return {
            project_id: projectId,
            duration: {
              hours: Math.floor(duration / 3600000),
              minutes: Math.floor((duration % 3600000) / 60000),
              seconds: Math.floor((duration % 60000) / 1000)
            }
          };
        });

        console.log(timeList);
        console.log(this.projetList);
        this.calculFull();
        this.makeChart();
      })
    },
    calculFull() {
      let totalMinutes = 0;

      for (let i = 0; i < this.package.length; i++) {
        let start = new Date(this.package[i].start).getTime();
        let end = new Date(this.package[i].end).getTime();
        let difference = end - start;
        let differenceInMinutes = difference / (1000 * 60);
        totalMinutes += differenceInMinutes;
      }
      let heures = Math.floor(totalMinutes / 60);
      let minutesRestantes = totalMinutes % 60;
      this.temps=heures+"h"+minutesRestantes+"min";
    },
    makeChart() {
      // Récupérer l'élément du canvas
      const canvas = document.getElementById('myChart');

      // Vérifier si une charte existe déjà
      if (canvas && canvas.chart) {
        // Si oui, détruire la charte existante
        canvas.chart.destroy();
      }

      // Créer une nouvelle charte
      const ctx = canvas.getContext('2d');
      canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.projetList,
          datasets: [{
            label: '# of Votes',
            data: [12],
            backgroundColor: [
              'red',
              'blue',
              'yellow',
              'green',
              'purple',
              'orange'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: [{
              type: 'linear',
              beginAtZero: true
            }]
          }
        }
      });
    }

  }
}

</script>

<template>
<p>Du <input type="date" v-model="debut" value="{{debut}}" @change="actulist"> au <input type="date" v-model="fin" value="{{fin}}" @change="actulist"></p>
<p>{{temps}} + nombre de projet : {{this.package.length}} <select v-model="chosenProj" @change="actulist">
  <option disabled value="">Please select one Project</option>
  <option value="all">All</option>
  <option v-for="(item) in this.projetList">
    {{item}}
  </option>
</select></p>
  <canvas id="myChart"></canvas>
</template>

<style scoped>

</style>