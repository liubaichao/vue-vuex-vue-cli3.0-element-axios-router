<template>
<!-- 线上审核列表 -->
  <div class="OnlineAudit">
    <el-row :gutter="12" class="mt10 mlr0">
      <el-col :span="24">
        <el-card shadow="always" class='ml20 mr20' v-show="showTab">
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
            <el-table-column prop="cityName" label="城市"></el-table-column>
            <el-table-column prop="hospitalName" width="150" show-overflow-tooltip label="医院"></el-table-column>
            <el-table-column prop="hospitalDeptName" label="科室"></el-table-column>
            <el-table-column prop="doctorName" label="医生"></el-table-column>
            <el-table-column prop="createUserName" label="志愿者"></el-table-column>
            <el-table-column prop="giveType" label="赠药方案" :formatter='setGiveType'></el-table-column>
            <el-table-column prop="isFirst" label="类型" :formatter='setIsFirst'></el-table-column>
            <el-table-column prop="createTime" label="填报日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="commitTime" label="最后提交日期" :formatter='setTime'></el-table-column>
            <el-table-column prop="status" label="审核结果" :formatter='setStatus'></el-table-column>
            <el-table-column label="操作" align="center" width="60">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="detailRow(scope.$index, tableData)"
                  type="text"
                  size="small">
                  {{scope.row.status == 11?'审核':'查看'}}
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
          <el-form :model="audForm" ref="audForm" label-width="60px" class="fz14" label-position='left' :inline="true" >
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
                prop="invoiceAud"
                size="small"
                :rules="[{ required: true, message: '请选择'}]"
              >
                <el-select v-model="audForm.invoiceAud" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 11'>
                  <el-option label="通过" :value="1"></el-option>
                  <el-option label="不通过" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="audForm.invoiceAud == 2"
                label='原因'
                prop="invoiceRemarks"
                size="small"
                :rules="[{ required: true, message: '请填写'}]"
              >
                <el-input v-model="audForm.invoiceRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
              </el-form-item>
              <div v-for="(item,index) in audForm.invoiceList" :key='index' class="flex alic">
                <el-form-item>
                  <viewer :images='[item.url]'><img :src='item.url' width="50" height="50"/></viewer>
                </el-form-item>
                <el-form-item
                  :prop="'invoiceList.' + index + '.invoiceDate'"
                  :rules="{
                    required: true, message: '日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="item.invoiceDate"
                    type="date"
                    value-format='yyyy-MM-dd'
                    size="small"
                    :disabled='detailData.visit&&detailData.visit.status != 11'
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  :prop="'invoiceList.' + index + '.invoiceQty'"
                  :rules="{
                    required: true, message: '购药支数不能为空', trigger: 'blur'
                  }"
                >
                  <el-input-number v-model="item.invoiceQty" :min='1' placeholder='购药支数' size="small" :disabled='detailData.visit&&detailData.visit.status != 11'></el-input-number>
                </el-form-item>
                <el-form-item
                  :prop="'invoiceList.' + index + '.invoiceNo'"
                  :rules="{
                    required: true, message: '发票号不能为空', trigger: 'blur'
                  }"
                >
                  <el-input v-model="item.invoiceNo" placeholder='发票号' size="small" :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'invoiceList.' + index + '.source'"
                  :rules="{
                    required: true, message: '来源不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="item.source" placeholder="请选择" size="small" :disabled='detailData.visit&&detailData.visit.status != 11'>
                    <el-option label="药店" :value="1"></el-option>
                    <el-option label="门诊" :value="2"></el-option>
                    <el-option label="医院" :value="3"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-row>

            <el-divider content-position="left">身份证</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="cardIdAud"
              size="small"
              :rules="[{ required: true, message: '请选择',trigger: 'change'}]"
            >
              <el-select v-model="audForm.cardIdAud" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 11'>
                <el-option label="通过" :value="1"></el-option>
                <el-option label="不通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.cardIdAud == 2"
              class="ml20"
              label='原因'
              prop="cardIdRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input v-model="audForm.cardIdRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.cardIdUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.cardIdUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>

            <el-divider content-position="left">处方笺</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="prescriptionAud"
              size="small"
              :rules="[{ required: true, message: '请选择'}]"
            >
              <el-select v-model="audForm.prescriptionAud" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 11'>
                <el-option label="通过" :value="1"></el-option>
                <el-option label="不通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.prescriptionAud == 2"
              class="ml20"
              label='原因'
              prop="prescriptionRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input v-model="audForm.prescriptionRemarks" style="width:210px" clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
            </el-form-item>
            <el-form-item
              class="ml20"
              label='剂量'
              prop="dose"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input-number v-model="audForm.dose" :min='1' placeholder='每周剂量' clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input-number>
            </el-form-item>
            <el-form-item
              class="ml20"
              label='支数'
              prop="prescriptionCount"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input-number v-model="audForm.prescriptionCount" :min='1' placeholder='支数' clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input-number>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.prescriptionUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.prescriptionUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>
  
            <el-divider content-position="left">冷链知情同意书</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="coldChainInformedAud"
              size="small"
              :rules="[{ required: true, message: '请选择'}]"
            >
              <el-select v-model="audForm.coldChainInformedAud" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 11'>
                <el-option label="通过" :value="1"></el-option>
                <el-option label="不通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.coldChainInformedAud == 2"
              class="ml20"
              label='原因'
              prop="coldChainInformedRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input v-model="audForm.coldChainInformedRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.coldChainInformedUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.coldChainInformedUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>
            
            <el-divider content-position="left">申请评估表</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="applicateEvaluAud"
              size="small"
              :rules="[{ required: true, message: '请选择'}]"
            >
              <el-select v-model="audForm.applicateEvaluAud" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 11'>
                <el-option label="通过" :value="1"></el-option>
                <el-option label="不通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.applicateEvaluAud == 2"
              class="ml20"
              label='原因'
              prop="applicateEvaluRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input v-model="audForm.applicateEvaluRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
            </el-form-item>
            <viewer :images='detailData.visit?detailData.visit.applicateEvaluUrl:[]' class='flex'>
              <img :src='item' v-for="(item,i) in detailData.visit?detailData.visit.applicateEvaluUrl:[]" :key='i' class='ml20' width="50" height="50"/>
            </viewer>

            <el-divider content-position="left">患者知情同意书</el-divider>
            <el-form-item
              class="ml20"
              label='审核'
              prop="patientInformedAud"
              size="small"
              :rules="[{ required: true, message: '请选择'}]"
            >
              <el-select v-model="audForm.patientInformedAud" placeholder="请选择" :disabled='detailData.visit&&detailData.visit.status != 11'>
                <el-option label="通过" :value="1"></el-option>
                <el-option label="不通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="audForm.patientInformedAud == 2"
              class="ml20"
              label='原因'
              prop="patientInformedRemarks"
              size="small"
              :rules="[{ required: true, message: '请填写'}]"
            >
              <el-input v-model="audForm.patientInformedRemarks" style="width:500px" clearable :disabled='detailData.visit&&detailData.visit.status != 11'></el-input>
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
                <el-button type="primary" size="small" slot="reference" @click="isSubmit('audForm')" :disabled='detailData.visit&&detailData.visit.status != 11'>确定</el-button>
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
import Vue from 'vue'
import { 
  Form,FormItem,Row,Col,Button ,Loading ,
  Pagination,Table,TableColumn,Select,Option,
  Card,Input ,DatePicker ,Footer,Divider,InputNumber,
  Popover 
  } from 'element-ui';

