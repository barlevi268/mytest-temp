function changeLoginView(view) {
    $('.login-view').addClass('d-none')

    $(`.${view}-form`).removeClass('d-none')
}

function initPinField() {
    $('[split-input]').on('input', (e) => {
        var $target = $(e.target)
        var inputNumber = $target.attr('split-input')
        
        console.log($target.val())
        console.log($(`[split-input="${inputNumber}"]`))
        $target.val() != "" ? $(`[split-input="${inputNumber}"]`)[0].focus() : '';
    })
}

$(() => {
    initPinField()
})