<template>
    <div class="login" v-show="isOpen">
      <form @submit.prevent="handleSubscribe">
        <div class="user">
          <label for="user">Usuario:</label>
          <input v-model="userForm.userName" name="user" />
        </div>

        <div class="password">
          <label for="password">Senha: </label>
          <input v-model="userForm.userPassword" name="password" type="password"/>
        </div>
        
        <button>Inscrever-se/Login</button>
      </form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    name:'Loggin',
    props:{
        isOpen:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            userForm:{
                userName:'',
                userPassword:''
            },
            response:{}
        }
    },
    methods:{
         handleSubscribe: async function (e: any){
            try{
                e.preventDefault()
                const response = await axios.post('/api/subscribe',{},{ headers: this.userForm })      
                this.$emit('LoggIn',response.data)
            } catch(err){
                console.log(err)
            }
        },
    }
})
</script>

<style lang="scss" scoped>
  .login{
    position:absolute;
    top:11%;
    right: 2%;
    form{
      display:flex; 
      flex-direction: column;
      gap:15px;
      padding-left: 20px;
      width:80%;

      height:max-content;
      background:rgb(21, 136, 189);
      padding:20px;
      border-radius:5px;

      button{
        height: 30px;
        width:95%;
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

      input{
        height:30px;
        padding-left:10px;
        border-radius: 5px;
        div{
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .password{
          label{
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>