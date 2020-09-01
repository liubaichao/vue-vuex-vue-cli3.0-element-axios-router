<template>
<!-- 回执单列表 -->
  <div class="ReceiptList" v-loading="loading">
    <el-row :gutter="12" class="mt10 mlr0">
      <el-col :span="24">
        <el-card shadow="always" v-show="showTab">
          <el-form :inline="true" :model="formInline" label-width="100px" class="demo-form-inline mt20">
            <el-form-item label="患者姓名">
              <el-input v-model="formInline.patientName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="医院名称">
              <el-input v-model="formInline.hospitalName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="志愿者">
              <el-input v-model="formInline.volunteer" size="small" clearable></el-input>
            </el-form-item>
            <br/>
            <el-form-item label="状态">
              <el-select v-model="formInline.checkStatus" size="small" clearable>
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="审核通过" :value="2"></el-option>
                <el-option label="已驳回" :value="3"></el-option>
                <el-option label="全部" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="date"
                @change="setDate"
                size="small"
                type="daterange"
                value-format='yyyy-MM-dd'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="downExcel" size="small">导出</el-button>
            </el-form-item>
          </el-form>
           <el-table
            v-loading="loading"
            size='small'
            :data="tableData.rows"
            style="width: 100%">
            <el-table-column prop="patientName" label="患者姓名"></el-table-column>
            <el-table-column prop="provinceName" label="省份"></el-table-column>
            <el-table-column prop="cityName"  label="城市"></el-table-column>
            <el-table-column prop="hospitalName" width="150" show-overflow-tooltip label="医院"></el-table-column>
            <el-table-column prop="hospitalDeptName"  label="科室"></el-table-column>
            <el-table-column prop="doctorName" label="医生"></el-table-column>
            <el-table-column prop="createUserName" label="志愿者"></el-table-column>
            <el-table-column prop="giveType"  label="赠药方案" :formatter='setGiveType'></el-table-column>
            <el-table-column prop="isFirst" label="类型" :formatter='setIsFirst'></el-table-column>
            <el-table-column prop="createTime"  label="填报日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="commitTime"  label="最后提交日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="status"  label="审核结果" :formatter='setStatus'></el-table-column>
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="detailRow(scope.$index, tableData)"
                  type="text"
                  size="small">                 
                  {{scope.row.status == 21?'审核':'查看'}}
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
        <el-card shadow="always" class='ml20 mr20 mb70' v-show="!showTab">
          <el-form :model="audForm" ref="audForm" label-width="60px" label-position='left' class="fz14" :inline="true" >
            <el-row class="ml20 lh30">
              <el-col :span="12"><span class="fw w100px">志愿者：</span><span>{{detailData.visit?detailData.visit.createUserName:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">填报日期：</span><span>{{detailData.visit?detailData.visit.createTime:'' | timestampToTime('YMDHMS')}}</span></el-col>
            </el-row>

            <el-divider content-position="left">基础信息</el-divider>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">身份证号：</span><span>{{detailData.visit?detailData.visit.cardId:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">患者姓名：</span><span>{{detailData.visit?detailData.visit.patientName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">性别：</span><span>{{detailData.visit?detailData.visit.gender:'' | sex}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">年龄：</span><span>{{detailData.visit?detailData.visit.age:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">手机：</span><span>{{detailData.visit?detailData.visit.mobile:''}}</span></el-col>
            </el-row>

            <el-divider content-position="left">就诊信息</el-divider>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">区域：</span><span>{{detailData.visit?detailData.visit.provinceName+detailData.visit.cityName:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">医院名称：</span><span>{{detailData.visit?detailData.visit.hospitalName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">科室名称：</span><span>{{detailData.visit?detailData.visit.hospitalDeptName:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">医生姓名：</span><span>{{detailData.visit?detailData.visit.doctorName:''}}</span></el-col>
            </el-row>
            <el-row class="ml20 lh40">
              <el-col :span="12"><span class="fw w100px">赠药方案：</span><span>{{detailData.visit?detailData.visit.giveType:''}}</span></el-col>
              <el-col :span="12"><span class="fw w100px">疾病类型：</span><span>{{detailData.visit?detailData.visit.indication:'' | indication}}</span></el-col>
            </el-row>
            <el-divider content-position="left">操作记录</el-divider>
            <el-row class="ml20 lh20 fz12" v-for="(item,i) in detailData.approveLogList" :key='i'>
              {{item.createTime}} by 【{{item.createUserName}}】 {{item.remarks}}
            </el-row>

            <el-divider content-position="left">购药发票</el-divider>
            <el-row class="ml20 lh30">
              <el-form-item
                label='审核'
                prop="hasInvoice"
                size="small"
                :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
              >
                <el-select v-model="audForm.hasInvoice" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 21'>
                  <el-option label="有" :value="1"></el-option>
                  <el-option label="没有" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="audForm.hasInvoice == 2"
                label='原因'
                prop="hasInvoiceRemarks"
                size="small"
                :rules="[{ required: true, message: '请填写',trigger: 'blur'}]"
              >
                <el-input v-model="audForm.hasInvoiceRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 21'></el-input>
              </el-form-item>
              <viewer :images='detailData.visit?detailData.visit.invoiceUrl:[]' class='flex'>
                <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.invoiceUrl:[]" :key='i' class='ml20' width="50" height="50"/>
              </viewer>
            </el-row>

            <el-divider content-position="left">身份证</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="hasCardId"
              size="small"
              :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
            >
              <el-select v-model="audForm.hasCardId" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 21'>
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.hasCardId == 2"
              class="ml20"
              label='原因'
              prop="hasCardIdRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写',trigger: 'blur'}]"
            >
              <el-input v-model="audForm.hasCardIdRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 21'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.cardIdUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.cardIdUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>

            <el-divider content-position="left">处方笺</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="hasPrescription"
              size="small"
              :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
            >
              <el-select v-model="audForm.hasPrescription" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 21'>
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.hasPrescription == 2"
              class="ml20"
              label='原因'
              prop="hasPrescriptionRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写',trigger: 'blur'}]"
            >
              <el-input v-model="audForm.hasPrescriptionRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 21'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.prescriptionUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.prescriptionUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>
  
            <el-divider content-position="left">冷链知情同意书</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="hasColdChainInformed"
              size="small"
              :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
            >
              <el-select v-model="audForm.hasColdChainInformed" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 21'>
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.hasColdChainInformed == 2"
              class="ml20"
              label='原因'
              prop="hasColdChainInformedRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写',trigger: 'blur'}]"
            >
              <el-input v-model="audForm.hasColdChainInformedRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 21'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.coldChainInformedUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.coldChainInformedUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>
            
            <el-divider content-position="left">申请评估表</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="hasApplicateEvalu"
              size="small"
              :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
            >
              <el-select v-model="audForm.hasApplicateEvalu" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 21'>
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.hasApplicateEvalu == 2"
              class="ml20"
              label='原因'
              prop="hasApplicateEvaluRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写',trigger: 'blur'}]"
            >
              <el-input v-model="audForm.hasApplicateEvaluRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 21'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.applicateEvaluUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.applicateEvaluUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>

            <el-divider content-position="left">患者知情同意书</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="hasPatientInformed"
              size="small"
              :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
            >
              <el-select v-model="audForm.hasPatientInformed" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 21'>
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.hasPatientInformed == 2"
              class="ml20"
              label='原因'
              prop="hasPatientInformedRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写',trigger: 'blur'}]"
            >
              <el-input v-model="audForm.hasPatientInformedRemarks" style="width:500px" :disabled='detailData.visit&&detailData.visit.status != 21' clearable></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.patientInformedUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.patientInformedUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>
 
            <el-footer class="posFix bottom0 left0 bgf foot flex alic juste">
              <el-popover
                placement="top"
                width="160"
                v-model="submitVisible">
                <p>本次审核结果为【{{status}}】,是否提交？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="submitVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="submitData('audForm')">确定</el-button>
                </div>
                <el-button type="primary" size="small" slot="reference" @click="isSubmit('audForm')" :disabled='detailData.visit&&detailData.visit.status != 21'>确定</el-button>
              </el-popover>
              <el-button type="primary" size="small" @click="showTab = true" class="ml20 mr20">返回</el-button>
            </el-footer>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'ReceiptList',
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
      date:[],
      formInline: {
        startDate:'',
        endDate:'',
        patientName:'',
        hospitalName:'',
        volunteer:'',
        checkStatus:1,
      },
      editId:'',
      detailData:{},//详情
      audForm:{//审核表单
        hasInvoice:'',
        hasInvoiceRemarks:'',
        hasCardId:'',
        hasCardIdRemarks:'',
        hasPrescription:'',
        hasPrescriptionRemarks:'',
        hasColdChainInformed:'',
        hasColdChainInformedRemarks:'',
        hasApplicateEvalu:'',
        hasApplicateEvaluRemarks:'',
        hasPatientInformed:'',
        hasPatientInformedRemarks:''
      },
      status:'',
      submitVisible:false,
    }
  },
  created () {
   this.getList({...this.formInline})
  },
  methods: {
    setDate(date){
      this.formInline.startDate = date[0]
      this.formInline.endDate = date[1]
    },
    handleSizeChange(val) {
      this.selectRows = val //用户控制rows
      this.getList({...this.formInline}) //查询
    },
    handleCurrentChange(val) {
      this.getList({...this.formInline ,page:val}) //用户选择页数
    },
    detailRow(index,data){ 
        this.editId = data.rows[index].id
        this.getDetail(data.rows[index].id)
    },
    onSubmit() {
        console.log('submit!',this.formInline);
        this.currentPage4 = 1
        this.getList({...this.formInline}) //查询
      },
    getDetail(id){
      this.$http.getDetailApi({id:id},{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              let data =  res.data.data  
              data.approveLogList.map((item)=>{
                item.createTime = this.$my.timestampToTime(item.createTime,'YMDHMS')
              })
              data.visit.giveType = `${this.$my.giveType[data.visit.giveType]}(${this.$my.spec[data.visit.spec]})`   
              data.visit.invoiceUrl = data.visit.invoiceUrl.split(',')//购药发票        
              data.visit.cardIdUrl = data.visit.cardIdUrl.split(',')//身份证
              data.visit.prescriptionUrl = data.visit.prescriptionUrl.split(',')//处方笺
              data.visit.coldChainInformedUrl = data.visit.coldChainInformedUrl.split(',')//冷链
              data.visit.applicateEvaluUrl = data.visit.applicateEvaluUrl.split(',')//申请评估
              data.visit.patientInformedUrl = data.visit.patientInformedUrl.split(',')//患者同意书
              this.audForm = {
                hasInvoice: data.visit.hasInvoice?data.visit.hasInvoice:'',
                hasInvoiceRemarks: data.visit.hasInvoiceRemarks,
                hasCardId: data.visit.hasCardId?data.visit.hasCardId:'',
                hasCardIdRemarks: data.visit.hasCardIdRemarks,
                hasPrescription: data.visit.hasPrescription?data.visit.hasPrescription:'',
                hasPrescriptionRemarks: data.visit.hasPrescriptionRemarks,
                hasColdChainInformed: data.visit.hasColdChainInformed?data.visit.hasColdChainInformed:'',
                hasColdChainInformedRemarks: data.visit.hasColdChainInformedRemarks,
                hasApplicateEvalu: data.visit.hasApplicateEvalu?data.visit.hasApplicateEvalu:'',
                hasApplicateEvaluRemarks: data.visit.hasApplicateEvaluRemarks,
                hasPatientInformed: data.visit.hasPatientInformed?data.visit.hasPatientInformed:'',
                hasPatientInformedRemarks: data.visit.hasPatientInformedRemarks
              }
              this.detailData = data
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
    getList(val={}){    
        this.loading = true
        let data = {
              page:1,
              rows:this.selectRows?this.selectRows:this.$my.rows,
              flag:'receipt',
              ...val
            }
            data.number = data.number?data.number.join(','):''
        this.$http.getListApi(data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
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
      isSubmit(formName){
        this.$refs[formName].validate((valid) => {
          let arr = ['hasInvoice','hasCardId','hasPrescription','hasColdChainInformed','hasApplicateEvalu','hasPatientInformed']
          let status = arr.every((item)=>this.audForm[item] != 2) ? 1 : 2;//验证(1:通过  2:不通过)
          this.status = status == 1?'通过':'不通过'
        });
      },
      submitData(formName){        
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.$refs[formName].validate((valid) => {
          let arr = ['hasInvoice','hasCardId','hasPrescription','hasColdChainInformed','hasApplicateEvalu','hasPatientInformed']
          let status = arr.every((item)=>this.audForm[item] != 2) ? 1 : 2;//验证(1:通过  2:不通过)
          if (valid) {
            let data ={
              ...this.audForm,
              id:this.editId,
              checkStatus:status,
              employeeId:userInfo.id,
              employeeName:userInfo.loginName
            }
            this.$http.receiptCheckApi(data,{headers:{token:userInfo.token}}).then(res => { 
                if(res.data&&res.data.code === 200){       
                    this.loading = false;
                    this.submitVisible = false
                    this.showTab = true
                    this.$message({
                        message: res.data.message,
                        type: 'success',
                        duration: 1500
                    })
                    this.getList({...this.formInline})
                    this.$refs[formName].resetFields();
                }else{
                    this.loading = false
                    this.submitVisible = false
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
      downExcel(){
        this.$my.downExcel('/down',{name:''},'数据','POST')
      },
      setTime(row, column, cellValue, index){
        return cellValue?this.$my.timestampToTime(cellValue,'YMDHMS'):''
      },
      setIsFirst(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.isFirst[cellValue]:''
      },
      setGiveType(row, column, cellValue, index){
        let txt = `${this.$my.giveType[cellValue]}(${this.$my.spec[row.spec]})`
        return cellValue||cellValue==0? txt:''
      },
      setStatus(row, column, cellValue, index){
        return cellValue||cellValue==0?this.$my.status[cellValue]:''
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

