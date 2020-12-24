
var alertModal = {
    subView: $('#alertModal'),
    content,
    successIcon,
    primaryButton,
    secondaryButton,
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
            
            if (message.modalId) {
                alertModal.subView = $(`#${message.modalId}`)
                alertModal.init()
            }

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

    init: () => {
        alertModal.content = alertModal.subView.find('.modal-message');
        alertModal.successIcon = alertModal.subView.find('.modal-icon');
        alertModal.primaryButton = alertModal.subView.find('.primary-action');
        alertModal.secondaryButton = alertModal.subView.find('.secondary-action');
        alertModal.clear()
    }
}

function initSelect2() {
    $.each($('[select2-type]'), (i,val) => {
        var displayMode = $(val).attr('select2-type')
        var settings = {
            width:'100%',
            placeholder:$(val).attr('placeholder')
        }
        displayMode != 'search' ? settings.minimumResultsForSearch = -1 : delete settings.minimumResultsForSearch
        $(val).select2(settings)
    })
}

$(() => {
    alertModal.init()

    initSelect2()

})