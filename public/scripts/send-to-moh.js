var testCards = {
    updateList: (cards) => {
        $.each(cards, (i,val) => {

            var card = testCards.Card.clone()

            card.find('.test-barcode-label').html(val.barcode)
            card.find('.test-name-label').html(val.patientFullName)
            card.find('.test-id-label').html(val.patientId)
            card.find('.test-visit-label').html(val.visit)
            card.find('.test-tester-label').html(val.tester)
            card.find('.test-barcode-checkbox').attr('name', `test_checked[${val.id}]`)

            $('.tests-wrapper').append(card)

        })
    },
    init: () => {
        testCards.Card = $('.test-details-card').clone()
        $('.test-details-card').remove()
    }
}


const fakeCards = [
    {
        id,
        barcode,
        patientFullName,
        patientId,
        visit
    }
]
$(() => {

})