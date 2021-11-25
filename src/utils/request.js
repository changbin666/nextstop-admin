import axios from 'axios';
import qs from 'qs';

axios.defaults.validateStatus = status => {
    return status < 500;
  };
  
  // 设置请求token
  axios.interceptors.request.use(config => {
    let token = sessionStorage.getItem('access_token');
    config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  });
  
  // 接口错误拦截
  axios.interceptors.response.use(res => {
    if (res.status === 401) {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('token_type');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('expires_in');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('user_name');
      sessionStorage.removeItem('real_name');
      sessionStorage.removeItem('user_email');
      // console.log({'router': router});
      router.push({path: '/login'});
      return res;
    } else {
      return res;
    }
  }, err => {
    return Promise.reject(err)
  });
  
  
  axios.defaults.baseURL = 'http://localhost:8081';
  axios.defaults.timeout = 1000 * 30;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  axios.defaults.headers.get['Content-Type'] = 'application/json';
  
  //公共登陆部分
  export const requestToken = params => {
    return axios.post('/oauth/token', params).then(res => res.data);
  };

  //客户列表
  export const clientUserList = params => {
    return axios.post('/ns/admin/client/clientUserList', params).then(res => res.data);
  };

  //新增客户
  export const saveClientUser = params => {
    return axios.post('/ns/admin/client/saveClientUser', qs.stringify(params)).then(res => res.data);
  };

  //更新客户
  export const updateClientUser = params => {
    return axios.post('/ns/admin/client/updateClientUser', qs.stringify(params)).then(res => res.data);
  };
  //更改客户停用状态
  export const changeUserDelStatus = params => {
    return axios.post('/ns/admin/client/changeDelStatus', params).then(res => res.data);
  };
  //更改客户VIP状态
  export const changeUserVipStatus = params => {
    return axios.post('/ns/admin/client/changeVipStatus', params).then(res => res.data);
  };
