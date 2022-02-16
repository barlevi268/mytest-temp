const loginBtn = $(".login-btn");
const twoFactorBtn = $('.sumbit-two-factor-button')
const passwordFieldEmail = $('.login-email [name="password"]');
const passwordFieldSMS = $('.login-sms [name="password"]');
const phoneField = $('[name="phone"]');
const emailField = $('[name="email"]');
const loginFormSMS = $('#loginFormSMS');
const loginFormEmail = $('#loginFormEmail');

const loginSMS = 'login-sms';
const loginEmail = 'login-email';
const loginTwoFactor = 'login-two-factor';
let typeForm = '';

function formIsValid() {
    if (typeForm === 'phone') {
        return !(passwordFieldSMS.val() === "" || formIsValidPhone(phoneField.val()));
    }
    if (typeForm === 'email') {
        let filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return !(passwordFieldEmail.val() === "" || emailField.val() === "" || !filter.test(emailField.val()));
    }
    return false;
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
function listenTabs() {
    const tabFormsLi = $('li[data-tab]');
    $.each(tabFormsLi, (_, tabFormLi) => {
        $(tabFormLi).on('click', (e) => {
            showForm($(e.currentTarget).attr('data-tab'));
        })
    })
}
function showForm(formName) {
    const tabFormsDiv = $('div.tab-form');
    const tabFormsLi = $('li[data-tab]');
    $.each(tabFormsDiv, (_, tabForm) => {
        if ($(tabForm).hasClass(formName)) {
            $(tabForm).removeClass('d-none');
            return;
        }
        $(tabForm).addClass('d-none')
    })
    $.each(tabFormsLi, (_, tabFormLi) => {
        if ($(tabFormLi).attr('data-tab') === formName) {
            $(tabFormLi).addClass('active')
            return;
        }
        $(tabFormLi).removeClass('active');
    })
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
    loginBtn.btn("startLoader");
    const isPhoneField = !$(`.login-view.${loginSMS}`).hasClass('d-none');
    const isLoginForm = !$(`.login-view.${loginEmail}`).hasClass('d-none');
    let body = {}
    if (isPhoneField) {
        typeForm = 'phone';
        const password = passwordFieldSMS.val();
        const phone = phoneField.val();
        body = {
            id_password: password,
            phone: phone
        };
    }

    if (isLoginForm) {
        typeForm = 'email';
        const password = passwordFieldEmail.val();
        const email = emailField.val();
        body = {
            id_password: password,
            email: email
        };
    }

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
              console.error(error)
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
              console.error(error)
          })

    } else {
        Swal.warning('יש למלא כתובת מייל וסיסמה')
    }

    loginBtn.btn("stopLoader");

}

loginFormSMS.on('submit',async (e) => {
    e.preventDefault();
    loginClickHandler(e);
})
loginFormEmail.on('submit',async (e) => {
    e.preventDefault();
    loginClickHandler(e);
})

$(() => {

    pinField.init()
    twoFactorBtn.on("click", async e => loginTwoFactorClickHandler(e));
    listenTabs();
    showForm(loginSMS);
});
