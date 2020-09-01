<template>
<!-- 快递列表 -->
  <div class="ExpressList" >
    <el-row :gutter="12" class="mt10 mlr0">
      <el-col :span="24">
        <el-card shadow="always">
          <el-form :inline="true" :model="formInline" label-width="100px" class="demo-form-inline mt20">
            <el-form-item label="患者姓名">
              <el-input v-model="formInline.patientName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="formInline.cardId" size="small" clearable></el-input>
            </el-form-item>
            <br/>
            <el-form-item label="发件人">
              <el-input v-model="formInline.sender" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="快递单号">
              <el-input v-model="formInline.expressNo" size="small" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
            </el-form-item>
            <!--<el-form-item>
              <el-button type="primary" @click="newOne" size="small">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="downExcel" size="small">导出</el-button>
            </el-form-item> -->
          </el-form>
           <el-table
            v-loading="loading"
            size='small'
            :data="tableData.rows"
            style="width: 100%">
            <el-table-column prop="createTime" label="录入时间" :formatter='setTime'></el-table-column>
            <el-table-column prop="expressNo" label="快递单号" ></el-table-column>
            <el-table-column prop="patientName" label="患者姓名"></el-table-column>
            <el-table-column prop="sender" label="寄件人" ></el-table-column>
            <el-table-column prop="mailType" label="邮件类型"></el-table-column>
            <el-table-column prop="content" label="材料内容"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="editOne(scope.$index, tableData)"
                  type="text"
                  size="small">
                  编辑
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
      :title="newForm.id?'编辑快递':'新增快递'"
      :visible.sync="dialogNewVisible"
      width="60%"
       v-loading='loading'
      >
      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="100px" class="demo-ruleForm">
        
        <el-Row>
          <el-Col :span='12'>
            <el-form-item label="快递单号" size="small">
              <el-input v-model="newForm.code" disabled></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="录入时间" size="small">
              <el-date-picker
                v-model="newForm.time"
                type="date"
                value-format='yyyy-MM-dd'
                size="small"
                disabled
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="寄件人" size="small">
              <el-input v-model.number="newForm.people" disabled></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='12'>
            <el-form-item label="邮件类型" prop="mailType" size="small">
              <el-input v-model="newForm.mailType" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='24'>
            <el-form-item label="材料内容" prop="content" size="small">
              <el-input v-model="newForm.content" clearable></el-input>
            </el-form-item>
          </el-Col>
          <el-Col :span='24'>
            <el-form-item label="备注" prop="remarks" size="small">
              <el-input v-model="newForm.remarks" clearable></el-input>
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
export default {
  name: 'ExpressList',
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
          patientName:'',
          cardId:'',
          sender:'',
          expressNo:'',
        },
      
      dialogNewVisible:false,//新增
      newForm:{
        id:'',
        code:'',
        time:'',
        people:'',
        mailType:'',
        content:'',
        remarks:''
      },
      newRules: {
        mailType: [{ required: true, message: '请输入', trigger: 'blur'}],
        content:[{ required: true, message: '请输入', trigger: 'blur'}],
        remarks:[{ required: true, message: '请输入', trigger: 'blur'}],
      },
    }
  },
  created () {
    this.getList({...this.formInline})
  },
  methods: {
    handleSizeChange(val) {
      this.selectRows = val //用户控制rows
      this.getList({...this.formInline}) //查询
    },
    handleCurrentChange(val) {
      this.getList({...this.formInline ,page:val}) //用户选择页数
    },
    newOne(){//新增机构
      this.dialogNewVisible = true
      this.newForm.id = ''
      this.$nextTick(()=>{
        this.$refs['newForm'].resetFields();
      })
    },
    editOne(index,data){//编辑机构
      this.dialogNewVisible = true
      this.newForm.id = data.rows[index].id
      this.getDetail(data.rows[index].id).then((res)=>{       
        this.$nextTick(()=>{
          this.newForm = {
            code:res.expressNo,
            time:this.$my.timestampToTime(res.createTime,'YMDHMS'),
            people:res.sender,
            mailType:res.mailType,
            content:res.content,
            remarks:res.remarks,
            id:res.id
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
            // employeeId:userInfo.id,
            // employeeName:userInfo.loginName
          }
          this.$http.exModifyApi(data,{headers:{token:userInfo.token}}).then(res => { 
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
    onSubmit() {
        console.log('submit!',this.formInline);
        this.currentPage4 = 1
        this.getList({...this.formInline}) //查询
      },
    getDetail(id){//机构详情
      return new Promise((rel,err)=>{
        this.$http.getExInfoApi({id:id},{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
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
        this.loading = true
        let data = {
              page:1,
              rows:this.selectRows?this.selectRows:this.$my.rows,
              ...val
            }
            data.number = data.number?data.number.join(','):''
        this.$http.getEXListApi(data,{headers:{token:JSON.parse(localStorage.getItem('userInfo')).token}}).then(res => { 
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
      setTime(row, column, cellValue, index){
        return cellValue?this.$my.timestampToTime(cellValue,'YMDHMS'):''
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

