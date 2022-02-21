var test = 'fddfdf';

var recordedTests = [];
var awaitingResult = [];


function createRecordedTest(test) {
    const link = `href="submit-test/${test.id}"`;
    recordedTests.push({
        test: test.serial_number,
        name: `${test.user.first_name} ${test.user.last_name}`,
        nameLink: 'בצע בדיקה',
        link: link
    })
}

function createAwaitingResult(test) {
    const link = `href="submit-result/${test.id}"`;
    awaitingResult.push({
        test: test.serial_number,
        name: `${test.user.first_name} ${test.user.last_name}`,
        nameLink: 'שלח תוצאה',
        link: link,
    })
}

function createRecordedTests() {
    currentUser.testKits?.recorded_tests?.forEach(test => {
        createRecordedTest(test)
    });

    if (currentUser.userData.status === 'awaiting-result') {
        currentUser.testKits?.awaiting_results?.forEach(test => {
            createAwaitingResult(test)
        })
    }
}



var resultTmpl = `
  <a
          {{:link}}
          class="nav-item mb-3 btn-primary-gradient"
          style="padding: 1.2rem;"
  >
    <div><span class="text-light" style="font-size: 19px;">{{:name}}</span></div>
    <div class="d-flex justify-content-between align-items-center mb-4" style="height: 20px;">
    <div class="">
    <span class="text-light font-weight-regular">בדיקה מס’: {{:test}}</span>
    </div>
    <div>
      <span class="text-light" style="margin-left: -10px;">{{:nameLink}}</span>
      <img class="p-0 align-items-center" style=" margin-top: -2px;margin-left: -5px;" src="media/go-icon-without-circle.svg"/>
    </div>
    </div>
  </a>
`

$(async () => {
    await getProfile();
    createRecordedTests();

    if (recordedTests.length === 0 && awaitingResult.length === 0){
        $('#awaitingResultTtitle').html('אין בדיקות שממתינות לתוצאה או לבדיקה')
        $('#section-hr').hide();
        $('#recordedTestsTitle').hide();
        return
    }

    if(recordedTests.length !== 0){
        $('#recordedTests').html($.templates(resultTmpl).render(recordedTests))
    } else {
        $('#recordedTestsTitle').hide();
        $('#section-hr').hide();
    }


    if (awaitingResult.length !== 0 ) {
        $('#awaitingResult').html($.templates(resultTmpl).render(awaitingResult))
    } else {
        $('#awaitingResultTtitle').hide()
        $('#section-hr').hide();
    }


});
