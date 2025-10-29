
<!-- src/views/Home.vue -->
<template>
    <div class="max-w-3xl mx-auto py-8">
      <h1 class="text-3xl font-bold mb-4 text-center">GitHub Favorite Users</h1>
  
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
          @addFavorite="addSearchedUserToFavorites"
        />
      </div>
  
      <!-- Grid de usuários favoritos -->
      <h2 class="text-xl font-bold mb-2">Favorite Users ({{ favoriteUsers.length }}/5):</h2>
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
      };
    },
    created() {
      this.fetchFavoriteUsers();
    },
    methods: {
      async fetchFavoriteUsers() {
        try {
          const response = await axios.get("/api/favorites");
          this.favoriteUsers = response.data;
          this.errorMessage = "";
        } catch (error) {
          console.error("Error fetching favorite users:", error);
          this.errorMessage = "Failed to load favorite users.";
        }
      },
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
          } else {
            console.error("Error searching user:", error);
            this.errorMessage = "Failed to search user.";
          }
        }
        // this.username = ""; // Keep username in input after search
      },
      async addSearchedUserToFavorites() {
        if (this.favoriteUsers.length >= 5) {
          this.errorMessage = "You can only add up to 5 favorite users.";
          return;
        }
  
        if (!this.searchedUser) {
          this.errorMessage = "No user searched to add to favorites.";
          return;
        }
  
        if (this.favoriteUsers.some(user => user.login === this.searchedUser.login)) {
          this.errorMessage = "User is already in your favorites.";
          return;
        }
  
        try {
          const response = await axios.post(`/api/favorites/${this.searchedUser.login}`);
          this.favoriteUsers.push(response.data.user);
          this.searchedUser = null; // Clear searched user after adding to favorites
          this.errorMessage = "";
        } catch (error) {
          if (error.response && error.response.status === 400) {
            this.errorMessage = error.response.data.msg;
          } else {
            console.error("Error adding user to favorites:", error);
            this.errorMessage = "Failed to add user to favorites.";
          }
        }
      },
      async removeFavoriteUser(username) {
        try {
          await axios.delete(`/api/favorites/${username}`);
          this.favoriteUsers = this.favoriteUsers.filter((user) => user.login !== username);
          this.errorMessage = "";
        } catch (error) {
          console.error("Error removing favorite user:", error);
          this.errorMessage = "Failed to remove user from favorites.";
        }
      },
      async toggleFavoriteStatus(username) {
        try {
          const response = await axios.put(`/api/favorites/${username}/toggle`);
          const updatedUser = response.data.user;
          const index = this.favoriteUsers.findIndex(user => user.login === username);
          if (index !== -1) {
            this.favoriteUsers.splice(index, 1, updatedUser);
          }
          this.errorMessage = "";
        } catch (error) {
          console.error("Error toggling favorite status:", error);
          this.errorMessage = "Failed to toggle favorite status.";
        }
      },
      async sortFavoriteUsers() {
        try {
          const response = await axios.get("/api/favorites/sort");
          this.favoriteUsers = response.data.users;
          this.errorMessage = "";
        } catch (error) {
          console.error("Error sorting favorite users:", error);
          this.errorMessage = "Failed to sort favorite users.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Aqui pode-se adicionar estilos específicos para esta página */
  </style>