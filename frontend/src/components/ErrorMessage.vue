<!-- src/components/ErrorMessage.vue -->
<template>
    <div v-if="message" class="bg-red-100 text-red-700 p-2 rounded-lg my-4">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: String,
    },
  };
  </script>