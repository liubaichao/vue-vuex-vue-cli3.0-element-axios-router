<template>
<!-- 患者列表 -->
  <div class="PatientList" v-loading="loading">
    <el-row :gutter="12" class="mt10 mlr0">
      <el-col :span="24">
        <el-card shadow="always" v-if="showTab">
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
            <el-form-item label="身份证号">
              <el-input v-model="formInline.cardId" size="small" clearable></el-input>
            </el-form-item>
            <br/>
            <el-form-item label="患者姓名">
              <el-input v-model="formInline.patientName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="医院名称">
              <el-input v-model="formInline.hospitalName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.giveStatus" size="small" clearable>
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="用药中" :value="2"></el-option>
                <el-option label="临期" :value="3"></el-option>
                <el-option label="过期" :value="4"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
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
            <el-table-column prop="patientName" label="患者姓名"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="gender" label="性别" :formatter='setSex'></el-table-column>
            <el-table-column prop="cardId" label="身份证"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="provinceName" label="省份"></el-table-column>
            <el-table-column prop="cityName" label="城市"></el-table-column>
            <el-table-column prop="hospitalName" show-overflow-tooltip label="医院"></el-table-column>
            <el-table-column prop="hospitalDeptName" label="科室"></el-table-column>
            <el-table-column prop="doctorName" label="医生"></el-table-column>
            <el-table-column prop="indication" label="疾病类型" :formatter='setIndication'></el-table-column>
            <el-table-column prop="status" label="赠药状态" :formatter='setStatus'></el-table-column>
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="scope">
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
              <el-col :span="12"><span class="fw w100px">身份证号：</span><span>{{detailData?detailData.cardId:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">患者姓名：</span><span>{{detailData?detailData.patientName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">性别：</span><span>{{detailData?detailData.gender:'' | sex}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">年龄：</span><span>{{detailData?detailData.age:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">手机：</span><span>{{detailData?detailData.mobile:''}}</span></el-col>
            </el-row>

            <el-divider content-position="left">就诊信息</el-divider>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">区域：</span><span>{{detailData?detailData.provinceName+detailData.cityName:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">医院名称：</span><span>{{detailData?detailData.hospitalName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">科室名称：</span><span>{{detailData?detailData.hospitalDeptName:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">医生姓名：</span><span>{{detailData?detailData.doctorName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">赠药方案：</span><span>{{detailData?detailData.giveType:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">志愿者：</span><span>{{detailData?detailData.createUserName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40 mb20">
              <el-col :span="12"><span class="fw w100px">疾病类型：</span><span>{{detailData?detailData.indication:'' | indication}}</span></el-col>
            </el-row>
           

            <el-table
            v-loading="loading"
            size='small'
            :data="detailDataList.rows"
            style="width: 100%">
            <el-table-column prop="patientName" label="患者姓名"></el-table-column>
            <el-table-column prop="provinceName" label="省份"></el-table-column>
            <el-table-column prop="cityName" label="城市"></el-table-column>
            <el-table-column prop="hospitalName" show-overflow-tooltip label="医院"></el-table-column>
            <el-table-column prop="hospitalDeptName" label="科室"></el-table-column>
            <el-table-column prop="doctorName" label="医生"></el-table-column>
            <el-table-column prop="giveType" label="赠药方案" :formatter='setGiveType'></el-table-column>
            <el-table-column prop="isFirst" label="类型" :formatter='setIsFirst'></el-table-column>
            <el-table-column prop="createTime" label="填报日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="commitTime"  label="审核通过日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="commitTime" label="用药日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="status" label="审核结果" :formatter='setStatus'></el-table-column>
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
  </div>
</template>

<script>

export default {
  name: 'PatientList',
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
        cardId:'',
        provinceId:'',
        giveStatus:1,
        patientName:'',
        hospitalName:''
      },
      options:[],
      editId:'',
      detailData:{},//详情
      detailDataList:{
        rows:[],
        total:0
      },
      detailSelectRows:'',
      detailCurrentPage4: 1,
      currentPage2: 1,
      provincesArr:[],
      cityArr:[],
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
    detailRow(index,data){ 
        this.editId = data.rows[index].id
        this.getDetail(data.rows[index].id)
        this.getDetailInfoList()
    },
    onSubmit() {
        console.log('submit!',this.formInline);
        this.currentPage4 = 1
        this.getList({...this.formInline}) //查询
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
    getCityList(code){
      this.$http.getCityListApi({code:code}).then(res => {
          if(res.data&&res.data.code == 200){
            this.cityArr= res.data.data
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
    getDetail(id){
      this.$http.getPatientInfoApi({id:id},{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              this.detailData = res.data.data
              this.showTab = false
            }else{

                this.$message({
                    message: res.data.msg,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {})
    },
    getDetailInfoList(val={}){    //患者赠药列表
        this.loading = true
        let data = {
              id:this.editId,
              page:1,
              rows:this.detailSelectRows?this.detailSelectRows:this.$my.rows,
              ...val
            }
        this.$http.getPaVisitApi(data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){       
                this.loading = false;
                this.detailDataList = res.data.data
            }else{
                this.loading = false
                this.$message({
                    message: res.data.msg,
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
              ...val
            }
        this.$http.getPatientListApi(data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){       
                this.loading = false;
                this.tableData = res.data.data
            }else{
                this.loading = false
                this.$message({
                    message: res.data.msg,
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
      setGiveType(row, column, cellValue, index){
        let txt = `${this.$my.giveType[cellValue]}(${this.$my.spec[row.spec]})`
        return cellValue||cellValue==0? txt:''
      },
      setIsFirst(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.isFirst[cellValue]:''
      },
      setStatus(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.status[cellValue]:''
      },
      setTime(row, column, cellValue, index){
        return cellValue?this.$my.timestampToTime(cellValue,'YMDHMS'):''
      },
      setSex(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.sex[cellValue]:''
      },
      setIndication(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.indication[cellValue]:''
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

