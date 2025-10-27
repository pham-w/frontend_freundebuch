<script setup lang="ts">

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

const items= [
{
Name:"Lili",
age:90
},
{
Name:"Leonie",
age:99
}
]
</script>

<template>
  <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{item.name}}</td>
          <td>{{item.age}}</td>
        </tr>
        <tr>
          <td>{{ nameField }}</td>
          <td>{{ ageField }}</td>
        </tr>
        </tbody>
      </table>
</template>
