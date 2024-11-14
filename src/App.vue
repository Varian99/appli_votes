<script setup>
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
</script>

<template>
  <authenticator :initial-state="'signIn'" hide-sign-up>
    <template v-slot="{ user, signOut }">
      <div v-if="user">
        <h1>Bienvenue, {{ user.username }} !</h1>
        <button @click="signOut">Se déconnecter</button>
      </div>
      <div v-else>
        <h2>Veuillez vous connecter pour accéder à l'application de vote.</h2>
      </div>
    </template>
  </authenticator>
</template>
