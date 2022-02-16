var createVoucherModal$ = $('#createVoucherModal');
var editContent = $('#editContent');
var formEdit = $('#formEdit');

function listenClickStatusFormForPatient() {
    createVoucherModal$.find('#save').on('click', () => {
        formEdit.find('[type=submit]').click();
    })
}

function closeModal() {
    createVoucherModal$.find('.primary-action').click();
}

function updatePatientInfo() {
    let formDataValue = {};
    formEdit.find('[name]').each((_, element) => {
        const element$ = $(element);
        const name = element$.attr('name');
        formDataValue = {
            ...formDataValue,
            [name]: element$.val()
        }
    });
    return formDataValue;
}

function initFormEdit() {
    $.each(formEdit.find('[name]'), (_, val) => {
        $(val).val('');
    })
}

async function init() {
   this.initFormEdit();
   this.listenClickStatusFormForPatient();
}

var createVoucherModal = {
    isUpdated: false,
    init: () => {
        createVoucherModal.reset();
    },
    reset: function () {
        initFormEdit();
    },
    close: function () {
        createVoucherModal.reset();
        createVoucherModal.isUpdated = false;
    },
}

formEdit.on('submit',async (e) => {
    e.preventDefault();
    let params = updatePatientInfo();

    if (!params) {
        return;
    }
    let requestObject = new RequestObject('POST', JSON.stringify(params), );
    request(`/api/agent/vouchers/`, requestObject)
      .then(res => {
          handleEditSuccess(res, params);
      })
      .catch((res,ajax,status) => handleEditFailure(JSON.parse(res)))
})

function handleEditSuccess(res, params) {
    createVoucherModal.isUpdated = true;
    closeModal();
    Swal.success("Saved successfully")
}

function handleEditFailure(res) {
    var errorMessage = res.message;
    var errorData = res.data;

    var formattedError = function() {
        var combinedError = '';
        for (var key in errorData) {
            combinedError += `${errorData[key][0]}</br>`
        }
        return combinedError
    }()

    if (errorMessage == 'Validation failed') {

        alertModal.display({
            modalId: 'alertModal',
            content: formattedError,
            hideSecondary: true,
            primaryLabel: "הבנתי",
        });

    } else if (errorMessage == 'invalid voucher') {
        alertModal.display({
            modalId: 'alertModal',
            content: "קוד קופון לא תקף",
            hideSecondary: true,
            primaryLabel: "הבנתי",
        });
    }
}

$(() => {

    init();
    window["createVoucherModal"] = createVoucherModal
});
