<template>
<div>
    <div class="head">
        <NuxtLink to="/encurtaUrl">Voltar</NuxtLink>
        <h1>Top 100 links acessados</h1>
    </div>
    <UrlsList :urls="urls" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
    data(){
        return{
            urls:[]
        }
    },
     async beforeMount(){
        const { data } = await axios.get('/api/getUrls')

        let results = data.map((item:any) => item.data)

        results = results.sort((a,b) => a.clicks > b.clicks ? -1 : true)
        
        this.urls = results
    }
})
</script>

<style lang='scss' scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Roboto&display=swap');
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  body,h1{
    padding:20px;
    font-family:'inter';
  }
  input,button{
    outline:0;
    border:none;
  }
  ul,li{
    list-style: none;
  }
  a{
    text-decoration: none;
  }

  .header{
    display:flex;
    justify-content: space-between;
    padding-right:20px;
    #logar{
      height:max-content;
      padding:10px;
      cursor:pointer;
      &:hover{
          background: rgb(21, 136, 189);
      }
      &:active{
        box-shadow: 0px 0px 5px white;
      }
    }
    .input-url-content{
      display: flex;
      flex-direction: column;
      width:50%;
    }
    h1{
      font-family:'inter';
    }
    input{
      background: rgb(206, 202, 202);
      min-width: 50%;
      padding:20.8px;
      border-radius: 10px 0 0 10px;
      margin-right:-2.5px;
    }
    button{
      background: rgb(206, 202, 202);
      min-width:100px;
      padding:20px;
      border-radius: 0px 10px 10px 0px;
      margin-bottom: -5px;
      font-family: 'inter';
      cursor:pointer;

      &:active{
          background: rgb(34, 34, 34);
          box-shadow: 0px 0px 5px white;
          color:white;
          font-family: 'inter';
        }
          &:hover{
            background:rgb(99, 97, 97) ;
          }
    }
    height: 100px;
  }
</style>