var testCards = {
    updateList: (cards) => {
        $.each(cards, (i,val) => {

            var card = testCards.Card.clone()

            card.find('.test-barcode-label').html(val.barcode)
            card.find('.test-name-label').html(val.patientFullName)
            card.find('.test-id-label').html(val.patientId)
            card.find('.test-visit-label').html(val.visitId)
            card.find('.test-tester-label').html(val.testerName)
            card.find('.test-barcode-checkbox').attr('name', `test_checked[${val.id}]`)

            $('.tests-wrapper').append(card)

        })
    },
    init: () => {
        testCards.Card = $('.test-details-card').clone()
        $('.test-details-card').remove()
    }
}


const fakeTests = [
    {
        id:"1",
        barcode:"8923742",
        patientFullName:"מנחם כץ",
        patientId:"056812392",
        visitId:"8432",
        testerName:"רוני כהן"
    },
    {
        id:"2",
        barcode:"8934242",
        patientFullName:"רותי שוורץ",
        patientId:"055922392",
        visitId:"8432",
        testerName:"רוני כהן"
    },
    {
        id:"3",
        barcode:"8923744",
        patientFullName:"דבורה ליפשיץ",
        patientId:"056812339",
        visitId:"8432",
        testerName:"רוני כהן"
    },
    {
        id:"4",
        barcode:"8923232",
        patientFullName:"אורי כהן",
        patientId:"056382392",
        visitId:"8432",
        testerName:"רוני כהן"
    },
    {
        id:"5",
        barcode:"8924042",
        patientFullName:"שמואל חזן",
        patientId:"056771392",
        visitId:"8432",
        testerName:"רוני כהן"
    },
]
$(() => {

    testCards.init()
    
    testCards.updateList(fakeTests)
})