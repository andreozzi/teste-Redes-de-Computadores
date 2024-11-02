
<!-- src/views/Home.vue -->
<template>
    <div class="max-w-3xl mx-auto py-8">
      <h1 class="text-3xl font-bold mb-4 text-center">GitHub Favorite Users</h1>
  
      <!-- Entrada e botão de adicionar usuário -->
      <div class="flex mb-4">
        <input
          v-model="username"
          type="text"
          placeholder="Enter GitHub username"
          class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none"
        />
        <button
          @click="addUser"
          class="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
        <button
          @click="sortUsers"
          class="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Sort A-Z
        </button>
      </div>
  
      <!-- Componente de mensagem de erro -->
      <ErrorMessage :message="errorMessage" />
  
      <!-- Grid de usuários favoritos -->
      <div class="grid gap-4 md:grid-cols-2">
        <UserCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          :starred="user.id === starredUserId"
          @toggleStar="toggleStar(user.id)"
          @removeUser="removeUser(user.id)"
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
        users: [],
        starredUserId: null,
        errorMessage: "",
      };
    },
    methods: {
      async addUser() {
        if (this.users.length >= 5) {
          this.errorMessage = "You can only add up to 5 users.";
          return;
        }
  
        try {
          const response = await axios.get(`/api/users/${this.username}`);
          const user = response.data;
  
          if (!this.users.find((u) => u.id === user.id)) {
            this.users.push(user);
            this.errorMessage = "";
          } else {
            this.errorMessage = "User already added to favorites.";
          }
        } catch (error) {
          this.errorMessage = "GitHub user not found.";
        }
        this.username = "";
      },
      removeUser(userId) {
        this.users = this.users.filter((user) => user.id !== userId);
        if (this.starredUserId === userId) {
          this.starredUserId = null;
        }
      },
      toggleStar(userId) {
        this.starredUserId = this.starredUserId === userId ? null : userId;
      },
      sortUsers() {
        this.users.sort((a, b) => a.name.localeCompare(b.name));
      },
    },
  };
  </script>
  
  