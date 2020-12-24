var alertModal = {
    subView: $('#alertModal'),
    content: $('.modal-message'),
    successIcon: $('.modal-icon'),
    primaryButton: $('.primary-action'),
    secondaryButton: $('.secondary-action'),
    show: () => alertModal.subView.modal('show'),
    clear: () => {
        alertModal.primaryButton.html('אישור')
        alertModal.secondaryButton.html('ביטול')
        alertModal.primaryButton.on('click',() => alertModal.hide())
        alertModal.secondaryButton.on('click',() => alertModal.hide())
        alertModal.content.html('')
        alertModal.successIcon.addClass('d-none')
        alertModal.secondaryButton.addClass(['col-spaced','col-6'])
    },
    hide: () => {
        alertModal.subView.modal('hide')
        alertModal.clear()
    },
    display: (message) => {
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
                alertModal.primaryButton.removeClass(['col-spaced','col-6'])
            }

            if (message.icon) {
                message.icon == 'success' ? alertModal.successIcon.removeClass('d-none') : alertModal.successIcon.addClass('d-none');
            }

            if (message.onInit) {
                message.onInit.call()
            }

        } else if (typeof message == 'string') {
            alertModal.content.html(message)
        }
        alertModal.show()
    },

    init: () => alertModal.clear()
}

function initSelect2() {
    $.each($('[select2-type]'), (i,val) => {
        var displayMode = $(val).attr('select2-type')
        $(val).select2({
            width:'100%'
        })
    })
}

$(() => {
    alertModal.init()

    initSelect2()

})