<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 客户信息管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="客户昵称或邮箱" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="nickName" label="客户昵称"></el-table-column>
                <el-table-column prop="userEmail" label="登录邮箱"></el-table-column>
                <el-table-column prop="isVip" label="是否VIP"></el-table-column>
                <el-table-column prop="delStatus" label="是否删除" :formatter="delStatusFormat"></el-table-column>
                <el-table-column prop="registerTime" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

         <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="addForm" :model="addForm" label-width="90px">
                
                <el-form-item label="客户昵称">
                    <el-input v-model="addForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="登录邮箱">
                    <el-input v-model="addForm.userEmail"></el-input>
                </el-form-item>
                <el-form-item label="初始化密码">
                    <el-input v-model="addForm.userPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClientUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="editForm" :model="editForm" label-width="90px">
                <el-input v-model="editForm.id" v-show='false'></el-input>
                <el-form-item label="客户昵称">
                    <el-input v-model="editForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="登录邮箱">
                    <el-input v-model="editForm.userEmail"></el-input>
                </el-form-item>
                <el-form-item label="修改密码">
                    <el-input v-model="editForm.memberNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {clientUserList,saveClientUser,updateClientUser,deleteClientUser} from '../../utils/request';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            addVisible: false,
            editVisible: false,
            pageTotal: 0,
            editForm: {},
            addForm: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.clientUserList();
    },
    methods: {
        //删除状态转译
        delStatusFormat(data) {
            if (data.delStatus == 0) {
                return "正常";
            } else if (data.delStatus == 1) {
                return "已删除";
            }
        },
        //获取用户列表
        clientUserList() {
            let param = new URLSearchParams();
            param.append("paramStr",this.query.name);
            param.append("pageIndex",this.query.pageIndex);
            param.append("pageSize",10);
            this.listLoading = true;
            //NProgress.start();
            clientUserList(param).then((res) => {
                let { message, status, datas } = res;
                if (status !== 0) {
                    this.$message({
                    message: message,
                    type: 'error'
                    });
                } else {
                    this.pageTotal = datas.total;
                    this.tableData = datas.list;
                    this.listLoading = false;
                }
                //NProgress.done();
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.clientUserList();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let param = new URLSearchParams();
                    param.append("id",row.id);
                    this.listLoading = true;
                    //NProgress.start();
                    deleteClientUser(param).then((res) => {
                        let { message, status, datas } = res;
                        if (status !== 0) {
                            this.$message({
                            message: message,
                            type: 'error'
                            });
                        } else {
                            this.clientUserList();
                        }
                        //NProgress.done();
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //打开新增窗口
        handleAdd(){
            this.addVisible = true;
        },
        // 保存新增
        saveClientUser() {
            this.addVisible = false;
            //NProgress.start();
            saveClientUser(this.addForm).then((res) => {
                let { message, status, datas } = res;
                if (status !== 0) {
                    this.$message({
                    message: message,
                    type: 'error'
                    });
                } else {
                    this.clientUserList();
                }
                //NProgress.done();
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editForm = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            //NProgress.start();
            updateClientUser(this.editForm).then((res) => {
                let { message, status, datas } = res;
                if (status !== 0) {
                    this.$message({
                    message: message,
                    type: 'error'
                    });
                } else {
                    this.clientUserList();
                }
                //NProgress.done();
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.clientUserList();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
