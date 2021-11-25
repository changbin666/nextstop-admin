<template>
    <div>
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
                <el-table-column label="序号" width="50px" align="center">
                    <template slot-scope="scope">
                        {{ (query.pageIndex - 1) * query.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="55" v-if="show"></el-table-column>
                <el-table-column prop="nickName" label="客户昵称" align="center"></el-table-column>
                <el-table-column prop="userEmail" label="登录邮箱" align="center"></el-table-column>
                <el-table-column prop="userPhone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="userWechat" label="微信" align="center"></el-table-column>
                <el-table-column prop="registerTime" label="注册时间" align="center"></el-table-column>
                <el-table-column prop="" label="VIP支付截图" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.payRecordPath"
                            :preview-src-list="[scope.row.payRecordPath]"
                        >
                        <div slot="placeholder" class="image-slot">
                            <i class="el-icon-loading"></i>加载中
                        </div>
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="isVip" label="是否VIP" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isVip"
                            :active-value="1"
                            :inactive-value="0"
                            @change=changeVipStatus($event,scope.row,scope.$index)>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="delStatus" label="启用/停用" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.delStatus"
                            :active-value="0"
                            :inactive-value="1"
                            @change=changeDelStatus($event,scope.row,scope.$index)>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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
                <el-form-item label="客户手机号">
                    <el-input v-model="addForm.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="客户微信号">
                    <el-input v-model="addForm.userWechat"></el-input>
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
                <el-form-item label="客户手机号">
                    <el-input v-model="editForm.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="客户微信号">
                    <el-input v-model="editForm.userWechat"></el-input>
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
import {clientUserList,saveClientUser,updateClientUser,changeUserDelStatus,changeUserVipStatus} from '../../utils/request';
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
            show:false,
            idx: -1,
            id: -1
        };
    },
    created() {
        this.clientUserList();
    },
    methods: {
        //停用启用状态变更
        changeDelStatus(event,row,index) {
            // 二次确认
            this.$confirm('确定要启用或停用此用户吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let param = new URLSearchParams();
                    param.append("id",row.id);
                    param.append("delStatus",row.delStatus);
                    this.listLoading = true;
                    //NProgress.start();
                    changeUserDelStatus(param).then((res) => {
                        let { message, status, datas } = res;
                        if (status !== 0) {
                            this.$message({
                            message: message,
                            type: 'error'
                            });
                        } else {
                            this.clientUserList();
                        }
                    });
                })
                .catch(() => {});
        },
        changeVipStatus(event,row,index){
            let param = new URLSearchParams();
            param.append("id",row.id);
            param.append("isVip",row.isVip);
            this.listLoading = true;
            //NProgress.start();
            changeUserVipStatus(param).then((res) => {
                let { message, status, datas } = res;
                if (status !== 0) {
                    this.$message({
                    message: message,
                    type: 'error'
                    });
                } else {
                    this.clientUserList();
                }
            });
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
