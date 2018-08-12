import axios from 'axios';

const service = axios.create();

/*
service.interceptors.response.use(
    null,//response => response,
    error => {
        console.log('ERROR');
        console.log('err' + error) // for debug
        console.log(error);
        console.log(error.message);
        /*
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
        *
        return Promise.reject(error)
    }
);
*/

export default service;
