<template>
  <div class="dashboard-container">
    <div class='fileter_prj'>
      <el-input v-model="fileter_prj.project_name" placeholder="请输入项目名称" clearable size="small" style="width:19%"></el-input>
      <el-button size="mini" type="" @click="getPrj()" style="margin-left:10px">搜索</el-button>
      <el-button size="mini" type="primary">新增</el-button>
    </div>
    <el-table :data="form" style="withd:100%">
      <el-table-column align="center" prop="id" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="project_name" label="项目名称">
        <template slot-scope="scope">
          <el-button type="text">{{ scope.row.project_name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间" >
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" >编辑</el-button>
          <el-button size="mini" type="primary" @click="deletePrj(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProject} from '@/api/prjOperation'

export default {
  name: 'Dashboard',
  created() {
      this.getPrj()
    },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      fileter_prj: {
        id: '',
        project_name: '',
        create_time: ''
      },
      form:[],
      cs:''
    }
  },
  methods: {

    getPrj(data='') {
      getProject(data).then(response => {
        this.form = response.data
      }) 
    },

    updatePrj(data) {

    },

    deletePrj(data) {

    },
    ceshi(cs) {
      console.log(cs)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
