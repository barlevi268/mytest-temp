// $(() => {
//   const codeReader = new ZXing.BrowserBarcodeReader();
//   console.log("ZXing code reader initialized");

//   $('[type="file"]').on("change", function(e) {
//     function readURL(input) {
//       if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = e => {
//           $("img").attr("src", e.target.result);
//         };

//         reader.readAsDataURL(input.files[0]);
//       }
//     }

//     e.target.files && e.target.files.length ? readURL(e.target) : "";
//   });

//   document.getElementById("decodeFile").addEventListener("click", e => {
//     e.preventDefault();
//     const img = $("img")[0];
//     codeReader
//       .decodeFromImageElement(img)
//       .then(result => {
//         console.log(result);
//         document.getElementById("result").textContent = result.text;
//       })
//       .catch(err => {
//         console.error(err);
//         document.getElementById("result").textContent = err;
//       });
//   });
// });
class PassportDetails {
  constructor(text) {
    const regex = /P<([\s\S]*)/;
    
    var array = mrz.match(regex)[0].split('<');
    
    this.lastName = array[1].substring(3)
    this.firstName = array[3]
    this.documentNumber = array[26]
  }
}
const LiItem = $('.test-text').clone()
$(() => {
  Tesseract.recognize(
    "https://cdn.glitch.com/51421fab-5312-472c-b55e-cf03f12cfde7%2FPhoto%20on%2006-01-2021%20at%2014.41.jpg?v=1610550825808",
    "eng",
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
    var li = LiItem.clone()
    const regex = /P<([\s\S]*)/;
    const mrz = text.match(regex)[0].split('<');
    console.log(new PassportDetails(text))
    li.html(mrz)
    
    $('ul').append(li)
    
    
  });
});

