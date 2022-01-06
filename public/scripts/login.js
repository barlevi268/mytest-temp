const loginBtn = $(".login-btn");
const usernameField = $('[name="username"]');
const passField = $('[name="password"]');

function formIsValid() {
    return usernameField.val() == "" || passField.val() == "" ? false : true;
}

function changeLoginView(view) {
    $('.login-view').addClass('d-none')

    $(`.${view}-form`).removeClass('d-none')
}

var pinField = {
    init: () => {
        $('[split-input]').on('input', (e) => {
            var $target = $(e.target)
            var inputNumber = parseInt($target.attr('split-input'))
            
            if ($target.val() != "") {
                $target.val(e.originalEvent.data)
                try {
                    $(`[split-input="${inputNumber + 1}"]`)[0].focus()
                } catch (e) {
                }
                
            }

            var button = $('.sumbit-two-factor-button')
            pinField.getValue().length == 4 ? button.prop('disabled', false ) : button.prop('disabled', true);
            
        })
    },
    getValue: () => {
        var merged = []
        $.each($('[split-input]'), (i,val) => {
            merged.push($(val).val())
        })

        return merged.reverse().join('')
    }
}

async function loginClickHandler(e) {

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

}

$(() => {

    pinField.init()

    //handle login
    loginBtn.on("click", async e => loginClickHandler(e));
    
}); 