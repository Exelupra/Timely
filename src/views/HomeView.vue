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
				entryForm: false
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
		},
		methods: {
			startActivity() {
				if(useTimeEntryStore().timeEntry) {
					const te = {
						project_id: this.project.id,
						activity_id: this.activity.id,
						start: new Date(),
					};
					useTimeEntryStore().setTimeEntry(te);
				}

				this.todayActivities.push(this.activity);

				console.log(useTimeEntryStore().timeEntry);
			},
			stopActivity(id) {
				this.$api.post('/api/time-entries/' + id, {
					end: new Date()
				}).then((response) => {
					
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
					console.log(response.data);	
				});
			},
			updateEntry(id, start, end, act_id, proj_id) {
				this.$api.put('/api/time-entries/' + id, {
					start: start,
					end: end,
					activity_id: act_id,
					project_id: proj_id
				}).then((response) => {
					console.log(response.data);	
				});
			},
			deleteEntry(id) {
				this.$api.delete('/api/time-entries/' + id).then((response) => {
					console.log(response.data);	
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
			<button @click="testApi">Test API</button>
		</div>
		<div id="objectif">
			<h1>Objectif</h1>
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