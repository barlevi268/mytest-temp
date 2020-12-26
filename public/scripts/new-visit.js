$(() => {



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
                    readURL(this);
                    $('[for="uploadBarcode"]').addClass('d-flex align-items-center justify-content-between')
                    $('[for="uploadBarcode"]').find('u').html('החלף תמונה')
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

    barcodeReader.init();

});
