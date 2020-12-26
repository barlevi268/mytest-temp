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
    patientId:"313521934",
    phone:"054-7449087",
    birthDate:"30/11/1985",
    sex:"male",
    city:"רחובות"
}

function fakeVisitSuccess() {
    alertModal.display({
        modalId:"visitSuccessModal",
        primaryLabel:"צור ביקור",
        secondaryLabel:"החלף מטופל",
        primaryAction: () => location.href = '/newvisit',
        onInit: () => {
            $('#patientFullNameLabel').html(fakeVisit.fullName)
            $('#testBarcodeLabel').html(fakePatient.patientId)
            $('[name="patientPhone"]').val(fakePatient.phone)
            $('[name="patientBirthDate"]').val(fakePatient.birthDate)
            $('[name="patientSex"]').val(fakePatient.sex)
            $('[name="patientCity"]').val(fakePatient.city)
        }
    })
}
$(() => {

    barcodeReader.init();

});
