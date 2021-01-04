$(() => {

    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')

    $('[type="file"]').on("change", function(e) {
        function readURL(input) {
            if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = e => {
                $("img").attr("src", e.target.result);
              };
      
              reader.readAsDataURL(input.files[0]);
            }
          }

        e.target.files && e.target.files.length ? readURL(e.target) : "";
    });
    
    document.getElementById('decodeFile').addEventListener('click', () => {
        const img = $("img")[0]
        codeReader.decodeFromImage(img).then((result) => {
            console.log(result)
            document.getElementById('result').textContent = result.text
        }).catch((err) => {
            console.error(err)
            document.getElementById('result').textContent = err
        })
        console.log(`Started decode for image from ${img.src}`)
    })



})