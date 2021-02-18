function initCities() {
  
  $.getJSON("/media/cities.json", function(data) {
    $.each(data, function(i, val) {
      $('[name="city"]').append(`<option value="${val.City_Code}">${val.CityName_Hebrew}</option>`)
    });

  });
  
}

async function sendPatiant() {
  
  const formData = {
    clinicCode: "BH",
    IdNum: "336878467",
    FirstName: "שרה",
    LastName: "גרינוולד",
    DOB: "12/12/2012",
    Gender: "נ",
    HMO: 3,
    cityCode: 383,
    streetName: "הפסגה",
    streetNumber: 64,
    telHome: "026411157",
    mobile: "0504166626",
    email: "",
    Comment: "testg2"
  };
  
  const networkCheck = await fetch("https://patients.terem.com/myvisit/covidLab/savePatient");
  
  const actualRequest = await fetch("https://patients.terem.com/myvisit/covidLab/savePatient", {
    headers: {
      Host:"patients.terem.com",
      "Content-Type": "application/json",
      username:'adminLab19',
      pw:'labws12!'
    }
  });
  
    
  
}

$(() => {
  
  initCities()
  
});
