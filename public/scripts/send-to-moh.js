var testCards = {
    makeCard: (cardObj) => {
        var card = testCards.Card.clone()
        card.find('.test-barcode-label').html(cardObj.barcode)
        card.find('.test-name-label').html(cardObj.patientFullName)
        card.find('.test-id-label').html(cardObj.patientId)
        card.find('.test-visit-label').html(cardObj.visitId)
        card.find('.test-tester-label').html(cardObj.testerName)
        card.find('.test-barcode-checkbox').attr('name', `test_checked[${val.id}]`)
        return card
    },
    updateList: (cards) => {
        $('.tests-wrapper').children().remove()
        $.each(cards, (i,val) => {
            $('.tests-wrapper').append(testCards.makeCard(val))

        })
    },
    init: () => {
        testCards.Card = $('.test-details-card-tmp').clone()
        $('.test-details-card-tmp').remove()
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