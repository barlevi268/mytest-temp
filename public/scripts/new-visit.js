$(() => {
    function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          
          reader.onload = function(e) {
            $('#uploadBarcodeCaddy').attr('src', e.target.result);
          }
          
          reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    }


    var App = {
        init: function() {
            App.attachListeners();
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
                    App.decode(URL.createObjectURL(e.target.files[0]));
                }
            });

        },
        _accessByPath: function(obj, path, val) {
            var parts = path.split('.'),
                depth = parts.length,
                setter = (typeof val !== "undefined") ? true : false;

            return parts.reduce(function(o, key, i) {
                if (setter && (i + 1) === depth) {
                    o[key] = val;
                }
                return key in o ? o[key] : {};
            }, obj);
        },
        _convertNameToState: function(name) {
            return name.replace("_", ".").split("-").reduce(function(result, value) {
                return result + value.charAt(0).toUpperCase() + value.substring(1);
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

    App.init();

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        $('[name="test_barcode"]').val(code);
    });
});
