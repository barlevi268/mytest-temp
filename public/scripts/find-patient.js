function initIdPassportField() {
    var passportField = $('.passport-field')
    var idField = $('.id-field')

    passportField.on('click', () => {
        passportField.addClass('col-9').removeClass('col-3')
        idField.addClass('col-3').removeClass('col-9')
    })

    idField.on('click', () => {
        idField.addClass('col-9').removeClass('col-3')
        passportField.addClass('col-3').removeClass('col-9')
    })
}

function findPatient() {
    var id = $('[name="patient_id"]').val()
    var passport = $('[name="patient_id"]').val()

    if (passport != "") {
        alertModal.display('')
    } else {
        alertModal.display({
            modalId:"patientDetailsModal",
            primaryLabel:""
            primaryAction: () => location.href('/newvisit'),
            onInit: () => {
                $('#patientFullNameLabel').html(fakePatient.fullName)
                $('#patientIdLabel').html(fakePatient.patientId)
                $('[name="patientPhone"]').val(fakePatient.phone)
                $('[name="patientBirthDate"]').val(fakePatient.birthDate)
                $('[name="patientSex"]').val(fakePatient.sex)
                $('[name="patientCity"]').val(fakePatient.city)
            }
        })
    }
}


const fakePatient = {
    fullName:"חיים רפאלי",
    patientId:"313521934",
    phone:"054-7449087",
    birthDate:"30/11/1985",
    sex:"male",
    city:"רחובות"
}

$(() => {
    initIdPassportField()
})