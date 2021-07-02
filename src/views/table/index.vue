<template>
  <div class="app-container">
    <div style="margin-bottom:20px">
      <el-input v-model="getData" style="width:40%" placeholder="筛选用例名称"></el-input>
      <el-button size="mini" type="" @click="caseGet()" style="margin-left:10px">搜索</el-button>
      <el-button size="mini" type="primary" @click="dialogVisible=true;resetForm(form,'form');caseTitle='新增用例'">新增</el-button>
      <el-button size="mini" type="primary" @click="result()">生成测试报告</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
      <el-table-column label="元素位置" align="center" prop="element_value">
        <template slot-scope="scope">
          {{ scope.row.element_value }}
        </template>
      </el-table-column>
      <el-table-column label="类名称" width="110" align="center" prop="class_name">
        <template slot-scope="scope">
          <span>{{ scope.row.class_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL" width="110">
        <template slot-scope="scope" prop="url">
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
  
    <el-dialog :visible.sync="dialogVisible" :title=caseTitle>
      <el-form 
      ref="form" :model="form" label-width="90px" :inline="true" :rules="rules">
        <el-form-item label="用例名称" prop="case_name">
          <el-input v-model=form.case_name placeholder=""></el-input>
        </el-form-item> 
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model=form.create_time placeholder="element" disabled></el-input>
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
        <el-form-item label="活动名称" prop="url">
          <el-input v-model=form.url></el-input>
        </el-form-item> 
        <el-button size="mini" style="" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" type="danger" @click="dialogVisible=false;createCase(form)">确认</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getList,csUpdate,csDelete,csAdd,resultCreate } from '@/api/table'

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
      list: null,
      listLoading: true,
      dialogVisible: false,
      getData: "",
      // form: null
      form:{
        id: "", 
        project_id: "", 
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
      caseTitle: "1"
    }
  },
  created() {
    this.caseGet()
  },
  methods: {
    caseGet() {
      // debugger
      this.listLoading = true
      getList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },

    // 重新加载页面
    pageOver(){
      location.reload()
    },
    getOneCase(id) {
      getList(`?id=${id}`).then(response => {
        this.form = response.data[0]
      })
    },
    caseUpdate(data){
      csUpdate(data).then(response =>{
        this.caseGet()
      })
    },

    caseAdd(data){
      csAdd(data).then(response => {
        this.caseGet()
      })
    },

    caseDelete(id){
      csDelete(id).then(response =>{
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
    
    // 设置弹窗
    open(id){
      
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        
      }).then(() => {
        this.caseDelete(id),
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
         
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>
