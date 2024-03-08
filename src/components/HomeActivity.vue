<template>
        <div class="activityItem">
            <h3>{{ item.name }}</h3>
            temps passé: 00:00:00
            <textarea></textarea>
            <button @click="stopActivity(item.id)" v-if="item.is_enabled">Arreter</button>
            <button @click="startActivity(item.id)" v-if="!item.is_enabled">Arreter</button>
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
</template>

<script>

export default {
    name: 'HomeActivity',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
}

</script>

<style scoped>

</style>