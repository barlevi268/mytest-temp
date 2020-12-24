var alertModal = {
    subView: $('#alertModal'),
    content,
    successIcon,
    primaryButton,
    secondaryButton,
    show: () => alertModal.subView.modal('show'),
    clear,
    hide: () => {
        alertModal.subView.modal('hide')
        alertModal.clear()
    },
    display: (message) => {
        if (typeof message == Object) {
            if (message.content) {
                alertModal.content.html(message.content)
            }
            
            if (message.primaryAcion) {
                alertModal.primaryButton.on('click', () => message.primaryAcion)
            }

            if (message.secondaryAcion) {
                alertModal.secondaryButton.on('click', () => message.secondaryAcion)
            }

            if (message.hideSecondary) {
                alertModal.secondaryButton.hide()
            }

            if (message.icon) {
                message.icon == 'success' ? alertModal.successIcon.show() : alertModal.successIcon.hide();
            }

            if (message.onInit) {
                message.onInit.call()
            }

        } else if (typeof message == String) {

        }
    }
}


$(() => {
    
    $('#alertModal').modal('show')
})