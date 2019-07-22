<template>
<!-- 志愿者列表 -->
  <div class="VolunteerList" >
    <el-row :gutter="12" class="mt10 mlr0">
      <el-col :span="24">
        <el-card shadow="always" class='ml20 mr20' >
          <el-form :inline="true" :model="formInline" label-width="100px" class="demo-form-inline mt20">
            <el-form-item label="省份">
              <el-select v-model="formInline.provinceCode" @change="provincesOnChange" size="small" clearable>
                <el-option :label="item.name" :value="item.code" v-for="(item,i) in provincesArr" :key='i'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市">
              <el-select v-model="formInline.cityId" size="small" clearable>
                <el-option :label="item.name" :value="item.id" v-for="(item,i) in cityArr" :key='i'></el-option>
              </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="机构名称">
              <el-input v-model="formInline.orgName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.status" size="small" clearable>
                <el-option label="正常" :value="1"></el-option>
                <el-option label="停用" :value="2"></el-option>
                <el-option label="全部" :value="null"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="newOne" size="small">新增</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="downExcel" size="small">导出</el-button>
            </el-form-item> -->
          </el-form>
           <el-table
            v-loading="loading"
            size='small'
            :data="tableData.rows"
            style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="sex" label="性别" :formatter='setSex'></el-table-column>
            <el-table-column prop="orgName" label="机构名称"></el-table-column>
            <el-table-column prop="mobile" label="联系电话" ></el-table-column>
            <el-table-column prop="loginName" label="登录名"></el-table-column>
            <el-table-column prop="manager" label="登录密码"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter='setStatus'></el-table-column>
            <el-table-column prop="isBind" label="是否绑定" :formatter='setBind'></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="editOne(scope.$index, tableData)"
                  type="text"
                  size="small">
                  编辑
                </el-button>
                <el-button
                  @click.native.prevent="changeStatus(scope.$index, tableData)"
                  type="text"
                  size="small">
                  {{scope.row.status == 1?'禁用':'启用'}}
                </el-button>
                <el-button
                  @click.native.prevent="changeUnBind(scope.$index, tableData)"
                  type="text"
                  size="small">
                  {{scope.row.isBind == 1?'解绑':''}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage4"
            :page-sizes="[10,20,100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
            class="mt20 tr"
            >
          </el-pagination>
        </el-card>
        
      </el-col>
    </el-row>

     <!-- 新增 start-->
    <el-dialog
      :title="newForm.id?'编辑志愿者':'新增志愿者'"
      :visible.sync="dialogNewVisible"
      width="60%"
       v-loading='loading'
      >
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="100px" class="demo-ruleForm">
        
        <el-Row>
          <el-Col :span='12'>
            <el-form-item label="姓名" prop="name" size="small">
              <el-input v-model="newForm.name" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="性别" prop="sex" size="small">
              <el-select v-model="newForm.sex">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="联系电话" prop="mobile" size="small">
              <el-input v-model.number="newForm.mobile" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="机构名称" prop="orgId" size="small">
              <el-select v-model="newForm.orgId" @change='orgOnChange'>
                <el-option :label="item.orgName" :value="item.id" v-for="(item,i) in orgArr" :key='i'></el-option>
              </el-select>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="登录名" prop="loginName" size="small">
              <el-input v-model="newForm.loginName" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="登录密码" prop="password" size="small">
              <el-input v-model="newForm.password" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="账号状态" prop="status" size="small">
              <el-radio-group v-model="newForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-Col>
        </el-Row>

        <el-form-item class="tr">
          <el-button @click="dialogNewVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submitNewForm('newForm')" size="small">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
     <!--新增 end-->
  </div>
</template>

<script>
import Vue from 'vue'
import { 
  Form,FormItem,Row,Col,Button ,Loading ,
  Pagination,Table,TableColumn,Select,Option,Radio,RadioGroup,
  Card,Input ,DatePicker ,Footer,Divider,InputNumber, Dialog
  } from 'element-ui';

const arr = [
  Form,FormItem,Row,Col,Button ,Pagination,
  Table,TableColumn,Select,Option,Card,Radio,RadioGroup,
  Input,DatePicker ,Footer,Divider,InputNumber,Dialog
  ] 
arr.map((e)=>{  //动态生成全局组件
   //Vue.use(e);
   Vue.component(e.name, e)
})
Vue.use(Loading.directive);


var checkTel = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('电话不能为空'));
    }
    setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    }, 1000);
  };
