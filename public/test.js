// $(() => {
//   const codeReader = new ZXing.BrowserBarcodeReader();
//   console.log("ZXing code reader initialized");



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



$('[type="file"]').on("change", function(e) {

      function readURL2(input) {
        
        if (input.files && input.files[0]) {
          
          var reader = new FileReader();
          
          reader.onload = e => detectMrz(e.target.result)

          reader.readAsDataURL(input.files[0]);
        }
      }
  
    e.target.files && e.target.files.length ? readURL2(e.target) : "";
});

class PassportDetails {
  constructor(text) {
    const regex = /P<([\s\S]*)/;
    var mrz = text.replace(/(\r\n|\n|\r)/gm, "")
    var array = mrz.match(regex)[0].split('<');
    
    this.lastName = array[1].substring(3)
    this.firstName = array[3]
    this.documentNumber = array[26]
  }
}
const LiItem = $('.test-text').clone()

function detectMrz(src) {
  $(".progress").show('fast')
  Tesseract.recognize(src, "eng", {
    logger: m => {
      console.log(m);
      m.status == "recognizing text"
        ? $(".progress-bar").css("width", m.progress * 100 + "%")
        : "";
      m.progress === 1 && m.status == "recognizing text"
        ? $(".progress-bar").addClass("bg-success")
        : "";
    }
  }).then(({ data: { text } }) => {
    console.log(text);

    const regex = /P<([\s\S]*)/;
    const mrz = text.match(regex)[0].split("<");

    var passportDetails = new PassportDetails(text);

    console.log(passportDetails);

    var li1 = LiItem.clone(),
      li2 = LiItem.clone(),
      li3 = LiItem.clone();
    li1.html("First Name: " + passportDetails.firstName);
    li2.html("Last Name:" + passportDetails.lastName);
    li3.html("Document Number:" + passportDetails.documentNumber);

    $("ul").append(li1,li2,li3);
  });
}
$(() => {
  $(".progress").hide()
});

