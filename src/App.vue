<script setup>
import { ref, onMounted } from "vue";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import UsersProfile from "./components/UsersProfile.vue";

Amplify.configure(outputs);

const endpoint2 = "https://2bpooveiq9.execute-api.eu-west-3.amazonaws.com/prod/candidate_info";
const candidateInfo = ref([]);

const fetchCandidates = async () => {
  try {
    const response = await fetch(endpoint2);
    const data = await response.json();
    const totalVotes = data.reduce((sum, candidate) => sum + candidate.nombrevote, 0);

    candidateInfo.value = data.map(candidate => ({
      ...candidate,
      percentage: totalVotes > 0 ? ((candidate.nombrevote / totalVotes) * 100).toFixed(2) : 0
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des données des candidats :", error);
  }
};

onMounted(() => {
  fetchCandidates();
});
</script>

<template>
  <div class="candidate-list">
    <div
      v-for="candidate in candidateInfo"
      :key="candidate.candidateId"
      class="candidate-card"
    >
      <div class="candidate-name">{{ candidate.candidatename }}</div>
      <div class="candidate-votes">Votes: {{ candidate.nombrevote }}</div>
      <div class="candidate-percentage">
        Pourcentage: {{ candidate.percentage }}%
      </div>
    </div>
  </div>       
  <authenticator :initial-state="'signIn'" hide-sign-up>
    <template v-slot="{ user, signOut }">
      <div v-if="user">
        <UsersProfile :user="user.username" :signOut="signOut" />        
      </div>
      <div v-else>
        <h2>Veuillez vous connecter pour accéder à l'application de vote.</h2>
      </div>
    </template>
  </authenticator>
</template>

<style>
.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.candidate-card {
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background-color: #fff; 
  border: 1px solid #ccc; 
  border-radius: 8px; 
  padding: 10px 20px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}

.candidate-info {
  font-size: 16px;
  font-weight: 500;
  color: #333; 
}

@media (max-width: 768px) {
  .candidate-card {
    flex-direction: column; 
    align-items: flex-start;
    gap: 8px; 
  }
}
</style>