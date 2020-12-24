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
    
    $("#uploadBacode").change( async function() {
        readURL(this);
        javascriptBarcodeReader({
            /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */
            image: uploadBarcodeCaddy,
            barcode: 'code-2of5',
            barcodeType: 'industrial',
            options: {
              // useAdaptiveThreshold: true // for images with sahded portions
              // singlePass: true
            }
          })
            .then(code => {
              console.log(code)
            })
            .catch(err => {
              console.log(err)
            })
    
    });

})