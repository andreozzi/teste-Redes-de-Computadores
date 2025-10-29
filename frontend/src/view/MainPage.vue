
<!-- src/views/Home.vue -->
<template>
    <div class="max-w-3xl mx-auto py-8">
      <h1 class="text-3xl font-bold mb-4 text-center">Lista de Usuários</h1>
  
      <!-- Entrada e botão de busca de usuário -->
      <div class="flex mb-4">
        <input
          v-model="username"
          type="text"
          placeholder="Enter GitHub username to search"
          class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none"
        />
        <button
          @click="searchUser"
          class="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
        <button
          @click="sortFavoriteUsers"
          class="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Sort A-Z
        </button>
      </div>
  
      <!-- Componente de mensagem de erro -->
      <ErrorMessage :message="errorMessage" />
  
      <!-- Exibição do usuário pesquisado -->
      <div v-if="searchedUser" class="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-2">Searched User:</h2>
        <UserCard
          :user="searchedUser"
          :show-favorite-button="true"
          @addToList="addSearchedUserToFavorites"
        />
      </div>
  
      <!-- Grid de usuários favoritos -->
      <h2 class="text-xl font-bold mb-2">Usuários na Lista ({{ favoriteUsers.length }}/5):</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <UserCard
          v-for="user in favoriteUsers"
          :key="user.id"
          :user="user"
          @removeUser="removeFavoriteUser(user.login)"
          @toggleFavorite="toggleFavoriteStatus(user.login)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import UserCard from "@/components/UserCard.vue";
  import ErrorMessage from "@/components/ErrorMessage.vue";
  import axios from "axios";
  import { io } from "socket.io-client"; // Import io from socket.io-client

  export default {
    components: {
      UserCard,
      ErrorMessage,
    },
    data() {
      return {
        username: "",
        searchedUser: null,
        favoriteUsers: [],
        errorMessage: "",
        socket: null, // Add socket instance to data
      };
    },
    created() {
      this.socket = io("http://localhost:6262"); // Connect to socket server

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.socket.emit('favorites:get'); // Request initial list
      });

      this.socket.on('favorites:update', (users) => {
        this.favoriteUsers = users;
        this.errorMessage = "";
      });

      this.socket.on('favorites:error', (message) => {
        this.errorMessage = message;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    },
    beforeUnmount() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
    methods: {
      async searchUser() {
        if (!this.username) {
          this.errorMessage = "Please enter a GitHub username to search.";
          this.searchedUser = null;
          return;
        }
  
        try {
          const response = await axios.get(`/api/users/${this.username}`);
          this.searchedUser = { ...response.data, isFavorite: false }; // Add isFavorite for consistency
          this.errorMessage = "";
        } catch (error) {
          this.searchedUser = null;
          if (error.response && error.response.status === 404) {
            this.errorMessage = "GitHub user not found.";
          }
           else {
            console.error("Error searching user:", error);
            this.errorMessage = "Failed to search user.";
          }
        }
      },
      addSearchedUserToFavorites() {
        if (!this.searchedUser) {
          this.errorMessage = "No user searched to add to favorites.";
          return;
        }
        this.socket.emit('favorites:add', this.searchedUser.login);
        this.searchedUser = null;
      },
      removeFavoriteUser(username) {
        this.socket.emit('favorites:remove', username);
      },
      toggleFavoriteStatus(username) {
        this.socket.emit('favorites:toggle', username);
      },
      sortFavoriteUsers() {
        this.socket.emit('favorites:sort');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Aqui pode-se adicionar estilos específicos para esta página */
  </style>