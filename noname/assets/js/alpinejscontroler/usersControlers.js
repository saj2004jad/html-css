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
        handleDeleteUser(username) {
            var toastHTML = 
            '<span>Are you sure Delete '+ username +'?</span><button class="btn-flat toast-action" >yes</button>';
            M.toast({ html: toastHTML });
        },
        handleConfirmDeleteUser(username) {

        }




    }))
})