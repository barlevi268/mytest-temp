var testID;
var btnSubmissionForm = $(".btn-submission-form");
var btnOpenTestVideo = $("#openTestVideo");

function initTestID() {
  if (teskitIdParam) {
    testID = teskitIdParam;
    return;
  }
  location.href = '/';
}

function handleFormInvalid() {
  alertModal.display({
    modalId: 'alertModal',
    icon: "error",
    content: "נא להעלות סרטון ביצוע הבדיקה",
    hideSecondary: true,
    primaryLabel: "הבנתי",
  });
}

function handleFormSubmit() {
  let formData = new FormData();

  formData.append("video", $('[name="video"]')[0].files[0]);

  var requestOpbject = new RequestObject('POST', formData, false, 'text', false);

  $('[for="testVideo"]').addClass('d-none')
  btnSubmissionForm.prop('disabled', true).text('מעלה סרטון...');

  request(`/api/test-kit/${teskitIdParam}/upload-video`, requestOpbject)
    .then(res => handleSubmitSuccess())
    .catch((res, ajax, status) => handleSubmitFailure())
}

function handleSubmitSuccess() {
  alertModal.display({
    modalId: 'alertModal',
    icon: "success",
    content: "ביצוע בדיקה נשלח",
    hideSecondary: true,
    primaryLabel: "סיום",
    primaryAction: () => (location.href = '/profile'),
  });
}

function handleSubmitFailure() {
  $('[for="testVideo"]').removeClass('d-none')
  btnSubmissionForm.prop('disabled', false).text('סיים ושלח');

  alertModal.display({
    modalId: 'alertModal',
    content: "לא ניתן להעלות סרטון ביצוע הבדיקה, אנה נסה שוב",
    hideSecondary: true,
    primaryLabel: "הבנתי",
  });
}

function testSubmissionClickHandler() {
  const isValidForm = () => $('[name="video"]')[0].files?.length == 0 ? false : true;

  isValidForm() ? handleFormSubmit() : handleFormInvalid();
}

function videoInputChangeHandler(e) {
  $('.label-text').text(`✅ ${e.target.value.replace("C:\\fakepath\\", '')}`);
}

function initOpenTestVideo() {
  mobileStreamVideo.init({
    resultInput: '[name=video]',
    openButton: '#openTestVideo',
    resultInputCallback: (file) => {}
  });
}
$(() => {
  initTestID();

  $('#testVideo').on('change', videoInputChangeHandler);
  initOpenTestVideo();

  btnSubmissionForm.on("click", async e => testSubmissionClickHandler(e));
});
