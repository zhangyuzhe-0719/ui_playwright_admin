<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="width:19%" size="small"/>
    <el-button @click="resetChecked()" size="small" type="primary">清空</el-button>
    <el-button @click="setCheckedNodes()" size="small" type="primary">全选</el-button>
    <el-tree
      ref="tree2"
      :data="data3"
      :props="defaultProps"
      class="filter-tree"
      default-expand-all
      show-checkbox
      node-key="id">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        
      </span>
      
      </el-tree>

  </div>
</template>

<script>
import {getPrj,getCls} from '@/api/tree'

export default {

  data() {
    return {
      filterText: '',
      checkIdList: [],
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

      data2:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cls_data: [{id: "3", class_name: "cs"}]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    clsGet(id) {
      // var cl = getCls(`?project_id=${id}`).then(response => {
      //   return response.data
      // })
      getCls(`?project_id=${id}`).then(response => {
        this.cls_data = response.data
      })
    },
    getCheckedNodes (){
      return this.$refs.tree2.getCheckedNodes()
    },
    resetChecked() {
      this.$refs.tree2.setCheckedKeys([])
    },
    setCheckedKeys() {
      this.$refs.tree2.setCheckedKeys(true)
    },
    setCheckedNodes() {
      this.$refs.tree2.setCheckedNodes(this.data3)
    },

    dataList(data) {
      var data_list = []
      for (const key in data) {
        var dic_data = data[key]
        var dic = {}
        dic["id"] = dic_data["id"]
        dic["label"] = dic_data["project_name"]
        var cls_list = []
        this.clsGet(dic_data["id"])
        console.log(this.cls_data)
        // console.log(this.cls_data)
        for (const k in this.cls_data){
          var c_data = this.cls_data[k]
          var cls_dic = {}
          cls_dic["id"] = c_data["id"]
          cls_dic["label"] = c_data["class_name"]
          cls_list.push(cls_dic)
        }
        dic["children"] = cls_list
        this.data2.push(dic)
        console.log(key)
      }
    },

    csGet() {
      getPrj().then(response => {
        var data = response.data
        var data_list = []
        for (const key in data) {
          var dic_data = data[key]
          var dic = {}
          dic["id"] = dic_data["id"]
          dic["label"] = dic_data["project_name"]
          var cls_list = []
          this.clsGet(dic_data["id"])
          console.log(this.cls_data)
          // console.log(this.cls_data)
          for (const k in this.cls_data){
            var c_data = this.cls_data[k]
            var cls_dic = {}
            cls_dic["id"] = c_data["id"]
            cls_dic["label"] = c_data["class_name"]
            cls_list.push(cls_dic)
          }
          dic["children"] = cls_list
          this.data2.push(dic)
          console.log(key)
        }

      })
    }
  }
}
</script>

