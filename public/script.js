
var alertModal = {
    subView: $('#alertModal'),
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

function initUploadField() {
    $('[type="file"]').on('change', (e) => {

        var $parent = $(e.target).parent()
        var $this = $(e.target)

        function readURL(input) {
            if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = (e) => {
                $parent.find('.upload-caddy').attr('src', e.target.result);
                $parent.find(`[for="${$this.attr('id')}"]`).addClass('d-flex align-items-center justify-content-between')
                $parent.find(`[for="${$this.attr('id')}"]`).find('u').html('החלף תמונה')
              }
              
              reader.readAsDataURL(input.files[0]); // convert to base64 string
            }
        }
        
        e.target.files && e.target.files.length ? readURL(e.target) : '';

    })
}

function initMandatoryFields() {
    var fields = $('[mandatory]')
    var emptyFields = []

    function formValidated() {
        var valid = true 

        $.each(fields, (i,val) => {
            var $val = $(val)
            if ($val.val() == "" || $val.val() == undefined) {
                valid = false
                emptyFields.push($val)
            } 
        })

        return valid
    }

    $('form').on('submit', (e) => {
        console.log(formValidated())
        e.preventDefault()
        
        if (formValidated()) {
            $('form').submit()
        } else {
            alertModal.display("חלק מהשדות הנדרשים ריקים")
            $.each(emptyFields, (i,val) => {
                var $val = $(val)
                $val.after('<span class="text-danger">שדה חובה</span>')
                $val.addClass('border border-danger')

                $val.on('input', (e) => {
                    $val.removeClass('border border-danger')  
                })
            })
        }
    })
}

$(() => {
    alertModal.init()

    initSelect2()

    initUploadField()

    initMandatoryFields()
})