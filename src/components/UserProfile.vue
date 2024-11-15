<template>
    <div v-if="user">
      <h1>Bienvenue, {{ user.firstName }} {{ user.lastName }}!</h1>
      <p>Date de naissance : {{ user.birthdate }}</p>
    </div>
    <div v-else>
      <p>Chargement des informations...</p>
    </div>
  </template>
  
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
        // Appel à la fonction Lambda pour récupérer les informations de profil
        const response = await API.get('getProfileInfo', '/VoteAPI'); // Assurez-vous que l'API est bien configurée
        this.user = response;
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    },
  };
  </script>
  
  <style scoped>
  /* Ajoutez ici des styles spécifiques au composant */
  </style>
  