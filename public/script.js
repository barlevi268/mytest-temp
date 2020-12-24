var alertModal = {
    subView: $('#alertModal'),
    content,
    successIcon,
    primaryButton,
    secondaryButton,
    show: alertModal.subView.modal('show'),
    display: (message) => {
        if (typeof message == Object) {
            if (message.content) {

            }
            
            if (message.primaryAcion) {
                alertModal.primaryAcion
            }

            if (message.primaryAcion) {
                
            }

            if (message.secondaryAcion) {
                
            }

            if (message.icon) {
                message.icon == 'success' ? alertModal.successIcon.show() : alertModal.successIcon.hide();
            } else {
                alertModal.successIcon.hide()
            }

        } else if (typeof message == String) {

        }
    }
}


$(() => $('#alertModal').modal('show'))