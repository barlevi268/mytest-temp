function initCities() {
  $.getJSON("/media/cities.json", data =>
    $.each(data, (i, val) =>
      $('[name="cityCode"]').append(
        `<option value="${val.City_Code}">${val.CityName_Hebrew}</option>`
      )
    )
  );
}

$('form').on('submit', async e => {
  e.preventDefault();
  
  const formData = {
    clinicCode: "BH",
    IdNum: $('[name="IdNum"]').val(),
    FirstName: $('[name="FirstName"]').val(),
    LastName: $('[name="LastName"]').val(),
    DOB: $('[name="DOB"]').val(),
    Gender: $('[name="Gender"]').val(),
    HMO: parseInt($('[name="HMO"]').val()),
    cityCode: parseInt($('[name="cityCode"]').val()),
    streetName: $('[name="streetName"]').val(),
    streetNumber: parseInt($('[name="streetNumber"]').val()),
    telHome: "",
    mobile: $('[name="mobile"]').val(),
    email: "",
    Comment: "self service patient"
  };

  const testData = {
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
  
  
  const proceesToCard = () =>
    (location.href = `/bp?id=${formData.IdNum}&firstName=${formData.FirstName}&lastName=${formData.LastName}&birthDate=${formData.DOB}`);

  await fetch(
    "https://patients.terem.com/myvisit/covidLab/savePatient",
    {
      method: "POST",
      headers: {
        Host: "patients.terem.com",
        "Content-Type": "application/json",
        username: "adminLab19",
        pw: "labws12!"
      },
      body: JSON.stringify(formData)
    }
  ).then(async response => {
    const responseText = await response.text()
    
    // parseInt only working method to verify correct response.
    if (response.status == 200 && parseInt(responseText)) {
      proceesToCard()
    } else {
      alertModal.display({
        content:'מתנצלים, לא הצלחנו לשלוח את הטופס...',
        primaryLabel:'נסה שוב',
        hideSecondary:true
      })
    }
  })
})

$(() => {
  initCities();
});
