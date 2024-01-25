<script>
	export default {
		data() {
			return {
				activities: [],
				showActivityForm: false,
				activityName: '',
				activityColor: ''
			}
		},
		mounted() {
			this.$api.get('/api/activities').then((response) => {
				console.log(response.data);
				response.data.forEach((activity) => {
					if (activity.is_enabled == 1) {
						this.activities.push(activity);
					}
				});
				console.log(this.activities);
			});
		},
		methods: {
			startActivity(name, color) {
				this.$api.post('/api/activities', {
					name: name,
					color: color
				}).then((response) => {
					this.activities.push(response.data);
					console.log(this.activity);
				});
			},
			stopActivity(id) {
				this.$api.patch('/api/activities/' + id + "/disable").then((response) => {
					this.activities = this.activities.filter((activity) => {
						return activity.id != id;
					});
					console.log(this.activities);
				});
			},
			showForm() {
				this.showActivityForm = true;
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
					<input type="text" placeholder="Nom de l'activité" v-model="activityName">
					<input type="color" v-model="activityColor">
					<button @click="startActivity(activityName, activityColor)">Commencer</button>
				</div>
			</div>
			<div>
				<h1 v-if="!activities">Aucune activité en cours</h1>
				<div v-if="activities" v-for="item in activities" class="activityItem">
					<h3>{{ item.name }}</h3>
					temps passé: 00:00:00
					<textarea></textarea>
					<button @click="stopActivity(item.id)">Arrêter</button>
				</div>
			</div>

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
</style>