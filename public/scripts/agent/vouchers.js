var vouchersTable = $('#vouchersTable');
var vouchersTableDT;

async function createVoucher() {

  alertModal.display({
    modalId: 'createVoucherModal',
    icon: "success",
    content: "ביצוע בדיקה נשלח",
    primaryLabel: "לשמור",
    secondaryLabel: "סגור",
    primaryAction: () => {
      if (createVoucherModal.isUpdated) {
        updateTable();
      }
      createVoucherModal.close();
    },
    secondaryAction: () => {
      if (createVoucherModal.isUpdated) {
        updateTable();
      }
      createVoucherModal.close();
    },
    onInit: () => {
      createVoucherModal.init();
    }
  });
}

function loadTable() {
  vouchersTableDT = vouchersTable.DataTable({
    ajax: {
      url: '/testVouchers.json',
      type: 'GET',
      headers: {
        'Authorization': `Bearer  ${UserSession.fetch('token')}`
      }
    },
    deferRender: true,
    lengthChange: false,
    serverSide: true,
    pageLength: 50,
    language: {
      paginate: {
        next: 'הבא',
        previous: 'קודם',
      }
    },
    deferLoading: true,
    columns: [
      { title: "Name", data: 'name' },
      { title: "Code", data: 'code' },
      { title: "Quota", data: 'quota' },
      { title: "Activations", data: 'activations' },
    ],
    initComplete: function () {
    }
  });
  updateTable();
}

function updateTable() {
  vouchersTableDT.draw()
}


$(async () => {
  // await getProfile();
  loadTable();
});
