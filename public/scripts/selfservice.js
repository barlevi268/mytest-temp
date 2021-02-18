function initCities() {
  $.getJSON("/media/cities.json", data =>
    $.each(data, (i, val) =>
      $('[name="cityCode"]').append(
        `<option value="${val.City_Code}">${val.CityName_Hebrew}</option>`
      )
    )
  );
}

async function sendPatiant() {
  
  
  const formData = {
    clinicCode: "BH",
    IdNum: $('[name="IdNum"]').val(),
    FirstName: $('[name="FirstName"]').val(),
    LastName: $('[name="LastName"]').val(),
    DOB: $('[name="DOB"]').val(),
    Gender: $('[name="Gender"]').val(),
    HMO: $('[name="HMO"]').val(),
    cityCode: $('[name="cityCode"]').val(),
    streetName: $('[name="streetName"]').val(),
    streetNumber: $('[name="streetNumber"]').val(),
    telHome: $('[name="telHome"]').val(),
    mobile: $('[name="mobile"]').val(),
    email: $('[name="email"]').val(),
    Comment: "selfe service patient"
  };
  
  const proceesToCard = () => location.href = `\bp?id=${formData.IdNum}&firstName=${formData.FirstName}&lastName=${formData.LastName}&birthDate=${formData.DOB}`
  
  await fetch(
    "https://httpbin.org/status/200"
  ).then(response => {
    if (response.status == 200) {
      proceesToCard()
    }
  })

  const actualRequest = await fetch(
    "https://patients.terem.com/myvisit/covidLab/savePatient",
    {
      headers: {
        Host: "patients.terem.com",
        "Content-Type": "application/json",
        username: "adminLab19",
        pw: "labws12!"
      }
    }
  );
}

$(() => {
  initCities();
});
