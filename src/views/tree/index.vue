<template>
    <div class="setTable">
        <div class="pageTitle">
            <el-input v-model="testFile.set_name" style="width:200px" size='small'></el-input>
            <el-button type="primary" size="small" style="margin-left:10px">搜索</el-button>
        </div>
        <div class="pageBody">
            <el-table
            :data="list"
            fit
            highlight-current-row
            >
            <el-table-column align="center" label="ID" prop="id">
                <template slot-scope="scope">
                {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="测试集名称" prop="set_name">
                <template slot-scope="scope">
                    <el-button type="text" @click="setNameClick()">{{ scope.row.set_name }}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="create_time" label="创建时间" >
                <template slot-scope="scope">
                {{ scope.row.create_time }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="caseList" label="绑定用例条数" >
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
    </div>
</template>

<script>

export default { 
    data() {
        return {
            testFile:{
                set_name:''
            },
            list:[{
                id:'1',
                project_id:'1',
                set_name:'测试集',
                case_list:'10',
                check_idList:'1',
                create_time:'2021-07-13 11:17:23',
                update_time:'2021-07-13 11:17:23'
            }]
        }
    },
    methods: {
        setNameClick(){
            this.$router.push({path:'/example/tree/caseSetTree'})
        }
    }

}
</script>
<style>
.setTable {
    padding-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 20px;
}
.pageBody {
    padding-top: 22px;
}
</style>