const axios = require('axios');

const updateDetails = () => {
    axios.post('http://localhost:3001/updateStudentDetails', null, {
        params:{
            managerId: '633afac69d3517df9d3f6b66',
            name: '',
            age: '',
            email: '',
            phone: '',
            mom: '',
            dad: '',
            studentId: 1
        }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.error(err);
    })
}

updateDetails()