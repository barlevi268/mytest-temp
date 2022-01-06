const loginBtn = $(".login-btn");
const usernameField = $('[name="username"]');
const passField = $('[name="password"]');

function formIsValid() {
    return usernameField.val() == "" || passField.val() == "" ? false : true;
}

$(() => {
    //handle login
    loginBtn.on("click", async () => {
        const username = usernameField.val();
        const password = passField.val();

        loginBtn.btn("startLoader");

        let body = {
            email: username,
            password: password
        };

        if (formIsValid()) {
            let fetchObj = new RequestObject("POST", JSON.stringify(body));
            const url = "/api/auth/login"
            request(url, fetchObj)
            .then((response) => {
                if (response.status == "success") {
                    UserSession.authenticate(response.data)
                    Swal.success('מייד תעבור למערכת')
                    setTimeout(() => location.href = '/', 1000)
                }
            })
            .catch((error) => {
                Swal.error('שם משתמש או סיסמה לא נכונים')
                console.log(error)
            })
            
        } else {
            Swal.warning('יש למלא כתובת מייל וסיסמה')
        }

        loginBtn.btn("stopLoader");
    });
}); 