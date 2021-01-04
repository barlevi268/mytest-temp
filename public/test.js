$(() => {

    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')

    document.getElementById('decodeFile').addEventListener('click', () => {
        const img = document.getElementById('img')
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