<script>
import axios from 'axios';

export default {
  props: {
    signOut: {
      type: Function,
      required: true,
    },
    user: {
      type: String,
      default: null,
    },
  },
  
  
  data() {
    return {
      hasVoted: false,
      votedCandidateId: null,
      candidateInfo: [],
      userInfo: null,
      loading: true,
      errorMessage: null,
    };
  },
  methods: {
    async handleCandidateClick(candidate) {
      const endpointVote = 'https://2bpooveiq9.execute-api.eu-west-3.amazonaws.com/prod/vote_for';
      try {
        const response = await axios.put(`${endpointVote}?username=${this.user}&candidate_id=${candidate.candidateId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Réponse du serveur après le vote:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors du vote :', error);
      }
    },
    async fetchCandidates() {
      const endpoint2 = 'https://2bpooveiq9.execute-api.eu-west-3.amazonaws.com/prod/candidate_info';
      try {
        const response = await axios.get(endpoint2);
        console.log('Réponse de l\'API des candidats:', response.data);
        this.candidateInfo = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des candidats:', error);
        this.errorMessage = 'Impossible de récupérer les candidats.';
      }
    },
  },
  async created() {
    const username = this.user;
    const endpoint = 'https://2bpooveiq9.execute-api.eu-west-3.amazonaws.com/prod/user_info';

    try {
      const response = await axios.get(endpoint, {
        params: { username },
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Réponse de l\'API:', response.data.body);
      this.userInfo = JSON.parse(response.data.body);

      if (this.userInfo["voted-for"] !== 0) {
        this.hasVoted = true;
        this.votedCandidateId = this.userInfo["voted-for"];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      this.errorMessage = 'Impossible de récupérer les informations utilisateur.';
    } finally {
      this.loading = false;
    }

    await this.fetchCandidates();
  },
};

</script>

<template>
  <div>
    <h1>Bienvenue,</h1>
    <h2>Profil de l'utilisateur</h2>
    
    <div v-if="loading">
      <p>Chargement des informations...</p>
    </div>
    
    <div v-else-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>
    
    <div v-else>
      <p>Nom : {{ userInfo.lastName }}</p>
      <p>Prénom : {{ userInfo.firstName }}</p>
      <p>Date de naissance : {{ userInfo.birthDate }}</p>
    </div>
    <div>
      <div v-if="hasVoted">
        <h2>Vous avez voté pour le candidat en vert</h2>
      </div>
      <div v-else>
        <h2>Liste des candidats</h2>
      </div>
      
    <div v-if="loading">
      <p>Chargement des candidats...</p>
    </div>
    <div v-else-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>
    <div v-else>
        <div class="candidates-row">
          <div
            v-for="candidate in candidateInfo"
            :key="candidate.candidateId"
            class="candidate-card"
            :class="{
              'voted-card': hasVoted && candidate.candidateId == votedCandidateId,
              'not-voted-card': hasVoted && candidate.candidateId != votedCandidateId,
              'disabled-card': hasVoted
            }"
            @click="!hasVoted && handleCandidateClick(candidate)" 
          >
            <div class="candidate-name">{{ candidate.candidatename }}</div>
          </div>
        </div>
      </div>
    </div>
    <button @click="signOut">Se déconnecter</button>    
  </div>
</template>


<style scoped>

.candidates-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  padding: 20px;
}

.candidate-card {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;
  flex: 1 1 200px; 
  min-width: 200px;
  opacity: 1;
}

.candidate-card:hover {
  background-color: #e0e0e0;
  transform: translateY(-5px);
}

.voted-card {
  background-color: #1ad01a;
  opacity: 1;
}

.not-voted-card {
  background-color: #c81111; 
  opacity: 1;
}

.disabled-card {
  cursor: not-allowed;
  opacity: 1;
}
</style>