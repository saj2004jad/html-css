document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', () => ({
        mainUsers: [],
        users: [],
        pageUsers: [],
        isLoading: false,
        showAddModal: false,
        pageCount: 1,
        itemsCount: 4,
        currentPage: 1,
        searchChar: "",
        newUserInfo: {
            name: "",
            username: "",
            email: "",
        },
        userIdToEdit: null,
        getUsers() {
            this.isLoading = true

            axios.get(
                'https://jsonplaceholder.typicode.com/users'
            ).then((res) => {
                this.mainUsers = res.data
                this.users = res.data
                this.pageination()
            })
                .finally(() => {
                    this.isLoading = false
                })
        },
        pageination() {
            this.pageCount = Math.ceil(this.users.length / this.itemsCount)
            let start = (this.currentPage * this.itemsCount) - this.itemsCount
            let end = this.currentPage * this.itemsCount
            this.pageUsers = this.users.slice(start, end)
            console.log(this.pageUsers);
        },
        nextPage() {
            this.currentPage++
            if (this.currentPage > this.pageCount)
                this.currentPage = this.pageCount

            this.pageination()
        },
        prevPage() {
            this.currentPage--
            if (this.currentPage < 1)
                this.currentPage = 1

            this.pageination()
        },
        handelChangeItemsCount(e) {
            this.currentPage = 1
            this.itemsCount = e.value
            if (this.itemsCount < 1) this.itemsCount = 1
            if (this.itemsCount > this.users.length)
                this.itemsCount = this.users.length
            this.pageination()


        },
        handelSearch(value) {

            this.users = this.mainUsers.filter(user => (user.name.includes
                (value) || user.username.includes(value) ||
                user.email.includes(value)))
            this.currentPage = 1
            this.pageination()

        },

        handleSubmitAddUserForm() {
            this.isLoading = true
            axios.post(
                'https://jsonplaceholder.typicode.com/users', this.newUserInfo
            ).then((res) => {
                if (res.status === 201) {
                    this.mainUsers.push(res.data)
                    this.showAddModal = false
                    this.handleResetForm()
                    this.pageination()
                    M.toast({ html: 'User created successfully...', classes: 'rounded green' })
                }

            })
                .finally(() => {
                    this.isLoading = false
                })
        },
        handleResetForm() {
            this.newUserInfo = {
                name: "",
                username: "",
                email: "",
            }
        },
        handleDeleteUser(userId) {
            
            
            var toastHTML = '<span>Are you sure? ('+userId+')</span><button class="btn-flat toast-action" x-on:click="handleConfirmDeleteUser('+userId+')">Delete</button>';
            M.toast({html: toastHTML});
          
        },
        
           
        
        handleConfirmDeleteUser(userId){
            this.isLoading = true
            axios.delete("https://jsonplaceholder.typicode.com/users/"+userId).then((res)=>{
                if (res.status === 200) {
                    this.mainUsers = this.mainUsers.filter(user=>user.id != userId)
                    this.users = this.users.filter(user=>user.id != userId)
                    this.pagination()
                    M.toast({html: 'User deleted successfully...', classes: 'rounded green'})
                }
            }).finally(()=>{
                this.isLoading = false
            })
        },
      handleEditUser(user) {
        axios.get("https://jsonplaceholder.typicode.com/users/"+user.id).then(res=> {
if (res.status=== 200) {
    this.newUserInfo= {
        name:res.data.name,
        username: res.data.username,
        email: res.data.email,
    }
    this.userIdToEdit = res.data.id
}
      
    
})
        this.showAddModal=true
      },

      

    }))
})
handleEditUser
