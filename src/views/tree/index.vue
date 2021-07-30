<template>
    <div class="setTable">
        <div class="pageTitle">
            <el-input v-model="testFile.set_name" style="width:200px" size='small'></el-input>
            <el-button type="primary" size="small" style="margin-left:10px">搜索</el-button>
            <el-button type="primary" size="small" style="margin-left:10px" @click="setVisible=true">新增</el-button>
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
                    <el-button size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="primary" @click="deletePrj(scope)" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog :visible.sync="setVisible" :title=setTitle width="600px">
                <el-form ref="setForm" :model="setForm" label-width="90px" label-position="right" size="mini" :rules="rules">
                    <el-form-item label="集合名称" prop="set_name">
                        <el-input v-model="setForm.set_name"/>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="create_time">
                        <el-input v-model="setForm.create_time" disabled/>
                    </el-form-item>
                    <el-form-item label="更新时间" prop="update_time">
                        <el-input v-model="setForm.update_time" disabled/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" >取消</el-button>
                    <el-button size="mini" type="danger">确认</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getTestSet,addTestSet,updateTestSet,deleteTestSet} from '@/api/testSet'

export default { 
    data() {
        return {
            setVisible: false,
            setTitle: '新增测试集',
            setForm:{
                id:'',
                project_id:'',
                set_name:'',
                case_list:'',
                check_idList:'',
                create_time:'',
                update_time:''
            },
            testFile:{
                set_name:''
            },
            list:[{
                id:'1',
                project_id:'1',
                set_name:'测试集',
                create_time:'2021-07-13 11:17:23',
                update_time:'2021-07-13 11:17:23'
            }]
        }
    },
    methods: {
        setNameClick(){
            this.$router.push({path:'/example/tree/caseSetTree'})
        },
        addSet(data) {
            addTestSet(data).then(response =>{
                
            }).catch
        },
        getSet(){}
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