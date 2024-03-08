<script>
import { useTimeEntryStore } from '../store/timeEntry';

	export default {
		data() {
			return {
				projects: [],
				activities: [],
				todayActivities: [],
				entries: [],
				activity: {},
				project: {},
				selectedEntry: {},
				showActivityForm: false,
				entryForm: false,
				newEntryForm: false,

				objectives:[],
				objectiveName: '',
				objectiveContent: '',
				showObjectivesForm: false,
			}
		},
		mounted(){
			this.$api.get('/api/projects').then((response) => {
				this.projects = response.data;
			});

			this.$api.get('/api/time-entries').then((response) => {
				response.data.forEach((item) => {
					if(item.start.slice(0, 10) == new Date().toISOString().slice(0, 10)) {
						this.$api.get('/api/activities/' + item.activity_id).then((res) => {
							this.todayActivities.push(res.data);
						});
					}
				});
			});

			this.$api.get('/api/daily-objectives').then((response) => {
				response.data.forEach((item) => {
					if(!item.done||item.date == new Date().toISOString().slice(0, 10)){
						this.objectives.push(item);
					}
				});
			});
		},
		methods: {
			startActivity() {
				if(useTimeEntryStore().timeEntry) {
					const te = {
						project_id: this.project.id,
						activity_id: this.activity.id,
						start: new Date(),
						activity: this.activity
					};
					useTimeEntryStore().setTimeEntry(te);
				}
				this.todayActivities.push(this.activity);
				alert("Activité commencée");
				this.showActivityForm = false;
			},
			stopActivity(id) {
				const te = useTimeEntryStore().timeEntry;
				this.$api.post('/api/time-entries/' + id, {
					activity_id: te.activity_id,
					project_id: te.project_id,
					start: te.start,
					end: new Date()
				}).then((response) => {
					alert("Activité terminée");
				});
			},
			showForm() {
				this.showActivityForm = true;
			},
			showEntryForm(entry) {
				this.entryForm = !this.entryForm;
				this.selectedEntry = entry;
			},
			getActivities() {
				if(this.project){
					console.log(this.project);
					this.$api.get('/api/time-entries').then((response) => {
						response.data.forEach((item) => {
							if(item.project_id == this.project.id) {
								this.$api.get('/api/activities/' + item.activity_id).then((res) => {
									this.activities.push(res.data);
								});
							}
						});
					});
				}
			},
			createEntry(start, end, act_id, proj_id) {
				this.$api.post('/api/time-entries', {
					start: start,
					end: end,
					activity_id: act_id,
					project_id: proj_id
				}).then((response) => {
					alert("Entrée créée avec succès");
				});
			},
			updateEntry(id, start, end, act_id, proj_id) {
				this.$api.put('/api/time-entries/' + id, {
					start: start,
					end: end,
					activity_id: act_id,
					project_id: proj_id
				}).then((response) => {
					alert("Entrée modifiée avec succès");
				});
			},
			deleteEntry(id) {
				this.$api.delete('/api/time-entries/' + id).then((response) => {
					alert("Entrée supprimée avec succès");
				});
			},
			getEntries(id) {
				this.$api.get('/api/time-entries').then((response) => {
					response.data.forEach((item) => {
						if(item.activity_id == id) {
							this.entries.push(item);
						}
					});
				});
			},
			createObjective() {
				this.$api.post('/api/daily-objectives', {
					name: this.objectiveName,
					content: this.objectiveContent
				}).then((response) => {
					this.objectives.push(response.data);
				});
				this.showObjectivesForm = false;
			},
			toggleObjective(item){
				if(item.done){
					this.$api.patch('/api/daily-objectives/' + item.id + '/undone').then((response) => {
						alert("Objectif relancé");
					});
				} else {
					this.$api.patch('/api/daily-objectives/' + item.id + '/done').then((response) => {
						alert("Objectif terminé");
					});
				}
				item.done = !item.done;
			}
		}
	}

</script>

<template>
	<main>
		<div id="timetracker">
			<div>
				<button @click="showForm" v-if="!showActivityForm">Débuter une activité</button>
				<div v-if="showActivityForm">
					<select v-model="project" @click="getActivities">
						<option value="">Choisir un projet</option>
						<option v-for="item in projects" :value="item" >{{ item.name }}</option>
					</select>
					<select v-model="activity">
						<option value="">Choisir une activité</option>
						<option v-for="item in activities" :value="item">{{ item.name }}</option>
					</select>
					<button @click="startActivity()">Commencer</button>
				</div>
			</div>
			<div>
				<h1 v-if="!todayActivities">Aucune activité en cours</h1>
				<div v-for="item in todayActivities" :item="item" :key="item.id" @click="getEntries(item.id)" class="activities">
					<div class="activityItem">
						<h3>{{ item.name }}</h3>
						temps passé: 00:00:00
						<textarea></textarea>
						<button @click="stopActivity(item.id)">Arrêter</button>
					</div>
					<button v-if="!newEntryForm" @click="newEntryForm=!newEntryForm">Créer une entrée</button>
					<div class="formEntry" v-if="newEntryForm">
						<input type="datetime-local" v-model="selectedEntry.start">
						<input type="datetime-local" v-model="selectedEntry.end">
						<button @click="createEntry(selectedEntry.start, selectedEntry.end, item.id, project.id)">Valider</button>
					</div>
					<div v-if="entries" v-for="entry in entries">
						<p v-if="!entryForm">{{ entry.start }} - {{ entry.end }}</p>
						<input v-if="entryForm" type="datetime-local" v-model="selectedEntry.start">
						<input v-if="entryForm" type="datetime-local" v-model="selectedEntry.end">
						<button @click="updateEntry(selectedEntry.id, selectedEntry.start,
							selectedEntry.end, selectedEntry.activity_id, selectedEntry.project_id)" 
								v-if="entryForm">Valider</button>
						<button @click="showEntryForm(entry)" v-if="!entryForm">Modifier</button>
						<button @click="deleteEntry(entry.id)" v-if="!entryForm">Supprimer</button>
					</div>
				</div>
			</div>
		</div>
		<div id="objectif">
			<h1>Objectif</h1>
			<button @click="showObjectivesForm=!showObjectivesForm" v-if="!showObjectivesForm">Créer un objectif</button>
			<div class="formObjectives" v-if="showObjectivesForm">
				<input type="text" v-model="objectiveName" placeholder="Nom de l'objectif">
				<textarea v-model="objectiveContent" placeholder="Contenu de l'objectif"></textarea>
				<button @click="createObjective">Créer</button>
			</div>
			<div v-for="item in objectives" class="objectives">
				<h3>{{ item.name }}</h3>
				<p>{{ item.content ? item.content : "null" }}</p>
				<button v-if="!item.done" @click="toggleObjective(item)">Terminer</button>
				<button v-if="item.done" @click="toggleObjective(item)">Relancer</button>
			</div>
		</div>
	</main>
</template>


<style scoped>
main{
	color: initial;
}

#timetracker, #objectif {
	border: 1px solid black;
}

.activityItem{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.activities{
	display: flex;
	flex-direction: column;
}
</style>