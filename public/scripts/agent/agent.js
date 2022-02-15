var recordedTbodyItems = [];
var tablePaginationItems = [];

var patientsTable = $('#patientsTable');
var patientsTablePl;

var initDateRangePicker = function () {
  var start = moment();
  var end = moment();

  function cb(start, end, label) {
    var range = start.format("YYYY-MM-DD") + " - " + end.format("YYYY-MM-DD");
    if (label === 'Custom Range') {
      label = start.format('MMM D') + ' - ' + end.format('MMM D');
    }
    $('#inputDateRange span').html(label);
    $('#inputDateRange input[name="date"]').val(range);
  }

  $('#inputDateRange').daterangepicker({
    direction: true,
    startDate: start,
    endDate: end,
    opens: 'left',
    ranges: {
      'היום': [moment(), moment()],
      'אתמול': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      '7 ימים אחרונים': [moment().subtract(6, 'days'), moment()],
      '30 ימים אחרונים': [moment().subtract(29, 'days'), moment()],
      'החודש הזה': [moment().startOf('month'), moment().endOf('month')],
      'חודש שעבר': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    locale: {
      cancelLabel: 'לְבַטֵל',
      applyLabel: "לְיַשֵׂם",
      customRangeLabel: 'טווח תאריכים',
      daysOfWeek: [
        'א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'
      ],
      monthNames: [
        'ינו',
        'פבר',
        'מרץ',
        'אפר',
        'מאי',
        'יוני',
        'יולי',
        'אוג',
        'ספט',
        'אוק',
        'נוב',
        'דצמ',
      ],
    },
  }, cb);
  cb(start, end, 'היום');
}


function createTableTbodyItems() {
  recordedTests = [];
  const tests = [{ id: 1, idNumber: 'name 1', idSeries: 1 }, { id: 2, idNumber: 'name 2', idSeries: 2 },]
  tests.forEach((test => createTableTbodyItem(test)));
  tablePaginationItems = [
    {
      active: '',
      number: 1,
    },
    {
      active: 'active',
      number: 2,
    }, {
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

async function moreDetails(data) {
  const generateMediaPath = (link) => link ? `/uploaded/${link}` : null;

  let itemPatient = {
    id: data.user_id,
    first_name: data.first_name,
    last_name: data.last_name,
    statusChecked: 'ממתין לאימות',
    phone: data.phone,
    id_passport: data.id_password,
    photoID: 'לחץ לצפייה',
    serial_number: data.serial_number,
    testStatus: 'ממתין לאימות תוצאה',
    testDocumentation: 'לחץ לצפייה',
    result: 'שלילי',
    outcomeDocumentation: 'לחץ לצפייה',
    photoIDLink: generateMediaPath(data.photo_passport),
    testDocumentationLink: generateMediaPath(data.video),
    outcomeDocumentationLink: generateMediaPath(data.image),
  }

  alertModal.display({
    modalId: 'mobileDetailPatientModal',
    icon: "success",
    content: "ביצוע בדיקה נשלח",
    primaryLabel: "אישור נבדק",
    secondaryLabel: "סגור",
    primaryAction: () => {
      sendResultForPatient();
      moreDetailsPatientModal.close();
    },
    secondaryAction: () => {
      if (moreDetailsPatientModal.isUpdated) {
        formFilterTable();
      }
      moreDetailsPatientModal.close();
    },
    onInit: () => {
      moreDetailsPatientModal.init(itemPatient);
    }
  });
}

function sendResultForPatient() {
  let dropdownResultTest = $('input[name="dropdownResultTest"]').val();
  let patientID = $('input[name=patientID]').val();
  location.href = `https://www.teremibh.com/CoronaCultures/corona/findpatient.aspx?TT=13&TZ=${$('#IDPassport').text()}&BC=${$('#serialTest').text()}`
}

function loadTable() {
  patientsTablePl = patientsTable.DataTable({
    ajax: "/testData.txt",
    deferRender: true,
    lengthChange: false,
    serverSide: true,
    pageLength: 50,
    language: {
      paginate: {
        next: 'הַבָּא',
        previous: 'קודם',
      }
    },
    deferLoading: true,
    initComplete: function () {
    }
  });

  $('#patientsTable tbody').on('click', 'tr', function () {
    let data = patientsTablePl.row(this).data();
    moreDetails(data);
  });
  formFilterTable();
}

async function formFilterTable() {
  let params = {};
  $('#formFilterTable').find('[name]').each(function () {
    params[$(this).attr("name")] = $(this).val();
  });

  if (params.idNumber) {
    patientsTablePl.column(0).search(params.idNumber, false, false);
  }
  if (params.idSeries) {
    patientsTablePl.column(1).search(params.idSeries, false, false);
  }
  if (params.date) {
    patientsTablePl.column(2).search(params.date, false, false);
  }
  patientsTablePl.draw()
}

$(async () => {
  // await getProfile();
  initDateRangePicker();
  createTableTbodyItems();
  loadTable();
  // $('#tableTbody').html($.templates(resultTmpl).render(recordedTbodyItems))
});
