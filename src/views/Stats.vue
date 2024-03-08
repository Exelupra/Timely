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
      timeList: [],
      ActivityList: [],
      timeActList: [],
      colorList : []

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
  methods: {
    actulist() {
      this.$api.get('/api/time-entries?from=' + this.debut + '&to=' + this.fin, {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      })
          .then((response) => {
            this.package = response.data;
            if (this.chosenProj != "all") {
              this.package = this.package.filter((item) => {
                return item.project_id == this.chosenProj;
              });
            }
            this.ActivityList = [...new Set(this.package.map(obj => obj.activity_id))];
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

            let sub = [];
            timeList.forEach((item) => {
              sub.push(item.duration.hours * 60 + item.duration.minutes);
            });
            this.timeList = sub;

            const activities = {};
// Itérer à travers chaque entrée dans this.package
            this.package.forEach(entry => {
              const activityId = entry.activity_id; // Remplacement de projectId par activityId
              const startTime = new Date(entry.start);
              const endTime = new Date(entry.end);

              // Calculer la durée en millisecondes
              const duration = endTime - startTime;

              // Ajouter la durée à l'activité correspondante dans le tableau activities
              if (!activities[activityId]) {
                activities[activityId] = 0;
              }

              activities[activityId] += duration;
            });

// Convertir la durée totale en heures, minutes, secondes, etc. selon vos besoins
            const timeActList = Object.entries(activities).map(([activityId, duration]) => {
              return {
                activity_id: activityId, // Remplacement de project_id par activity_id
                duration: {
                  hours: Math.floor(duration / 3600000),
                  minutes: Math.floor((duration % 3600000) / 60000),
                  seconds: Math.floor((duration % 60000) / 1000)
                }
              };
            });

            let act = [];
            timeActList.forEach((item) => {
              act.push(item.duration.hours * 60 + item.duration.minutes);
            });
            this.timeActList = act;
            this.calculFull();
            this.makeChart();
            this.makeChart2();
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
      this.temps = heures + "h" + minutesRestantes + "min";
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
            label: 'Nombre de minutes par projet',
            data: this.timeList,
            backgroundColor: [
              'red'
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
    },
    colorMaker() {
      return this.$api.get('/api/activities', {
        headers: {
          'Authorization': `key=${this.apiKey}`,
        }
      }).then((response) => {
        response.data.forEach((item) => {
          if (this.ActivityList.includes(item.id)) {
            this.colorList.push(item.color);
          }
        });
      });
    },
    makeChart2() {
      // Appeler colorMaker et attendre sa résolution avant de continuer
      this.colorMaker().then(() => {
        // Récupérer l'élément du canvas
        const canvas = document.getElementById('myChart2');

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
            labels: this.ActivityList,
            datasets: [{
              label: 'Nombre de minutes par Activité',
              data: this.timeActList,
              backgroundColor: this.colorList,
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
  <div v-for="(item) in this.package">
    <p>ID : {{item.project_id}}</p>
    <p>debut : {{item.start}} --- fin : {{item.end}}</p>
  </div>
  <canvas id="myChart2"></canvas>
</template>

<style scoped>

</style>