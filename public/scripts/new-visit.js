var barcodeReader = {
    init: function() {
        barcodeReader.attachListeners();

        Quagga.onDetected(function(result) {
            var code = result.codeResult.code;
            $('[name="test_barcode"]').val(code);
        });

    },
    config: {
        reader: "code_128",
        length: 10
    },
    attachListeners: function() {
        var self = this;

        $("#uploadBarcode").on("change", function(e) {
            if (e.target.files && e.target.files.length) {
                barcodeReader.decode(URL.createObjectURL(e.target.files[0]));
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

const fakeVisit = {
    fullName:"חיים רפאלי",
    testBarcode:"40132164",
    visitId:"31628",
}

function fakeVisitSuccess() {
    alertModal.display({
        modalId:"visitSuccessModal",
        primaryLabel:"חזרה לתפריט",
        secondaryLabel:"צור ביקור נוסף",
        icon:"success",
        primaryAction: () => location.href = '/menu',
        secondaryAction: () => location.href = '/findPatient',
        onInit: () => {
            $('#patientFullNameLabel').html(fakeVisit.fullName)
            $('#testBarcodeLabel').html(fakeVisit.testBarcode)
            $('#visitIdLabel').html(fakeVisit.visitId)
        }
    })
}
$(() => {

    barcodeReader.init();

});
