<template>
<div>
  <div class="header">
    <div class="input-url-content">
      <h1>Encurtador de Urls</h1>
      <form>
        <input type="text" placeholder="digite a url..." v-model="fullUrl">
        <button type="submit" @click.prevent="handleShortUrl" >Encurtar</button>
      </form>
    </div>

    <div>
      <NuxtLink to="RankLinks">Rank Urls</NuxtLink>
      <span id="logar" v-if="!userData" @click="openCloseLoggin">Logar</span>
      <span id="logar" v-else @click="logoutUser">Olá {{userData.userName}} </span>
    </div>
    
  </div>

  <Login @LoggIn="fillUserData($event)" :isOpen="showLoggin" />
  
  <h2 v-show="urls.length > 0"> Suas Urls: </h2>
  <UrlsList v-show="urls.length > 0" :urls="urls" :urlsOwner="true" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import shortid from 'shortid'
import axios from 'axios'

export default Vue.extend({
  name: 'IndexPage',
  data(){
    return {
      fullUrl: '',
      urls: [],
      userForm:{
        userName:'',
        userPassword:'',
      },
      userData:null,
      showLoggin:false,
    }
  },

  methods:{

      handleShortUrl: async function() {
        const generatedId = shortid.generate()
        const shorturl = `speedly/${generatedId}`
        const invalidUrl = !this.fullUrl.includes('.com' || '.br' || '.net' || '.gov' || '.org')
        if(invalidUrl){
          return alert('URL INVALIDA');
        }     

        let data: any = {
          fullurl: this.fullUrl.replace(/\s/g,""), 
          shorturl,
          clicks:0,
          userName:this.userData?.userName ?? ''
        }

        this.urls.push(data)
        this.fullUrl = ''
      
       const  response = await axios.post('/api/saveUrl',{},{ headers:data})
    },

    fillUserData: function(event){
        this.userData = event

        localStorage.removeItem('userData')
        localStorage.setItem('userData',JSON.stringify(event))

        this.showLoggin = false
        this.fetchUserUrls()
    },

    openCloseLoggin: function(){
      this.showLoggin = !this.showLoggin
    },

    logoutUser:function(){
      localStorage.removeItem('userData')
      this.userData = null
      this.urls = []
    },

    fetchUserUrls: async function(){
      const {data} = await axios.get(`api/getUrls/user/${this.userData.userName}`)
      const results = data
      this.urls = results
    }

  } as any,

  beforeMount(){
    const userData = JSON.parse(localStorage.getItem('userData'))
    if(userData) {
      this.userData = userData
      this.fetchUserUrls()
    }
  }
})
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Roboto&display=swap');
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  body{
    padding:20px;
    font-family:'inter';
  }
  input,button{
    outline:0;
    border:none;
  }
  a{
    text-decoration: none;
    color:rgb(21, 136, 189);
  }
  .header{
    display:flex;
    justify-content: space-between;
    align-items: center;
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