const arr = [
  Form,FormItem,Row,Col,Button ,Pagination,
  Table,TableColumn,Select,Option,Card,
  Input,DatePicker ,Footer,Divider,InputNumber,
  Popover
  ] 
arr.map((e)=>{  //动态生成全局组件
   //Vue.use(e);
   Vue.component(e.name, e)
})
Vue.use(Loading.directive);

import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'OnlineAudit',
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
        invoiceList:[],//{invoiceDate:'',invoiceQty:'',invoiceNo:'',source:''}
        invoiceAud:'',
        invoiceRemarks:'',
        cardIdAud:'',
        cardIdRemarks:'',
        prescriptionAud:'',
        prescriptionRemarks:'',
        coldChainInformedAud:'',
        coldChainInformedRemarks:'',
        applicateEvaluAud:'',
        applicateEvaluRemarks:'',
        patientInformedAud:'',
        patientInformedRemarks:'',
        dose:'',
        prescriptionCount:''
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
      let that = this
      this.$axios.get(that.$my.api + '/bms/visit/getDetail?id='+id,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){    
              let data =  res.data.data  
              let invoice = []
              data.approveLogList.map((item)=>{
                item.createTime = that.$my.timestampToTime(item.createTime,'YMDHMS')
              })
              data.visit.giveType = `${that.$my.giveType[data.visit.giveType]}(${that.$my.spec[data.visit.spec]})`
              data.invoiceList.map((item)=>{ //发票
                invoice.push({invoiceDate:that.$my.timestampToTime(item.invoiceDate,'YMD'),invoiceQty:item.invoiceQty,invoiceNo:item.invoiceNo,source:item.source,url:item.invoiceUrl,id:item.id})
              })            
              data.visit.cardIdUrl = data.visit.cardIdUrl.split(',')//身份证
              data.visit.prescriptionUrl = data.visit.prescriptionUrl.split(',')//处方笺
              data.visit.coldChainInformedUrl = data.visit.coldChainInformedUrl.split(',')//冷链
              data.visit.applicateEvaluUrl = data.visit.applicateEvaluUrl.split(',')//申请评估
              data.visit.patientInformedUrl = data.visit.patientInformedUrl.split(',')//患者同意书
              that.detailData = data

              that.audForm = {
                invoiceList:invoice,
                invoiceAud:data.visit.invoiceAud?data.visit.invoiceAud:"",
                invoiceRemarks:data.visit.invoiceRemarks,
                cardIdAud:data.visit.cardIdAud?data.visit.cardIdAud:'',
                cardIdRemarks:data.visit.cardIdRemarks,
                prescriptionAud:data.visit.prescriptionAud?data.visit.prescriptionAud:'',
                prescriptionRemarks:data.visit.prescriptionRemarks,
                coldChainInformedAud:data.visit.coldChainInformedAud?data.visit.coldChainInformedAud:'',
                coldChainInformedRemarks:data.visit.coldChainInformedRemarks,
                applicateEvaluAud:data.visit.applicateEvaluAud?data.visit.applicateEvaluAud:'',
                applicateEvaluRemarks:data.visit.applicateEvaluRemarks,
                patientInformedAud:data.visit.patientInformedAud?data.visit.patientInformedAud:'',
                patientInformedRemarks:data.visit.patientInformedRemarks,
                dose:data.visit.prescriptionDose,
                prescriptionCount:data.visit.prescriptionCount
              }
              that.showTab = false
            }else{

                that.$message({
                    message: res.data.msg,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {})
    },
    getList(val={}){    
        let that = this
        this.loading = true
        let data = {
              page:1,
              rows:that.selectRows?that.selectRows:that.$my.rows,
              flag:'online',
              ...val
            }
            data.number = data.number?data.number.join(','):''
        this.$axios.post(that.$my.api + '/bms/visit/getList', data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
            if(res.data&&res.data.code === 200){       
                that.loading = false;
                that.tableData = res.data.data
            }else{
                that.loading = false
                that.$message({
                    message: res.data.msg,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        }).catch(function (error) {
          that.loading = false
        })
      },
      isSubmit(formName){
        this.$refs[formName].validate((valid) => {
          let arr = ['invoiceAud','cardIdAud','prescriptionAud','coldChainInformedAud','applicateEvaluAud','patientInformedAud']
          let status = arr.every((item)=>this.audForm[item] != 2) ? 1 : 2;//验证(1:通过  2:不通过)
          this.status = status == 1?'通过':'不通过'
        });
      },
      submitData(formName){        
        let that = this
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.$refs[formName].validate((valid) => {
          let so = []
          let soArr = ['invoiceRemarks','cardIdRemarks','prescriptionRemarks','coldChainInformedRemarks','applicateEvaluRemarks','patientInformedRemarks']
          let arr = ['invoiceAud','cardIdAud','prescriptionAud','coldChainInformedAud','applicateEvaluAud','patientInformedAud']
          let status = arr.every((item)=>this.audForm[item] != 2) ? 1 : 2;//验证(1:通过  2:不通过)
          arr.map((item,i)=>{
            if(this.audForm[item] == 2){
              so.push(this.audForm[soArr[i]])
            }                                                    
          })
          if (valid) {
            let data ={
              ...this.audForm,
              id:this.editId,
              checkStatus:status,
              employeeId:userInfo.id,
              employeeName:userInfo.loginName,
              failReason:so.join(',')
            }
            this.$axios.post(that.$my.api + '/bms/visit/onlineCheck', data,{headers:{token:userInfo.token}}).then(res => { 
                if(res.data&&res.data.code === 200){       
                    that.loading = false;
                    that.submitVisible = false
                    that.showTab = true
                    that.$message({
                        message: res.data.message,
                        type: 'success',
                        duration: 1500
                    })
                    that.getList({...that.formInline})
                    that.$refs[formName].resetFields();
                }else{
                    that.loading = false
                    that.submitVisible = false
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
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
.foot{margin-left: 200px;width:calc(100% - 200px)}
.w100px{width:100px;display: inline-block;}
.mb70{margin-bottom:70px}
.mlr0{margin-left:-4px !important;margin-right: 0 !important}
</style>

