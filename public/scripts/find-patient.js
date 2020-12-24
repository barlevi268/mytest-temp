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

$(() => {
    initIdPassportField()
})