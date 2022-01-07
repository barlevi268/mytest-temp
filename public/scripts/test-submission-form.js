var testID;
var btnSubmissionForm = $(".btn-submission-form");

function initTestID() {
  const pathname = location.pathname;
  const testIdFromPathName = pathname.replace(/^\//).replace(/\/test/);
  if (testIdFromPathName) {
    testID = testIdFromPathName;
    return;
  }
  location.href = '/';
}

function testSubmissionClickHandler() {
  alertModal.display({
    modalId: 'alertModal',
    icon: "success",
    content: "ביצוע בדיקה נשלח",
    hideSecondary: true,
    primaryLabel: "סיום",
    primaryAction: () => (location.href = '/profile'),
  });
}

$(() => {
  initTestID();
  btnSubmissionForm.on("click", async e => testSubmissionClickHandler(e));
});
