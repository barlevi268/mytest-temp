const loginBtn = $(".login-btn");
const twoFactorBtn = $('.sumbit-two-factor-button')
const usernameField = $('[name="username"]');
const phoneField = $('[name="phone"]');

function formIsValid() {
    return !(usernameField.val() === "" || phoneField.val() === "");
}

function formIsValidPin() {
    return !(!formIsValid() || pinField.getValue().length < 4);
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
            
            if ($target.val() !== "") {
                $target.val(e.originalEvent.data)
                try {
                    $(`[split-input="${inputNumber + 1}"]`)[0].focus()
                } catch (e) {
                }
                
            }

            pinField.getValue().length === 4 ? twoFactorBtn.prop('disabled', false ) : twoFactorBtn.prop('disabled', true);
            
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
    const phone = phoneField.val();

    loginBtn.btn("startLoader");

    let body = {
        email: username,
        phone: phone
    };

    if (formIsValid()) {
        let fetchObj = new RequestObject("POST", JSON.stringify(body));
        const url = "/api/auth/login"
        request(url, fetchObj)
        .then((response) => {
            if (response.status === "success") {
                changeLoginView('two-factor')
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

async function loginTwoFactorClickHandler(e) {
    const pin = pinField.getValue();
    const username = usernameField.val();
    const phone = phoneField.val();

    loginBtn.btn("startLoader");

    let body = {
        email: username,
        phone: phone,
        pin: pin
    };

    if (formIsValidPin()) {
        let fetchObj = new RequestObject("POST", JSON.stringify(body));
        const url = "/api/auth/login"
        request(url, fetchObj)
          .then((response) => {
              if (response.status === "success") {
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
    twoFactorBtn.on("click", async e => loginTwoFactorClickHandler(e));
}); 
