<template>
<!-- 领药机构列表 -->
  <div class="DrugPoint" >
    <el-row :gutter="12" class="mt10 mlr0">
      <el-col :span="24">
        <el-card shadow="always" v-if="showTab">
          <el-form :inline="true" :model="formInline" label-width="100px" class="demo-form-inline mt20">
            <el-form-item label="省份">
              <el-select v-model="formInline.provinceCode" @change="provincesOnChange($event,true)" size="small" clearable>
                <el-option :label="item.name" :value="item.code" v-for="(item,i) in provincesArr" :key='i'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市">
              <el-select v-model="formInline.cityId" size="small" clearable>
                <el-option :label="item.name" :value="item.id" v-for="(item,i) in searchCityArr" :key='i'></el-option>
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
            <el-table-column prop="provinceName" label="省份"></el-table-column>
            <el-table-column prop="cityName" label="城市"></el-table-column>
            <el-table-column prop="orgName" label="机构名称"></el-table-column>
            <el-table-column prop="address" width="150" show-overflow-tooltip label="机构地址" ></el-table-column>
            <el-table-column prop="orgMobile" label="机构电话"></el-table-column>
            <el-table-column prop="manager" label="负责人"></el-table-column>
            <el-table-column prop="managerMobile" label="负责人电话"></el-table-column>
            <el-table-column prop="quanty" label="库存"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter='setStatus'></el-table-column>
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
                  @click.native.prevent="insto(scope.$index, tableData)"
                  type="text"
                  size="small">
                  入库
                </el-button>
                <el-button
                  @click.native.prevent="detailRow(scope.$index, tableData)"
                  type="text"
                  size="small">
                  查看
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
        <!-- 详情 -->
        <el-card shadow="always" class='ml20 mr20 mb70' v-else>
          <div class="fz14">
            <el-divider content-position="left">基础信息</el-divider>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">机构名称：</span><span>{{detailData?detailData.orgName:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">省市：</span><span>{{detailData?detailData.provinceName+detailData.cityName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh30">
              <el-col :span="12"><span class="fw w100px">地址：</span><span>{{detailData?detailData.address:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">药店电话：</span><span>{{detailData?detailData.orgMobile:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh30">
              <el-col :span="12"><span class="fw w100px">负责人：</span><span>{{detailData?detailData.manager:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">负责人手机：</span><span>{{detailData?detailData.managerMobile:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh30 mb20">
              <el-col :span="12"><span class="fw w100px">机构状态：</span><span>{{detailData?(detailData.status==1?'启用':'禁用'):''}}</span></el-col>
            </el-row>

            <el-table
            v-loading="loading"
            size='small'
            :data="detailDataList.rows"
            style="width: 100%">
            <el-table-column prop="name" label="援助药品" :formatter='getName'></el-table-column>
            <el-table-column prop="spec" label="规格" :formatter='setSpec'></el-table-column>
            <el-table-column prop="type" label="进出类型" :formatter='setType'></el-table-column>>
            <el-table-column prop="qty" label="进出量"></el-table-column>        
            <el-table-column prop="createTime" label="进出时间" :formatter='setTime'></el-table-column>
            <el-table-column prop="status" label="当前状态" :formatter='instoStatus'></el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="currentPage2"
            :page-sizes="[10,20,100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailDataList.total"
            class="mt20 tr"
            >
          </el-pagination>

 
            <el-footer class="posFix bottom0 left0 bgf foot flex alic juste">
              <el-button type="primary" size="small" @click="showTab = true" class="ml20 mr20">返回</el-button>
            </el-footer>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 入库 start-->
    <el-dialog
      title="入库"
      :visible.sync="dialogVisible"
      width="40%"
       v-loading='loading'
      >
      <el-form :model="instoForm" status-icon :rules="rules" ref="instoForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="规格" prop="spec" size="small">
          <el-radio-group v-model="instoForm.spec">
            <el-radio :label="1">12.5MG</el-radio>
            <el-radio :label="2">25MG</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入库" prop="qty" size="small">
          <el-input-number v-model="instoForm.qty" placeholder='数量' clearable></el-input-number>
        </el-form-item>
        
        <el-form-item class="tr">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submitInstoForm('instoForm')"  size="small">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
     <!--出库 end-->

     <!-- 新增 start-->
    <el-dialog
      :title="newForm.id?'编辑机构':'新增机构'"
      :visible.sync="dialogNewVisible"
      width="60%"
       v-loading='loading'
      >
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="100px" class="demo-ruleForm">
        
        <el-Row>
          <el-Col :span='12'>
            <el-form-item label="省份" prop="provinceCode" size="small">
              <el-select v-model="newForm.provinceCode" @change="provincesOnChange">
                <el-option :label="item.name" :value="item.code" v-for="(item,i) in provincesArr" :key='i'></el-option>
              </el-select>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="城市" prop="cityId" size="small">
              <el-select v-model="newForm.cityId" @change='cityOnChange'>
                <el-option :label="item.name" :value="item.id" v-for="(item,i) in cityArr" :key='i'></el-option>
              </el-select>
            </el-form-item>
          </el-Col>
          <el-Col :span='24'>
            <el-form-item label="机构电话" prop="orgMobile" size="small">
              <el-input v-model.number="newForm.orgMobile" style="width:208px" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='24'>
            <el-form-item label="机构名称" prop="orgName" size="small">
              <el-input v-model="newForm.orgName"  style="width:500px" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='24'>
            <el-form-item label="机构地址" prop="address" size="small">
              <el-input v-model="newForm.address" style="width:500px" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="负责人" prop="manager" size="small">
              <el-input v-model="newForm.manager" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="负责人电话" prop="managerMobile" size="small">
              <el-input v-model.number="newForm.managerMobile" clearable></el-input>
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
 var checkPhone = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('手机不能为空'));
    }
    let regIdPhone = /^1\d{10}$/; 
    setTimeout(()=>{
      if(!regIdPhone.test(value)){
        callback(new Error('手机格式错误'));
      }else{
        callback()
      }
    },1000)
  };
export default {
  name: 'DrugPoint',
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
        orgName:'',
        status:'',
      },
      editId:'',
      detailData:{},//详情
      detailDataList:{
        rows:[],
        total:0
      },
      detailSelectRows:'',
      detailCurrentPage4: 1,
      currentPage2: 1,

      dialogVisible:false,//入库
      instoForm:{
        spec:'',
        qty:'',
        orgId:'',//机构id
        orgName:'',
      },
      rules: {
        spec: [{ required: true, message: '请选择', trigger: 'change'}],
        qty: [{ required: true, message: '请输入', trigger: 'blur'}],
      },
      
      dialogNewVisible:false,//新增
      newForm:{
        provinceId:'',
        provinceName:'',
        provinceCode:'',
        cityId:'',
        cityName:'',
        id:'',//机构id
        orgName:'',
        orgMobile:'',
        address:'',
        manager:'',
        managerMobile:'',

      },
      newRules: {
        provinceCode: [{ required: true, message: '请选择', trigger: 'change'}],
        cityId: [{ required: true, message: '请选择', trigger: 'change'}],
        orgName:[{ required: true, message: '请输入', trigger: 'blur'}],
        orgMobile:[{ required: true,validator:checkTel, trigger: 'blur'}],
        address:[{ required: true, message: '请输入', trigger: 'blur'}],
        manager:[{ required: true, message: '请输入', trigger: 'blur'}],
        managerMobile:[{ required: true,validator:checkPhone, trigger: 'blur'}]
      },
      provincesArr:[],
      cityArr:[],//编辑城市
      searchCityArr:[]//搜索城市
    }
  },
  created () {
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
    handleSizeChange2(val) {
      this.detailSelectRows = val 
      this.getDetailInfoList() 
    },
    handleCurrentChange2(val) {
      this.getDetailInfoList({page:val}) //用户选择页数
    },
    changeStatus(index,data){//是否禁用
      this.$http.changDrugStatusApi({id:data.rows[index].id},{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              this.$message({
                    message: res.data.message,
                    type: 'success',
                    duration: 1500
                })
              this.getList({...this.formInline})
            }else{
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {})
    },
    insto(index,data){ //入库
      this.dialogVisible = true
      this.instoForm.orgId = data.rows[index].id
      this.instoForm.orgName = data.rows[index].orgName
    },
    submitInstoForm(formName){ //入库提交
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if(this.instoForm.qty == 0){
        this.$message({
            message: '入库不能为零',
            type: 'warning',
            duration: 1500
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data ={
            ...this.instoForm,
            employeeId:userInfo.id,
            employeeName:userInfo.loginName
          }
          this.$http.instoApi(data,{headers:{token:userInfo.token}}).then(res => { 
              if(res.data&&res.data.code === 200){       
                  this.loading = false;
                  this.dialogVisible = false
                  this.$message({
                      message: res.data.message,
                      type: 'success',
                      duration: 1500
                  })
                  this.getList({...this.formInline})
                  this.$refs[formName].resetFields();
              }else{
                  this.loading = false
                  this.dialogVisible = false
                  this.$message({
                      message: res.data.message,
                      type: 'error',
                      duration: 1500
                  })
                  return false
              } 
          }).catch(function (error) {
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    provincesOnChange(values ,isSearch) {//省市
      this.provincesArr.map((item)=>{
        if(item.code == values){
          if(isSearch){ //搜索省市
            this.formInline.provinceId = item.id
            this.formInline.provinceName = item.name
            this.formInline.cityId = ''
          }else{//编辑省市
            this.newForm.provinceId = item.id
            this.newForm.provinceName = item.name
            this.newForm.cityId = ''
          }
        }
      })          
      //根据code请求数据
      this.getCityList(values ,isSearch) //根据省code获取城市
    },
    cityOnChange(values) {//省市
      this.cityArr.map((item)=>{
        if(item.id == values){
          this.newForm.cityName = item.name
        }
      })          
    },
    getPro(){
      this.$http.getProListApi().then(res => {
          if(res.data&&res.data.code == 200){
            this.provincesArr= res.data.data
            this.getCityList(res.data.data[0].code)
          }else{
            this.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
          }
        }, response => {
            console.log("error");
        })
    },
    getCityList(code,isSearch){
      this.$http.getCityListApi({code:code}).then(res => {
          if(res.data&&res.data.code == 200){
            if(isSearch){
              this.searchCityArr = res.data.data
            }else{
              this.cityArr= res.data.data
            }
          }else{
            this.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
          }
        }, response => {
            console.log("error");
        });
    },
    newOne(){//新增机构
      this.dialogNewVisible = true
      this.newForm.id = '',
      this.$nextTick(()=>{
        this.$refs['newForm'].resetFields();
      })
    },
    editOne(index,data){//编辑机构
      this.dialogNewVisible = true
      this.newForm.id = data.rows[index].id
      this.getDetail(data.rows[index].id).then((res)=>{       
        let province = this.provincesArr.find((item)=>item.id == res.provinceId)   
        this.getCityList(province.code)
        this.$nextTick(()=>{
          this.newForm = {
            provinceId:res.provinceId,
            provinceName:res.provinceName,
            provinceCode:province.code,
            cityId:res.cityId,
            cityName:res.cityName,
            id:res.id,//机构id
            orgName:res.orgName,
            orgMobile:parseInt(res.orgMobile),
            address:res.address,
            manager:res.manager,
            managerMobile:res.managerMobile,
          }
        })
        
      })
    },
    submitNewForm(formName){ //新增提交
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data ={
            ...this.newForm,
            employeeId:userInfo.id,
            employeeName:userInfo.loginName
          }
          this.$http.savaOrModifyApi(data,{headers:{token:userInfo.token}}).then(res => { 
              if(res.data&&res.data.code === 200){       
                  this.loading = false;
                  this.dialogNewVisible = false
                  this.$message({
                      message: res.data.message,
                      type: 'success',
                      duration: 1500
                  })
                  this.getList({...this.formInline})
                  this.$refs[formName].resetFields();
              }else{
                  this.loading = false
                  this.dialogNewVisible = false
                  this.$message({
                      message: res.data.message,
                      type: 'error',
                      duration: 1500
                  })
                  return false
              } 
          }).catch(function (error) {
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    detailRow(index,data){ //查看详情
        this.editId = data.rows[index].id
        this.getDetail(data.rows[index].id).then(()=>{
          this.showTab = false
        })
        this.getDetailInfoList()
    },
    onSubmit() {
        console.log('submit!',this.formInline);
        this.currentPage4 = 1
        this.getList({...this.formInline}) //查询
      },
    getDetail(id){//机构详情
      return new Promise((rel,err)=>{
        this.$http.getDrugInfoApi({id:id},{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              this.detailData = res.data.data
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
    getDetailInfoList(val={}){    //患者赠药列表
        this.loading = true
        let data = {
              id:this.editId,
              page:1,
              rows:this.detailSelectRows?this.detailSelectRows:this.$my.rows,
              ...val
            }
        this.$http.getOrgInstoApi(data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){       
                this.loading = false;
                this.detailDataList = res.data.data
            }else{
                this.loading = false
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {
          this.loading = false
        })
      },
    getList(val={}){    
        this.loading = true
        let data = {
              page:1,
              rows:this.selectRows?this.selectRows:this.$my.rows,
              flag:'online',
              giveStatus:0,
              ...val
            }
            data.number = data.number?data.number.join(','):''
        this.$http.getDrugListApi(data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){       
                this.loading = false;
                this.tableData = res.data.data
            }else{
                this.loading = false
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {
          this.loading = false
        })
      },
      downExcel(){
        this.$my.downExcel('/down',{name:''},'数据','POST')
      },
      setSpec(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.spec[cellValue]:''
      },
      setStatus(row, column, cellValue, index){
        return cellValue == 1?'启用':'禁用'
      },
      setTime(row, column, cellValue, index){
        return cellValue?this.$my.timestampToTime(cellValue,'YMDHMS'):''
      },
      setType(row, column, cellValue, index){
        return cellValue ? this.$my.insto[cellValue]:''
      },
      instoStatus(row, column, cellValue, index){
        let arr = ['','待审核','通过','驳回','自动审核']
        return cellValue?arr[cellValue]:''
      },
      getName(){
        return '阿莫西林'
      }
  },

}
</script>

<style scoped>
.foot{margin-left: 200px;width:calc(100% - 200px)}
.w100px{width:100px;display: inline-block;}
.mb70{margin-bottom:70px}
.mlr0{margin-left:-4px !important;margin-right: 0 !important}
</style>