export default {
  name: 'VolunteerList',
  data() {
    return {
      loading:false,
      showTab:true,
      selectRows:'',
      tableData: {
          rows:[],
          total:0
          },
      currentPage4: 1,
      formInline: {
          provinceCode:'',
          cityId:'',
          provinceId:'',
          orgNam:'',
          statu:'',
        },
      
      dialogNewVisible:false,//新增
      newForm:{
        name:'',
        sex:'',
        mobile:'',
        orgId:'',
        orgName:'',
        id:'',//机构id
        loginName:'',     
        password:'',
        status:'1'
      },
      newRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur'}],
        sex: [{ required: true, message: '请选择', trigger: 'change'}],
        mobile:[{ validator:checkTel,required: true, trigger: 'blur'}],
        orgId:[{ required: true, message: '请输入', trigger: 'blur'}],
        loginName:[{ required: true, message: '请输入', trigger: 'blur'}],
        password:[{ required: true, message: '请输入', trigger: 'blur'}],
        status:[{ required: true, message: '请选择', trigger: 'change'}]
      },
      orgArr:[],
      provincesArr:[],
      cityArr:[],
    }
  },
  created () {
    this.getOrg()//所有机构
    this.getList({...this.formInline})
    this.getPro()
  },
  methods: {
    handleSizeChange(val) {
      this.selectRows = val //用户控制rows
      this.getList({...this.formInline}) //查询
    },
    handleCurrentChange(val) {
      this.getList({...this.formInline ,page:val}) //用户选择页数
    },
    changeStatus(index,data){//是否禁用
      let that = this
      this.$axios.get(that.$my.api + '/bms/user/changStatus?id='+data.rows[index].id,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              that.$message({
                    message: res.data.message,
                    type: 'success',
                    duration: 1500
                })
              that.getList({...this.formInline})
            }else{
                that.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {})
    },
    changeUnBind(index,data){//解绑
      let that = this
      this.$axios.get(that.$my.api + '/bms/user/unBind?id='+data.rows[index].id,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              that.$message({
                    message: res.data.message,
                    type: 'success',
                    duration: 1500
                })
              that.getList({...this.formInline})
            }else{
                that.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {})
    },
    provincesOnChange(values) {//省市
      this.provincesArr.map((item)=>{
        if(item.code == values){
          this.formInline.provinceId = item.id
          this.formInline.cityId = ''
        }
      })          
      //根据code请求数据
      this.getCityList(values) //根据省code获取城市
    },
    getPro(){
      let that = this
      this.$axios.get(this.$my.api+'/wet/base/getProList')
        .then(res => {
          if(res.data&&res.data.code == 200){
            this.provincesArr= res.data.data
            that.getCityList(res.data.data[0].code)
          }else{
            that.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
          }
        }, response => {
            console.log("error");
        })
    },
    getCityList(code){
      let that = this
      this.$axios.get(this.$my.api+'/wet/base/getCityList?code='+code)
        .then(res => {
          if(res.data&&res.data.code == 200){
            this.cityArr= res.data.data
          }else{
            that.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
          }
        }, response => {
            console.log("error");
        });
    },
    getOrg(){ //获取所有机构
      let that = this
      this.$axios.get(this.$my.api+'/bms/org/getAllOrg')
        .then(res => {
          if(res.data&&res.data.code == 200){
            this.orgArr= res.data.data
          }else{
            that.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
          }
        }, response => {
            console.log("error");
        })
    },
    orgOnChange(values) {//省市
      this.orgArr.map((item)=>{
        if(item.id == values){
          this.newForm.orgName = item.orgName
        }
      })          
    },
    newOne(){//新增机构
      this.dialogNewVisible = true
      this.newForm.id = ''
      this.$nextTick(()=>{
        this.$refs['newForm'].resetFields();
        this.newForm.status = 1
      })
    },
    editOne(index,data){//编辑机构
      this.dialogNewVisible = true
      this.newForm.id = data.rows[index].id
      this.getDetail(data.rows[index].id).then((res)=>{       
        this.$nextTick(()=>{
          this.newForm = {
            name:res.name,
            sex:res.sex+'',
            mobile:parseInt(res.mobile),
            orgName:res.orgName,
            orgId:res.orgId,
            id:res.id,//机构id
            loginName:res.loginName,     
            password:res.password,
            status:res.status
          }
        })
        
      })
    },
    submitNewForm(formName){ //新增提交
      let that = this
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data ={
            ...this.newForm,
            // employeeId:userInfo.id,
            // employeeName:userInfo.loginName
          }
          this.$axios.post(that.$my.api + '/bms/user/addOrModify', data,{headers:{token:userInfo.token}}).then(res => { 
              if(res.data&&res.data.code === 200){       
                  that.loading = false;
                  that.dialogNewVisible = false
                  that.$message({
                      message: res.data.message,
                      type: 'success',
                      duration: 1500
                  })
                  that.getList({...that.formInline})
                  that.$refs[formName].resetFields();
              }else{
                  that.loading = false
                  that.dialogNewVisible = false
                  that.$message({
                      message: res.data.message,
                      type: 'error',
                      duration: 1500
                  })
                  return false
              } 
          }).catch(function (error) {
            that.loading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onSubmit() {
        console.log('submit!',this.formInline);
        this.currentPage4 = 1
        this.getList({...this.formInline}) //查询
      },
    getDetail(id){//机构详情
      return new Promise((rel,err)=>{
        this.$axios.get(this.$my.api + '/bms/user/getUser?id='+id,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              rel(res.data.data)
            }else{
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {})
      })
      
    },
    getList(val={}){    
        let that = this
        this.loading = true
        let data = {
              page:1,
              rows:that.selectRows?that.selectRows:that.$my.rows,
              ...val
            }
            data.number = data.number?data.number.join(','):''
        this.$axios.post(that.$my.api + '/bms/user/getList', data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){       
                that.loading = false;
                that.tableData = res.data.data
            }else{
                that.loading = false
                that.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {
          that.loading = false
        })
      },
      downExcel(){
        this.$my.downExcel('/down',{name:''},'数据','POST')
      },
      setSex(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.sex[cellValue]:''
      },
      setStatus(row, column, cellValue, index){
        return cellValue == 1?'启用':'禁用'
      },
      setTime(row, column, cellValue, index){
        return cellValue?this.$my.timestampToTime(cellValue,'YMDHMS'):''
      },
      setBind(row, column, cellValue, index){
        return cellValue == 1?'绑定':'未绑定'
      },
  },

}
</script>

<style scoped>
.foot{margin-left: 200px;width:calc(100% - 200px)}
.w100px{width:100px;display: inline-block;}
.mb70{margin-bottom:70px}
.mlr0{margin-left:-4px !important;margin-right: 0 !important}
</style>

