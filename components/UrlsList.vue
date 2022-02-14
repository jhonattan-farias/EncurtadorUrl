<template>
    <ul v-show="urls.length > 0">
      <li v-for="(url,index) in urls" :key="index">
        <div class="links">
          <div><strong @click="handleAccessUrl(url)" >{{ url.shorturl }}</strong></div>
          <div><strong @click="handleAccessUrl(url)" >{{ url.fullurl }}</strong></div>
        </div>

        <div id="clicks">
          <div v-show="urlsOwner" @click="handleDeleteUrl(url,index)">
            Excluir
          </div>
          <strong>Acessos: {{ url.clicks }}</strong>
        </div>

      </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name:'UrlsList',

  props:{
    urls:[],
    urlsOwner:{
      type:Boolean,
      default:false
    }
  },
  
  methods:{
    handleDeleteUrl: async function({shorturl},index){
      localStorage.removeItem('urls')
      this.urls.splice(index,1)
      localStorage.setItem('urls',JSON.stringify(this.urls))
      
      try{
        await axios.delete(`api/delete/${shorturl}`)
      } catch(err) {
        console.log(err)
      }
   },

    handleAccessUrl: async function({ fullurl, shorturl, id }: { 
      fullurl: string, 
      shorturl: string, 
      id: string,
    }){

      const findedUrl = this.urls.findIndex(url => url.shorturl === shorturl)
      this.urls[findedUrl].clicks++

      console.log(shorturl)

      await axios.get(`/api/accessUrl/${shorturl}`)

      console.log(fullurl)

      location.assign(`https://${fullurl}`)
    },
  },

})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Roboto&display=swap');
 ul{
    display:flex;
    flex-direction: column;
    padding:10px;
    margin-top:20px;
    border-radius: 10px;
    gap:16px;
    background:rgb(21, 136, 189);
    width:70%;
    li{
      display:flex;
      justify-content: space-between;
      align-items: center;
      padding:0 10px;
      gap:18px;
      background:white;
      border-radius: 10px;
      height:40px;
     
     div + div{
        display:flex;
        gap:10px;

        div{
          padding:1px 5px;
          border-radius:5px;
          cursor:pointer;
          &:hover{
            background:red;
          }
        }
      }
      strong{
        color:black;
        border-radius:5px;
        cursor:default;
      }
        .links{
          display: flex;
          align-items: center;
          gap:40px;
          max-width: 100%;
          strong{
            cursor: pointer;
          }
          div{
            padding:4px 6px;
            border-radius: 5px;
            cursor: pointer;
            &:hover{
              background:rgb(196, 205, 207);
              color:white;
            }
          }
        }
    }
  }
</style>