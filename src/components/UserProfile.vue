<script>
import { API } from 'aws-amplify';

export default {
  data() {
    return {
      user: null,
    };
  },
  async created() {
    try {
      // Appel à l'API REST pour récupérer les informations de l'utilisateur
      const response = await API.get('VoteAPI', '/getProfileInfo');
      this.user = response;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
    }
  },
};
</script>

<template>
  <div>
    <h2>Profil de l'utilisateur</h2>
    <div v-if="user">
      <p>Nom : {{ user.nom }}</p>
      <p>Prénom : {{ user.prenom }}</p>
      <p>Date de naissance : {{ user.dateNaissance }}</p>
    </div>
    <div v-else>
      <p>Chargement des informations...</p>
    </div>
  </div>
</template>
