function changeLoginView(view) {
    $('.login-view').addClass('d-none')

    $(`.${view}-form`).removeClass('d-none')
}

var pinField = {
    init: () => {
        $('[split-input]').on('input', (e) => {
            var $target = $(e.target)
            var inputNumber = parseInt($target.attr('split-input'))
            
            if ($target.val() != "") {
                $target.val(e.originalEvent.data)
                try {
                    $(`[split-input="${inputNumber + 1}"]`)[0].focus()
                } catch (e) {
                }
                
            }

            var button = $('.sumbit-two-factor-button')
            pinField.getValue().length == 4 ? button.prop('disabled', false ) : button.prop('disabled', true);
            
        })
    },
    getValue: () => {
        var merged = []
        $.each($('[split-input]'), (i,val) => {
            merged.push($(val).val())
        })

        return merged.reverse().join('')
    }
}

$(() => {
    pinField.init()
})