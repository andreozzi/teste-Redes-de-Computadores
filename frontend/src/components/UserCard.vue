<!-- src/components/UserCard.vue -->
<template>
  <div class="flex items-center p-4 border border-gray-300 rounded-lg shadow-md">
    <img :src="user.avatar_url" :alt="user.login" class="w-12 h-12 rounded-full mr-4" />
    <div class="flex-1">
      <h2 class="text-lg font-semibold">{{ user.name }}</h2>
      <a
        :href="user.html_url"
        target="_blank"
        class="text-sm text-gray-500 hover:underline"
      >
        {{ user.login }}
      </a>
    </div>
    <button
      v-if="showFavoriteButton"
      @click="$emit('addFavorite')"
      class="ml-4 bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 text-sm"
    >
      Add to Favorites
    </button>
    <button
      v-else
      @click="$emit('toggleFavorite')"
      class="ml-4 text-yellow-400 hover:text-yellow-600"
    >
      <i :class="user.isFavorite ? 'fas fa-star' : 'far fa-star'"></i>
    </button>
    <button
      v-if="!showFavoriteButton"
      @click="$emit('removeUser')"
      class="ml-2 text-red-400 hover:text-red-600"
    >
      <i class="fas fa-trash"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
    showFavoriteButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

