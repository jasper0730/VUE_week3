

const app = {
    data() {
        return {
            api_path: 'jasper07301',
            baseUrl: 'https://vue3-course-api.hexschool.io',
            // 要傳到伺服器的資料
            user:{
                username: '', // 綁定input
                password: '', // 綁定input
            }
        }
    },
    methods: {
        login() {
            const url = `${this.baseUrl}/v2/admin/signin`;
            axios.post(url,this.user)
            .then((res)=>{
                // 取出回傳的token及expired
                const {token,expired} = res.data;
                // 存入cookie
                document.cookie = `hexToken=${token};expires=${new Date(expired)};path=/`;
                // 轉到新頁面
                window.location = 'products.html';
            })
            .catch((err)=>{
                console.log(err.data.message)
            })
        }

    },
}

Vue.createApp(app).mount('#app')