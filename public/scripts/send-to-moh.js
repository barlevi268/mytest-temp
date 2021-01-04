var testCards = {
    makeCard: (cardElm,cardObj) => {
        cardElm.find('.test-barcode-label').html(cardObj.barcode)
        cardElm.find('.test-name-label').html(cardObj.patientFullName)
        cardElm.find('.test-id-label').html(cardObj.patientId)
        cardElm.find('.test-visit-label').html(cardObj.visitId)
        cardElm.find('.test-tester-label').html(cardObj.testerName)
        cardElm.find('.test-barcode-checkbox').attr('name', `test_checked[${cardObj.id}]`)
        return cardElm
    },
    updateList: (cards) => {
        $('.tests-wrapper').children().remove()
        $.each(cards, (i,val) => {
            var card = testCards.Card.clone()
            $('.tests-wrapper').append(testCards.makeCard(card,val))

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

function showTestApprovale(test) {
    var card = $('.test-details-dialog-card')
    alertModal.display({
        modalId:"testDetailsModal",
        primaryLabel:"אשר והמשך",
        secondaryLabel:"סגור",
        onInit:() => testCards.makeCard(card,test)
    })
}

var barcodeReader = {
    init: function() {
        barcodeReader.attachListeners();

        Quagga.onDetected(function(result) {
            var code = result.codeResult.code;
        });

    },
    config: {
        reader: "code_128",
        length: 10
    },
    attachListeners: function() {
        var self = this;

        $("#scanTest").on("change", function(e) {
            if (e.target.files && e.target.files.length) {
                barcodeReader.decode(URL.createObjectURL(e.target.files[0]));
                $('[for="scanTest"]').removeClass('d-flex')
                // fake find
                showTestApprovale(fakeTests[2])
            }
        });
    },
    decode: function(src) {
        var self = this,
            config = $.extend({}, self.state, {src: src});

        Quagga.decodeSingle(config, function(result) {});
    },
    state: {
        inputStream: {
            size: 800
        },
        locator: {
            patchSize: "medium",
            halfSample: false
        },
        numOfWorkers: 1,
        decoder: {
            readers: [{
                format: "code_128_reader",
                config: {}
            }]
        },
        locate: true,
        src: null
    }
};




function initSignaturePad() {
    var canvas = $('.signature-canvas');
    var btn = $('.submit-dispatch-btn')
    var signaturePad = new SignaturePad(canvas[0]);

    $('.clean-canvas-btn').on('click', (e) => {
        e.preventDefault()

        signaturePad.clear();

        btn.prop('disabled', true)
    })

    canvas.on('mouseup touchend', (e) => {
        btn.prop('disabled', signaturePad.isEmpty() ? true : false) 

        $('[name="recieverSignatureData"]').val(signaturePad.toData())
    })

    canvas.css('width',canvas.parent().width() + 10)
    
    signaturePad.on();

}

function initDispatchModal() {
    alertModal.display({
        modalId:'dispatchModal',
        primaryLabel:'מאשר קבלה',
        afterInit: () => initSignaturePad()
    })
}

$(() => {

    testCards.init()

    barcodeReader.init()

    testCards.updateList(fakeTests)

})