const loginBtn = $(".login-btn");
const twoFactorBtn = $('.sumbit-two-factor-button')
const passwordField = $('[name="password"]');
const phoneField = $('[name="phone"]');
const loginForm = $('#loginForm');

function formIsValid() {
    return !(passwordField.val() === "" || formIsValidPhone(phoneField.val()));
}

function formIsValidPhone(val) {
    let phoneArr = (val || '').split('');
    return phoneArr.length === 10 && phoneArr[0] === '0' && phoneArr[1] === '5';
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

            pinField.getValue().length === 5 ? twoFactorBtn.prop('disabled', false) : twoFactorBtn.prop('disabled', true);

        })
    },
    getValue: () => {
        var merged = []
        $.each($('[split-input]'), (i, val) => {
            merged.push($(val).val())
        })

        return merged.reverse().join('')
    }
}

async function loginClickHandler(e) {

    const password = passwordField.val();
    const phone = phoneField.val();

    loginBtn.btn("startLoader");

    let body = {
        id_password: password,
        phone: phone
    };

    if (formIsValid()) {
        let fetchObj = new RequestObject("POST", JSON.stringify(body));
        const url = "/api/send-code/"
        request(url, fetchObj)
          .then((response) => {
              if (response.success) {
                  localStorage.setItem('otpToken', response.data.token)
                  changeLoginView('two-factor')
              }
          })
          .catch((error) => {
              Swal.error('מס זהות או נייד לא נמצאו במערכת')
              console.log(error)
          })

    } else {
        Swal.warning('יש למלא מס זהות ונייד')
    }

    loginBtn.btn("stopLoader");

}

async function loginTwoFactorClickHandler(e) {
    const pin = pinField.getValue();

    loginBtn.btn("startLoader");

    let body = {
        code: pin
    };

    if (formIsValidPin()) {
        let fetchObj = new RequestObject("POST", JSON.stringify(body));
        const url = `/api/login/${localStorage.getItem('otpToken')}`;

        const successHandler = (response) => {
            if (response.data.user.type === "agent") {
                location.href = '/agent'
            } else {
                location.href = '/'
            }

        }
        request(url, fetchObj)
          .then((response) => {
              if (response.success) {

                  UserSession.authenticate(response.data)

                  Swal.success('מייד תועבר לפרופיל שלך')

                  setTimeout(() => successHandler(response), 1000)
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

loginForm.on('submit',async (e) => {
    e.preventDefault();
    loginClickHandler(e);
})

$(() => {

    pinField.init()

    //handle login
    // loginBtn.on("click", async e => loginClickHandler(e));
    twoFactorBtn.on("click", async e => loginTwoFactorClickHandler(e));
});
