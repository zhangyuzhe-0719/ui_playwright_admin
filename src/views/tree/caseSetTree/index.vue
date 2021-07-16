<template>
  <div class="app-container">
    <div>
      <el-input v-model="filterText" placeholder="Filter keyword" style="width:19%;margin-right:10px" size="small" clearable/>
      <el-button @click="resetChecked()" size="small" type="primary">清空</el-button>
      <el-button @click="setCheckedNodes()" size="small" type="primary">全选</el-button>
      <el-button size="small" type="primary">开始执行</el-button>
      <el-button size="small" type="primary" @click="putTestSet">保存</el-button>
    </div>
    <div class="treeData">
      <el-tree
        ref="tree2"
        :data="data2"
        :props="defaultProps"
        class="filter-tree"
        default-expand-all
        show-checkbox
        node-key="id"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{node,data}" @mouseenter="mouSeenter(data)" @mouseleave="mouseLeave(data)" style="width:100%">
          <span>
            <i style="margin-right:10px" class="el-icon-folder-opened" v-if="data.type=='application'"></i>
            <i style="margin-right:10px" class="el-icon-tickets" v-if="data.type=='text'"></i>
            <span style="font-size:14px" 
            @click="caseDialog=true;UpdateData(data)" 
            @mouseenter="dataMouseenter(data)" 
            @mouseleave="dataMouseLeave(data)"
            :style="data.fontColor"
            >{{ node.label}} </span>
              <el-button
                type="text"
                size="mini"
                style="margin-left:10px"
                v-if="data.type=='application'&&data.hoverFile=='true'"
                @click="appendClick(data)"
                >
                新增
              </el-button>
              <el-button
                type="text"
                size="mini"
                style="margin-left:10px"
                v-if="data.hoverFile=='true'"
                @click="caseDialog=true;UpdateData(data)">
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                style="margin-left:10px"
                v-if="data.hoverFile=='true' && data.children==null"
                @click="deleteData(data)">
                删除
              </el-button>
          </span>      
          <span class="aaa" v-if="data.appendFile=='true'&&data.hoverFile=='true'">
            <el-button size="mini" type="text" style="margin-left:10px" @click="putClick(data)">提交</el-button>
            <el-input v-model="putForm.class_name"></el-input>
          </span>
        </span>
      </el-tree>
    </div>
    <transition name="el-fade-in-linear">
      <div class="updataDialog" v-if="caseDialog">
        <div class="dialogTitle">
          <span style="color:#606266">{{ form.case_name + ' #' + form.id}}</span>
          <i class="el-icon-close" style="float:right" @click="caseDialog=false"></i>
        </div>
        <div class=dialogBody>
          <el-form 
            ref="form" :model="form" label-width="90px" label-position="right" :inline="true" size="mini">
              <el-form-item label="用例名称" prop="case_name" >
                <el-input type="text" v-model=form.case_name placeholder=""></el-input>
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
              <el-form-item label="操作动作" prop="convention">
                <el-select v-model=form.convention placeholder="请选择" style="width:159px">
                  <el-option v-for="item in convention_list"
                    :key="item.value" 
                    :value="item.value"
                    :label="item.lable">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作内容" prop="convention_value">
                <el-input v-model=form.convention_value ></el-input>
              </el-form-item>
              <el-form-item label="比对事件" prop="assert_convention">
                <el-input v-model=form.assert_convention ></el-input>
              </el-form-item>
              <el-form-item label="比对信息" prop="assert_element">
                <el-input v-model=form.assert_element></el-input>
              </el-form-item>
              <el-form-item label="比对内容" prop="assert_value">
                <el-input v-model=form.assert_value></el-input>
              </el-form-item>
          </el-form>
        </div>
        <div class="dialogFooter">
          <el-button type="text">上一条</el-button>
          <el-button type="text">下一条</el-button>
          <el-button size="mini" @click="caseDialog=false">取消</el-button>
          <el-button size="mini"  type="danger" @click="caseDialog=false;caseUpdate(form)">确认</el-button>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="updataDialog" v-if="classDialog">
        <div class="dialogTitle">
          <span style="color:#606266">{{ clForm.class_name + ' #' + clForm.id}}</span>
          <i class="el-icon-close" style="float:right" @click="classDialog=false"></i>
        </div>
        <div class="dialogBody">
          <el-form 
            ref="clForm" :model="clForm" label-width="90px" label-position="right"  size="mini">
              <el-form-item label="类别名称" prop="class_name" >
                <el-input type="text" v-model=clForm.class_name placeholder=""></el-input>
              </el-form-item> 
              <el-form-item label="父级类名" prop="father_name" >
                <el-input type="text" v-model=clForm.father_name placeholder=""></el-input>
              </el-form-item> 
              <el-form-item label="创建时间" prop="create_time">
                <el-input v-model=clForm.create_time disabled></el-input>
              </el-form-item>
              <el-form-item label="更新时间" prop="update_time">
                <el-input v-model=clForm.update_time disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <div class="dialogFooter">
          <el-button size="mini" @click="classDialog=false">取消</el-button>
          <el-button size="mini"  type="danger" @click="classDialog=false;clUpdate()">确认</el-button>
        </div>
      </div>
    </transition>
    <!-- <transition>
      <div>
        <el-dialog 
        :visible.sync="dialogVisible"
        :title="form.case_name + ' #' + form.id"
        width="600px"
        top="0px" 
        :modal="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        custom-class="datacs">
          <el-form 
          ref="form" :model="form" label-width="90px" label-position="right" :inline="true" size="mini">
            <el-form-item label="用例名称" prop="case_name" >
              <el-input type="text" v-model=form.case_name placeholder=""></el-input>
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
            <el-form-item label="操作动作" prop="convention">
              <el-select v-model=form.convention placeholder="请选择">
                <el-option v-for="item in convention_list"
                  :key="item.value" 
                  :value="item.value"
                  :label="item.lable">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作内容" prop="convention_value">
              <el-input v-model=form.convention_value ></el-input>
            </el-form-item>
            <el-form-item label="比对事件" prop="assert_convention">
              <el-input v-model=form.assert_convention ></el-input>
            </el-form-item>
            <el-form-item label="比对信息" prop="assert_element">
              <el-input v-model=form.assert_element></el-input>
            </el-form-item>
            <el-form-item label="比对内容" prop="assert_value">
              <el-input v-model=form.assert_value></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text">上一条</el-button>
            <el-button type="text">下一条</el-button>
            <el-button size="mini" @click="dialogVisible=false">取消</el-button>
            <el-button size="mini"  type="danger" @click="dialogVisible=false;caseUpdate(form)">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </transition> -->
  </div>
