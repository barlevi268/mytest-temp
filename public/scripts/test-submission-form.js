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
  location.href = '/profile';
}

$(() => {
  initTestID();
  btnSubmissionForm.on("click", async e => testSubmissionClickHandler(e));
});
