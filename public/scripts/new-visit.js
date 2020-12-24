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
        const codeReader = new ZXing.BrowserQRCodeReader();
        const img = document.getElementById('uploadBarcodeCaddy');
    
        try {
            const result = await codeReader.decodeFromImage(img);
        } catch (err) {
            console.error(err);
        }
    
        console.log(result);
    });

})