</template>

<script>
import {getTree} from '@/api/tree'
import { getList,csUpdate,csDelete} from '@/api/table'
import { addClass,getClass,updateClass,deleteClass} from '@/api/classOperation'


export default {

  data() {
    return {
      // checkList:this.$router.query.id,
      filterText: '',
      checkIdList: [],
      dialogVisible: false,
      caseDialog: false,
      classDialog: false,
      csDataStyle: {
        color:''
      },
      putForm:{
        class_name:'',
        father_id:''
      },
      data3: [{
        id: 1,
        label: '项目名称',
        children: [{
          id: 4,
          label: '用例类别',
          children: [{
            id: 9,
            label: '用例名称'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
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
      clForm:{
        id:'',
        update_time:'',
        create_time:'',
        class_name:''
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

      data2:[{
        id:'1',
        label:'测试类',
        type:'application',
        children:[{
          id:'2',
          label:'打开页面',
          type:'text'
        },{
          id:'3',
          label:'点击联系人',
          type:'text'
        },{
          id:'4',
          label:'发送微聊',
          type:'text'
        }]
      },{
        id:'2',
        label:'测试类2',
        type:'application',
        children:[{
          id:'2',
          label:'打开58',
          type:'text'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  created() {
    this.csGet()
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },


    // 返回当前全部被选择的节点data的list
    getCheckedNodes (){
      var listData= this.$refs.tree2.getCheckedNodes()
      var newList = []
      for(const key in listData) {
        if (key.type == 'text'){
          newList.push(key.id)
        }
      }
      return newList
    },
    //设置目前的节点id为空
    resetChecked() {
      this.$refs.tree2.setCheckedKeys([])
    },

    getCheckedKeys() {
      return this.$refs.tree2.getCheckedKeys()
    },
    //通过keys获取当前id
    // setCheckedKeys() {
    //   return this.$refs.tree2.setCheckedKeys()
    // },
    //通过node-key设置目前勾选的值
    setCheckedNodes() {
      this.$refs.tree2.setCheckedNodes(this.data2)
    },
    putTestSet() {
      var caseList = this.getCheckedNodes()
      var dataList = this.getCheckedKeys()
    },

    getOneCase(id){
      getList(`?id=${id}`).then(response => {
        this.form = response.data.case[0]
      })
    },
    getOneClass(id){
      var nawId = id.replace('class','')
      getClass(`?id=${nawId}`).then(response=>{
        this.clForm = response.data[0]
      })
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
    clUpdate(){
      deleteClass(this.clForm).then(response=>{
        this.promp_message = "更新类成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },
    clDelete(id){
      updateClass(id).then(response=>{
        this.promp_message = "删除类成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },
    caseDelete(id) {
      caseDelete(id).then(response=>{
        this.promp_message = "删除用例成功"
        this.popMessage("success")
      }).catch(response =>{
        this.promp_message = response.data
        this.popMessage("")
      })
    },
    ceshi(cs) {
      console.log(cs)
    },
    
    deleteData(data){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (data.type=='application'){
          this.clDelete(data.id.replace('class',''))
        } else {
          this.caseDelete(id)
        }
      }).catch(() => {
        this.promp_message = "已取消删除"
        this.popMessage("info")
      });
    },

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
    // 查看详情 判断是类别还是用例，进行区分请求
    UpdateData(data) {
      if (data.type=='application'){
        this.caseDialog = false
        this.classDialog = true
        this.getOneClass(data.id)
      } else {
        this.classDialog = false
        this.caseDialog = true
        this.getOneCase(data.id)
      }
    },
    //获取所有用例生成树结构
    csGet() {
      getTree().then(response => {
        this.data2 = response.data
      })
    },
    // 名称悬浮操作改变样式
    dataMouseenter(data) {
      var c = {color: '#409eff'}
      this.$set(data,'fontColor', c)
    },
    // 名称离开操作改变样式
    dataMouseLeave(data) {
      var c = {color: ''}
      this.$set(data,'fontColor', c)
    },
    // 勾选框悬浮改变样式
    mouSeenter(data){
      this.$set(data,'hoverFile','true')
    },
    //勾选框离开改变样式
    mouseLeave(data){
      this.$set(data,'hoverFile','false')
      this.$set(data,'appendFile','false')
    },
    // 新增按钮点击展开输入框
    appendClick(data) {
      this.$set(data,'appendFile','true')
    },

    //提交后的操作
    putClick(data) {
      this.$set(data,'appendFile','false')
      this.putForm.father_id = data.id.replace('class','')
      addClass(this.putForm).then(response => {
        this.append(data,'class' + response.data.id)
        this.putForm.class_name = ''
      }).catch(()=>{
        this.putForm.class_name = ''
      })
    },
    //页面动态加载
    append(data,id) {
      var newChild = { id: id, label: this.putForm.class_name, type: 'application',children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
  }
}
</script>
<style>
.aaa .el-input__inner {
  height: 22px;
  width: 100px;
}

.datacs{
  /* margin-right: 1000px; */
  float: right;
  height: 100%;
}
.treeData {
  display: inline-block;
  position: absolute;
  width: 100%;
}
.updataDialog {
  display: inline-block;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 600px;
  height: 600px;
  float: right;
  top: 0px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
}
.dialogTitle {
  padding-top: 20px;
}

.dialogBody {
  padding-top: 20px;
}
.dialogFooter {
  float: right;
}
</style>
