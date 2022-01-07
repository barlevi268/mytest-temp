var userName = $("#userName");
var test = 'fddfdf';
var recordedTests = [];
var awaitingResult = [];
function logOut() {
    UserSession.deauthenticate();
}
function createRecordedTest(test) {
    recordedTests.push({
        ...test,
        nameLink: 'בצע בדיקה',
        link: '',
    })
}
function createRecordedTests() {
    recordedTests = [];
    const tests = [{name: 'name 1', test: 1},{name: 'name 2', test: 2},]
    tests.forEach((test => createRecordedTest(test)));
}

function createAwaitingResult(test) {
    awaitingResult.push({
        ...test,
        nameLink: 'שלח תוצאה',
        link: '',
    })
}
function createAwaitingResults() {
    awaitingResult = [];
    const tests = [{name: 'name 1', test: 1},{name: 'name 2', test: 2},]
    tests.forEach((test => createAwaitingResult(test)));
}

var resultTmpl = `

  <a
          href="/findpatient"
          class="nav-item pb-4 mb-3 btn-primary-gradient"
  >
    <div><span class="text-light">{{:name}}</span></div>
    <div class="d-flex justify-content-between align-items-center">
    <div class="">
    <span class="text-light">בדיקה מס’: {{:test}}</span>
    </div>
    <div>
      <span class="text-light">{{:nameLink}}</span>
      <img class="p-0 align-items-center" src="media/go-icon-without-circle.svg"/>
    </div>
    </div>
  </a>
`

$(() => {
    createRecordedTests();
    createAwaitingResults();
    $('#recordedTests').html($.templates(resultTmpl).render(recordedTests))
    $('#awaitingResult').html($.templates(resultTmpl).render(awaitingResult))
    userName.html('first name');
});
