let productModal = null;
let delProductModal = null;

const app = {
    data() {
        return {
            api_path: 'jasper07301',
            baseUrl: 'https://vue3-course-api.hexschool.io',
            products: [],
            isNew: false, // 判斷點擊到新增還是編輯
                          // 新稱的isNew = true
                          // 編輯的isNew = false
            tempProduct:{
                imagesUrl:[],
            },
        }
    },
    mounted() {
        // bs5的互動視窗
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {keyboard: false})
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {keyboard: false})
        // 把存在cookie的取出來用
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // 之後每次用axios戳資料都會自動帶上Authorization
        axios.defaults.headers.common.Authorization = token;
        // 先驗證
        this.checkAdmin();
    },
    methods: {
        checkAdmin() {
            const url = `${this.baseUrl}/v2/api/user/check`;
            axios.post(url)
            .then((res)=>{
                this.getData(); // 通過驗證就取資料
            })
            .catch((err)=>{
                alert(err.data.message);
                window.location = 'login.html';  // tohen若驗證失敗就回登入畫面
            })
        },
        getData(){
            const url = `${this.baseUrl}/v2/api/${this.api_path}/admin/products/all`;
            axios.get(url)
            .then((res)=>{
                this.products = res.data.products;
            })
            .catch((err)=>{
                alert(err.data.message);
            })
        },
        updateProduct() {
            // 預設是接新增(post)的api
            let url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product`;
            let httpMethod = 'post';
            // 下面判斷若點擊為false就接編輯(put)的api
            if(!this.isNew) {
                url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }
            axios[httpMethod](url,{ data: this.tempProduct })
            .then((res)=>{
                alert(res.data.message)
                productModal.hide();  // 執行完成後關掉modal
                this.getData(); // 重新載入資料,並渲染到畫面
            })
            .catch((err)=>{
                alert(err.data.message)
            })
        },
        openModal(isNew,item) {
            if(isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],  //帶入第二層資料,因為生命週期在函式生成之前就會帶入此屬性,若沒有先預設讓他讀取,程式碼匯報錯
                };
                this.isNew = true; // 因為是新增,所以改為true,才能對應到點擊按鈕時判斷是新增還是編輯
                productModal.show(); // 顯示新增的視窗
            }else if(isNew === 'edit') {
                this.tempProduct = {...item}  // 將所選的資料以拷貝方式帶入,才不會牽動到原始資料
                this.isNew = false // 因為是編輯,所以改為false,才能對應到點擊按鈕時判斷是新增還是編輯
                productModal.show() // 顯示編輯的視窗
            }else if(isNew === 'delete') {
                this.tempProduct = {...item}  
                delProductModal.show(); // 顯示刪除確認的視窗
            }
        },
        delProduct() {
            const url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
            .then((res)=>{
                delProductModal.hide(); // 刪除後將modal關掉
                this.getData(); // 重新帶入資料並渲染在畫面上
            })
            .catch((err)=>{
                alert(err.data.message)
            })
        },
        createImages() {
            this.tempProduct.imagesUrl = [] // 清空,才不會若前面有編輯過沒確認,之後點新增而資料還在的情況
            this.tempProduct.imagesUrl.push('') // 新增一筆資料加入imagesUrl的陣列中
        }
    },
    
}

Vue.createApp(app).mount('#app')