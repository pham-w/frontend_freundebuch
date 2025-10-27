<script setup lang="ts">

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

const items= [
{
name:"Lilie",
age:90,
geburtsdatum:"01.01.2000",
favColor:"blau",
hobby:"fußball",
favFood:"pizza",
dreamJob:"astronaut"
},
{
name:"Liliane",
age:99,
geburtsdatum:"02.02.2002",
favColor:"rot",
hobby:"lesen",
favFood:"pasta",
dreamJob:"arzt"
}
]
</script>

<template>
  <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Alter</th>
          <th>Geburtsdatum</th>
          <th>Lieblingsfarbe</th>
          <th>Hobby</th>
          <th>Lieblingsfarbe</th>
          <th>Traumberuf</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{item.name}}</td>
          <td>{{item.age}}</td>
          <td>{{item.geburtsdatum}}</td>
          <td>{{item.favColor}}</td>
          <td>{{item.hobby}}</td>
          <td>{{item.favFood}}</td>
          <td>{{item.dreamJob}}</td>
        </tr>
        <tr>
          <td>{{ nameField }}</td>
          <td>{{ ageField }}</td>
          <td>{{ geburtsdatumField }}</td>
          <td>{{ favColorField }}</td>
          <td>{{ hobbyField }}</td>
          <td>{{ favFoodField }}</td>
          <td>{{ dreamJobField }}</td>
        </tr>
        </tbody>
      </table>
</template>
