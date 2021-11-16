<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">NextStop后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 填写用户名和密码。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import {requestUser, requestToken} from '../../utils/request';

export default {
    data: function() {
        return {
            param: {
                username: 'changbin',
                password: '123456',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    let params = new URLSearchParams();
                    params.append("username", this.param.username);
                    params.append("password", this.param.password);
                    params.append("grant_type", "password");
                    params.append("scope", "read");
                    params.append("client_id", "cb");
                    params.append("client_secret", "123456");
                    requestToken(params).then(res => {
                        let access_token = res.access_token;
                        let token_type = res.token_type;
                        let refresh_token = res.refresh_token;
                        let expires_in = res.expires_in;
                        let user_id = res.user_id;
                        let user_name = res.user_name;
                        let real_name = res.real_name;
                        let user_email = res.user_email;
                        this.logining = false;
                        if (access_token) {
                            sessionStorage.setItem('access_token', access_token);
                            sessionStorage.setItem('token_type', token_type);
                            sessionStorage.setItem('refresh_token', refresh_token);
                            sessionStorage.setItem('expires_in', expires_in);
                            sessionStorage.setItem('user_id', user_id);
                            sessionStorage.setItem('user_name', user_name);
                            sessionStorage.setItem('real_name', real_name);
                            sessionStorage.setItem('user_email', user_email);
                            let params = new URLSearchParams();
                            this.$message.success('登录成功');
                            this.$router.push({path: '/index'});
                        } else {
                            sessionStorage.removeItem('access_token');
                            sessionStorage.removeItem('user_id');
                            this.$message({
                            message: "输入信息错误!",
                            type: 'error'
                            });
                        }
                    });
                    
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>