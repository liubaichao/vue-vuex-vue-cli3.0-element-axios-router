<template>
  <div id="app">
    <el-container class="h100">
      <el-aside :width="collapse?'auto':'200px'" style="background-color: rgb(238, 241, 246)" v-show="isShow" class="flex colu">
        <div class="logo"></div>
        <el-menu
          router
          ref='menu'
          :collapse="collapse"
          :default-active='$route.path'
          class="el-menu-vertical-demo"
          background-color="#002140"
          text-color="#fff"
          active-text-color="#ffd04b">

          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-cold-drink"></i>
              <span>米粒姐</span>
            </template>
              <el-menu-item index="/OnlineAudit">通话回推记录</el-menu-item>
              <el-menu-item index="/ReceiptList">通话记录</el-menu-item>
          </el-submenu>
          <el-menu-item index="/OnlineAudit">
            <i class="el-icon-finished"></i>
            <span slot="title">线上审核</span>
          </el-menu-item>
          <el-menu-item index="/ReceiptList">
            <i class="el-icon-s-claim"></i>
            <span slot="title">回执单</span>
          </el-menu-item>
          <el-menu-item index="/PatientList">
            <i class="el-icon-user"></i>
            <span slot="title">患者管理</span>
          </el-menu-item>
          <el-menu-item index="/DrugPoint">
            <i class="el-icon-s-home"></i>
            <span slot="title">领药机构</span>
          </el-menu-item>
          <el-menu-item index="/VolunteerList">
            <i class="el-icon-s-custom"></i>
            <span slot="title">志愿者管理</span>
          </el-menu-item>
          <el-menu-item index="/ExpressList">
            <i class="el-icon-truck"></i>
            <span slot="title">快递管理</span>
          </el-menu-item> -->

          <el-menu-item :index="'/'+item.path" v-for="(item,i) in loginInfo.roleArr" :key='i'>
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header class="tr fz12 bgf flex justs" v-show="isShow">
          <span :class="[collapse?'el-icon-s-unfold':'el-icon-s-fold','fz16','lh60','cursor']" @click="collapse = !collapse"></span>
          <span>
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting cursor" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginOut">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>{{userInfo?userInfo.name:''}}</span>
          </span>
        </el-header>
        
        <el-main class="padding0">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
import Vue from 'vue'
import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'
import { Menu,MenuItem,MenuItemGroup,Container,Header,Aside,Main,Dropdown,DropdownMenu,DropdownItem,Submenu} from 'element-ui';

const arr = [Menu,MenuItem,MenuItemGroup,Container,Header,Aside,Main,Dropdown,DropdownMenu,DropdownItem ,Submenu] 
arr.map((e)=>{  //动态生成全局组件
   //Vue.use(e);
   Vue.component(e.name, e)
})
export default {
  name: 'App',
  data() {
    return {
      isShow:false, //是否显示菜单栏
      collapse:false, //是否展开菜单栏
      userInfo:{name:'admin'},
    }
  },
  created() {
  },
  computed: {
    ...mapState(['loginInfo']),
  },
  methods: {
    ...mapMutations(['setLoginInfo']),
    handleCommand(command) { //退出登录
      if(command == 'loginOut'){
        localStorage.setItem('userInfo','') 
        this.setLoginInfo()
        this.$router.push({
          path:'/'
        })
      }
    },
    
  },
  mounted () {
    let userInfo = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{name:'',roleArr:[]}
    let currentRoute = userInfo.roleArr.find( item => `/${item.path}` == this.$route.path )

    this.userInfo = userInfo   
    this.isShow = currentRoute?currentRoute.showLeftMenu:false

    setTimeout(() => {
        this.$refs.menu.defaultActive = localStorage.getItem('index')
      }, 100)
  },
  watch: {
    $route() {
      let i = this.$route.path;
      let userInfo = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{name:'',roleArr:[]}
      let currentRoute = userInfo.roleArr.find( item => `/${item.path}`== this.$route.path )

      localStorage.setItem('index',i)
      this.userInfo = userInfo
      this.isShow = currentRoute?currentRoute.showLeftMenu:false

      setTimeout(() => {
        this.$refs.menu.activeIndex = i
      }, 100)
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f1f1f1;
}
.el-menu{flex:1;}
.el-header {
  color: #333;
  line-height: 60px;
}
.padding0{padding:0}
.el-aside {
  color: #333;
}
.logo{
  width: calc(100% - 1px);
  height: 60px;
  background: url('./assets/images/logo.jpg') no-repeat center center;
  background-size: 100% 100%;
  box-sizing: border-box;
}
.lh60{line-height: 60px;}
/*修改滚动条样式*/
.el-aside::-webkit-scrollbar{
  width:2px;
  height:2px;
  /**/
}
.el-aside::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
.el-aside::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
.el-aside::-webkit-scrollbar-thumb:hover{
  background: #333;
}
.el-aside::-webkit-scrollbar-corner{
  background: #179a16;
}
</style>
