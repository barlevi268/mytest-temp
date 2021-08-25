function initRegexChecks() {
  const submitButton = $('[type="submit"]')
  
  var isValid = {
    FirstName:false,
    LastName:false
  }
  
  submitButton.prop('disabled', true)
  
  
  $('[name="FirstName"],[name="LastName"]').on('input', e => {
    const inputText = e.target.value
    const $target = $(e.target)
    
    const inputIsLegal = inputText.match(/^[a-z\u0590-\u05fe \-',`]+$/i)
    
    $target.parent().find('.field-message').remove()
    
    if (inputIsLegal) {
      $target.removeClass("border border-danger");
      isValid[e.target.name] = true 
    } else {
      $target.after('<span class="field-message text-danger">יש להזין אותיות בעברית או באנגלית</span>');
      $target.addClass("border border-danger");
      isValid[e.target.name] = false
    }
    
    isValid.FirstName && isValid.LastName ? submitButton.prop('disabled', false) : submitButton.prop('disabled', true);
    
  })
}

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


function handleBirthDateValidator() {
  var monthSelect = $('')
  var daySelect = $('')
  
  monthSelect.on('change', e => {
    var selectedVale = e.target.value
    
    const thirteeDayMonths
  })
}
$(() => {
  initCities();
  initRegexChecks();
});
