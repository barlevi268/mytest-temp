var recordedTbodyItems = [];
var tablePaginationItems = [];

var initDateRangePicker = function()
{
    var start = moment();
    var end = moment();

    function cb(start, end, label) {
        var range = '';

        if ((end - start) < 100 || label === 'Today') {
            range = start.format('MMM D');
        } else if (label === 'Yesterday') {
            range = start.format('MMM D');
        } else {
            range = start.format('MMM D') + ' - ' + end.format('MMM D');
        }
        if (label === 'Custom Range') {
            label = start.format('MMM D') + ' - ' + end.format('MMM D');
        }
        $('#inputDateRange span').html(label);
        $('#inputDateRange input[name="date"]').html(range);
    }

    $('#inputDateRange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
    cb(start, end, 'Today');
}


function createTableTbodyItems() {
    recordedTests = [];
    const tests = [{id: 1, idNumber: 'name 1', idSeries: 1},{id: 2, idNumber: 'name 2', idSeries: 2},]
    tests.forEach((test => createTableTbodyItem(test)));
    tablePaginationItems = [
        {
            active: '',
            number: 1,
        },
        {
            active: 'active',
            number: 2,
        },{
            active: '',
            number: 3,
        }
    ]
}

function createTableTbodyItem(test) {
    recordedTbodyItems.push({
        id: `${test.id}`,
        idNumber: `${test.idNumber}`,
        idSeries: `${test.idSeries}`,
    })
}

var resultTmpl = `
<tr onclick="moreDetails({{:id}})">
  <th scope="col">{{:idNumber}}</th>
  <th>{{:idSeries}}</th>
</tr>
`
var tablePaginationTmpl = `
<li class="page-item {{:active}} cursor-pointer">
  <span class="page-link">{{:number}}</span>
</li>
`

function moreDetails(id) {
    let itemPatient = {
        id: id,
        patientName: 'ישראל ישראלי',
        statusChecked: 'ממתין לאימות',
        phone: '0541827211',
        IDPassport: '32891823',
        photoID: 'לחץ לצפייה',
        serialTest: 'A12873123',
        testStatus: 'ממתין לאימות תוצרה',
        testDocumentation: 'לחץ לצפייה',
        result: 'שלילי',
        outcomeDocumentation: 'לחץ לצפייה',
        photoIDLink: 'http://www.google.com/',
        testDocumentationLink: 'http://www.google.com/',
        outcomeDocumentationLink: 'http://www.google.com/',
    }
    alertModal.display({
        modalId: 'mobileDetailPatientModal',
        icon: "success",
        content: "ביצוע בדיקה נשלח",
        primaryLabel: "אימות בדיקה",
        secondaryLabel: "סגור",
        primaryAction: () => sendResultForPatient(),
        secondaryAction: () => {},
        onInit: () => {
            $('button.primary-action').prop('disabled', true);
            $('input[name=patientID]').val(itemPatient.id);
            $('#patientName').html(itemPatient.patientName);
            $('#statusChecked').html(itemPatient.statusChecked);
            $('#phone').html(itemPatient.phone);
            $('#IDPassport').html(itemPatient.IDPassport);
            let photoID = $('#photoID');
            photoID.html(itemPatient.photoID);
            $('#serialTest').html(itemPatient.serialTest);
            $('#testStatus').html(itemPatient.testStatus);
            let testDocumentation = $('#testDocumentation');
            testDocumentation.html(itemPatient.testDocumentation);
            $('#result').html(itemPatient.result);
            let outcomeDocumentation = $('#outcomeDocumentation');
            outcomeDocumentation.html(itemPatient.outcomeDocumentation);
            photoID.attr("href", itemPatient.photoIDLink);
            testDocumentation.attr("href", itemPatient.testDocumentationLink);
            outcomeDocumentation.attr("href", itemPatient.outcomeDocumentationLink);

            $('#dropdownResultTestMenuNegative').on('click', async (e) => setResultTestValue(e) )
            $('#dropdownResultTestMenuPositive').on('click', async (e) => setResultTestValue(e) )
            $('#dropdownResultTestMenuDisqualification').on('click', async (e) => setResultTestValue(e) )
        }
    });
}

function setResultTestValue(e) {
    let primaryAction = $('button.primary-action')
    let value= e.target.outerText;
    if (value) {
        $('#dropdownResultTestMenu').html(value)
        $('input[name="dropdownResultTest"]').val(value)
        primaryAction.prop('disabled', false);
        return;
    }
    primaryAction.prop('disabled', true);
}
function sendResultForPatient() {
    let dropdownResultTest = $('input[name="dropdownResultTest"]').val();
    let patientID = $('input[name=patientID]').val();
    console.log({
        dropdownResultTest,
        patientID
    })
}

$(() => {
    initDateRangePicker();
    createTableTbodyItems();
    $('#tableTbody').html($.templates(resultTmpl).render(recordedTbodyItems))
    $('#tablePagination').html($.templates(tablePaginationTmpl).render(tablePaginationItems))
});
