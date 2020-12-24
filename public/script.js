var alertModal = {
    subView: $('#alertModal'),
    content: $('.modal-message'),
    successIcon: $('.modal-icon'),
    primaryButton: $('.primary-action'),
    secondaryButton: $('.secondary-action'),
    show: () => alertModal.subView.modal('show'),
    clear: () => {},
    hide: () => {
        alertModal.subView.modal('hide')
        alertModal.clear()
    },
    display: (message) => {
        console.log(typeof message)
        if (typeof message == "object") {
            
            if (message.content) {
                alertModal.content.html(message.content)
            }
            
            if (message.primaryAction) {
                alertModal.primaryButton.on('click', message.primaryAction)
            }

            if (message.primaryLabel) {
                alertModal.primaryButton.html(message.primaryLabel)
            }

            if (message.secondaryAction) {
                alertModal.secondaryButton.on('click', message.secondaryAction)
            }


            if (message.secondaryLabel) {
                alertModal.secondaryButton.html(message.secondaryLabel)
            }

            if (message.hideSecondary) {
                alertModal.secondaryButton.hide()
            }

            if (message.icon) {
                message.icon == 'success' ? alertModal.successIcon.removeClass('d-none') : alertModal.successIcon.addClass('d-none');
            }

            if (message.onInit) {
                message.onInit.call()
            }

        } else if (typeof message == 'string') {

        }
        alertModal.show()
    }
}


$(() => {
    alertModal.display({
        content:"hi",
        primaryLabel:"המשך",
        secondaryLabel:"ביטול",
        icon: 'success',
        primaryAction: function() {alert('hi')}
    })
})