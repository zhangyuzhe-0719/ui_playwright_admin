<template>
  <div class="app-container">
    <div style="margin-bottom:20px" class="fileter">
      <el-input v-model="fileter_get.case_name" v-if="fileter.case_name" placeholder="请输入用例名称" clearable size="small">
        <!-- <template slot="prepend">用例名称</template> -->
      </el-input>
      <el-input v-model="fileter_get.id" v-if="fileter.id" placeholder="请输入用例ID" clearable size="small"></el-input>
      <el-input v-model="fileter_get.element_value" v-if="fileter.element_value" placeholder="请输入元素地址" clearable size="small"></el-input>
      <el-button size="mini" type="" @click="getFileterCase()" style="margin-left:10px">搜索</el-button>
      <el-button size="mini" type="primary" @click="dialogVisible=true;resetForm(form,'form');caseTitle='新增用例'">新增</el-button>
      <el-button size="mini" type="primary" @click="result()">生成测试报告</el-button>
      <el-button size="mini" type="primary" @click="statusCase()">开始执行</el-button>
      <el-dropdown style="float:right" @click.stop>
        <el-button type="primary" size="mini">
          筛选条件<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-checkbox v-model="fileter.case_name" @click.stop>用例名称</el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox v-model="fileter.id" @click.stop>用例ID</el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox v-model="fileter.element_value">元素位置</el-checkbox>
          </el-dropdown-item>
          <!-- <el-checkbox v-model="fileter_case_name">用例ID</el-checkbox>
          <el-checkbox v-model="fileter_case_name">用例ID2</el-checkbox> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :row-style="row_style"
    >
      <el-table-column align="center" label="ID" width="95" prop="id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用例名称" width="110" align="center" prop="case_name">
        <template slot-scope="scope">
          <span>{{ scope.row.case_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="元素位置" align="center" prop="element_value" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.element_value }}
        </template>
      </el-table-column>
      <el-table-column label="类名称" width="110" align="center" prop="class_name">
        <template slot-scope="scope">
          <span>{{ scope.row.class_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL" width="110" show-overflow-tooltip>
        <template slot-scope="scope" prop="url" >
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column align="update_time" prop="created_at" label="更新时间" width="200" >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="dialogVisible=true;getOneCase(scope.row.id);caseTitle='编辑用例'">编辑</el-button>
          <el-button size="mini" type="primary" @click="open(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <el-dialog :visible.sync="dialogVisible" :title=caseTitle width="600px">
      <el-form 
      ref="form" :model="form" label-width="90px" label-position="right" :inline="true" size="mini" :rules="rules">
        <el-form-item label="用例名称" prop="case_name" >
          <el-input type="text" v-model=form.case_name placeholder=""></el-input>
        </el-form-item> 
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model=form.create_time placeholder="element" disabled></el-input>
        </el-form-item>
        <el-form-item label="类名称" prop="class_name">
          <el-input v-model=form.class_name placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="update_time">
          <el-input v-model=form.update_time placeholder="element" disabled></el-input>
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input v-model=form.url></el-input>
        </el-form-item>
        <el-form-item label="定位方法" prop="element">
          <el-input v-model=form.element placeholder="element"></el-input>
        </el-form-item>
        <el-form-item label="元素位置" prop="element_value">
          <el-input v-model=form.element_value></el-input>
        </el-form-item>
        <el-form-item label="元素下标" prop="element_sub" :inline="true">
          <el-input v-model=form.element_sub ></el-input>
        </el-form-item>
        <el-form-item label="页面下标" prop="page" :inline="true">
          <el-input v-model=form.page ></el-input>
        </el-form-item>
        <!-- <div style="display:inline-block"> -->
        <el-form-item label="操作动作" prop="convention">
          <el-select v-model=form.convention placeholder="请选择">
            <el-option v-for="item in convention_list"
              :key="item.value" 
              :value="item.value"
              :label="item.lable">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- </div> -->
        <!-- <div style="display:inline-block"> -->
        <el-form-item label="操作内容" prop="convention_value">
          <el-input v-model=form.convention_value ></el-input>
        </el-form-item>
        <!-- </div> -->
        <el-form-item label="比对事件" prop="assert_convention">
          <el-input v-model=form.assert_convention ></el-input>
        </el-form-item>
        <el-form-item label="比对信息" prop="assert_element">
          <el-input v-model=form.assert_element></el-input>
        </el-form-item>
        <el-form-item label="比对内容" prop="assert_value">
          <el-input v-model=form.assert_value></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动名称" prop="url">
          <el-input v-model=form.url></el-input>
        </el-form-item> -->
         
        <!-- <el-button size="mini" style="float:right" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" style="float:right;margin-right:10px" type="danger" @click="dialogVisible=false;createCase(form)">确认</el-button> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" type="danger" @click="dialogVisible=false;createCase(form);">确认</el-button>
      </div>
    </el-dialog>
    <div style="position:absolute;buttom:0;right:0">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[1,20,50,100]"
      :page-size="20"
      :total="case_number"
      layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getList,csUpdate,csDelete,csAdd,resultCreate,statusCase } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      run_list:[],
      listLoading: true,
      row_style: {
        height: '30px',

      },
      dialogVisible: false,
      getData: "",
      promp_message:"",
      case_number:0,
      prj_id:"1",
      // case_sum,
      fileter:{
        id: true, 
        project_id: true, 
        class_name: true, 
        url: true, 
        case_name: true, 
        element: true, 
        element_value: false, 
        element_sub: true, 
        convention:true, 
        convention_value: true, 
        assert_convention: true, 
        assert_element: true, 
        assert_value: true, 
        page: true, 
        platform: true, 
        create_time: true, 
        update_time: true        
      },
      fileter_get: {
        case_name:"",
        id:"",
        element_value:"",
        page_size:1,
        page_num:20
      },
      // form: null
      form:{
        id: "", 
        project_id: this.prj_id, 
        class_name: "", 
        url: "", 
        case_name: "", 
        element: "", 
        element_value: "", 
        element_sub: "", 
        convention: "", 
        convention_value: "", 
        assert_convention: "", 
        assert_element: "", 
        assert_value: "", 
        page: "", 
        platform: "", 
        create_time: "", 
        update_time: ""
      },

      convention_list :[{
        value: "",
        lable: "---暂无选择---"
      },{
        value: "convention",
        lable: "常规"
      },{
        value: "fill",
        lable: "输入",
      },{
        value: "keyboard",
        lable: "键盘"
      }],
      convention_value: "",
      caseTitle: "1",
      rules:{
        case_name:[{ required: true, message: '请输入用例名称', trigger: 'blur' }],
        class_name:[{ required: true, message: '请输入类别名称', trigger: 'blur' }],
        element_value:[{ required: true, message: '请输入元素位置', trigger: 'blur' }],
        element:[{ required: true, message: '请输入定位方法', trigger: 'blur' }],
        convention_value:[{ required: true, message: '请输入操作内容', trigger: 'blur' }],
        convention:[{ required: true, message: '请选择操作动作', trigger: 'change' }],
      }
    }
  },
  created() {
    this.caseGet()
    // this.list = [{
    //     id: "1", 
    //     project_id: "", 
    //     class_name: "class_name", 
    //     url: "url", 
    //     case_name: "case_name", 
    //     element: "element", 
    //     element_value: "element_value", 
    //     element_sub: "element_sub", 
    //     convention: "convention", 
    //     convention_value: "convention_value", 
    //     assert_convention: "n", 
    //     assert_element: "assert_element", 
    //     assert_value: "assert_value", 
    //     page: "page", 
    //     platform: "platform", 
    //     create_time: "", 
    //     update_time: ""
    //   }],
    // this.listLoading = false
  },
  methods: {
    caseGet(data="") {
      // debugger
      this.listLoading = true
      getList(data).then(response => {
        this.list = response.data.case
        this.case_number= response.data.case_sum
        this.listLoading = false
      })
    },
    // 弹窗提示
    popMessage(da){
      if (da=="success") {
        this.$notify({
          title: "success",
          message: this.promp_message,
          type: "success",
          duration: 2500
        })
      } else if(da=="info"){
        this.$notify({
          title: "提示",
          message: this.promp_message,
          type: "info",
          duration: 2500
        })
      } else{
        this.$notify({
          title: "error",
          message: this.promp_message,
          type: "error",
          duration: 2500
        })
      }
    },

    // 重新加载页面
    pageOver(){
      location.reload()
    },
    getOneCase(id){
      getList(`?id=${id}`).then(response => {
        this.form = response.data.case[0]
      })
    },
    // 获取每页条数
    handleSizeChange(val) {
      this.fileter_get.page_num = val
      this.getFileterCase()
    },
    //获取页码
    handleCurrentChange(val) {
      this.fileter_get.page_size = val
      this.getFileterCase()
    },
    //发送过滤信息请求
    getFileterCase() {
      var str = "?"
      for (const key in this.fileter_get) {
        var value = this.fileter_get[key]
        if (value) {
          str =  str + `${key}=${value}&`
        }
      }
      if (str=="?") {
        getList().then(response => {
          this.list = response.data.case
          this.case_sum = response.data.case_sum
        })
      } else {
        getList(str.substr(0,str.length-1)).then(response => {
          this.list = response.data.case
          this.case_sum = response.data.case_sum
        })
      }
    },
    caseUpdate(data){
      csUpdate(data).then(response =>{
        this.promp_message = "更新用例成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },

    caseAdd(data){
      csAdd(data).then(response => {
        this.promp_message = "添加用例成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },

    caseDelete(id){
      csDelete(id).then(response =>{
        this.promp_message = "删除成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },
    result(){
      resultCreate().then(response =>{
      })
    },

    createCase(data){
      if (this.caseTitle=="新增用例") {
        this.caseAdd(data)
      } else {
        this.caseUpdate(data)
      }
    },

    // 将表单返回为默认值
    resetForm(form,forname){
      if (form) {
        this.$refs[forname].resetFields();
      } else {
      }
      // this.$refs[forname].resetFields();
    },
    
    statusCase() {
      statusCase().then(response =>{
        this.promp_message = "执行成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },

    // 设置弹窗
    open(id){
      
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        
      }).then(() => {
        this.caseDelete(id)
      }).catch(() => {
        this.promp_message = "已取消删除"
        this.popMessage("info")
      });
    }
  }
}
</script>

<style>
  .el-checkbox {
    font-size:10px;
    margin-left: 10px;
    
  }
  .fileter .el-input{
    width: 19%;
    margin-left: 10px;
  }
</style>
