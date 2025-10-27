<script setup lang="ts">

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

const items= [
{
name:"test",
age:1
},
{
name:"test2",
age:2
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
        <tr v-if="items.length === 0">
          <td colspan="2">No products yet</td>
        </tr>
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
