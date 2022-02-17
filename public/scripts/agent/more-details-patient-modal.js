var viewContent = $('#viewContent');
var editContent = $('#editContent');
var viewImage = $('#viewImage');
var viewVideo = $('#viewVideo');
var blockVideo = $('#blockVideo');
var videojsID = videojs('videojsID');
var editPatient = $('#edit-patient');
var savePatient = $('#save-patient');
var formEditPatient = $('#formEditPatient');
let statusFormForPatientSave = true;

function backContentImage() {
    setStatusFormForPatient(typeof statusFormForPatientSave === 'boolean' ? null : true);
    viewImage.toggleClass('d-none');
    viewContent.toggleClass('d-none');
}

function backContentVideo(isVideoDispose = true) {
    viewVideo.toggleClass('d-none');
    viewContent.toggleClass('d-none')
    if (isVideoDispose && moreDetailsPatientModal) {
        moreDetailsPatientModal.videoDispose();
    }
}

async function getMediaBlobUrl(link) {
    if (!link) return null;

    var requestObj = {
        headers: {
            Authorization: `Bearer ${UserSession.fetch('token')}`,
        }
    }
    var response = await requestFile(link, requestObj, link);
    return await response.urlObject;
}

function setStatusFormForPatient(isSave, params) {
    statusFormForPatientSave = isSave;
    if (statusFormForPatientSave === null) {
        savePatient.addClass('d-none');
        editPatient.addClass('d-none');
        return;
    }
    if (isSave) {
        if (params) {
            moreDetailsPatientModal.customValue({
                ...moreDetailsPatientModal.itemPatientInfo,
                ...params,
            })
        }
        editPatient.removeClass('d-none');
        savePatient.addClass('d-none');
        editContent.addClass('d-none');
        viewContent.removeClass('d-none');
        return;
    }

    editContent.removeClass('d-none');
    viewContent.addClass('d-none');
    editPatient.addClass('d-none');
    savePatient.removeClass('d-none');
}

function listenClickStatusFormForPatient() {
    editPatient.on('click', () => {
        initFormEdit();
        setStatusFormForPatient(false);
    })
    savePatient.on('click', () => {
        formEditPatient.find('[type="submit"]').click()
    })
}

function updatePatientInfo() {
    if (!moreDetailsPatientModal.itemPatientInfo) {
        console.error('moreDetailsPatientModal.itemPatientInfo', moreDetailsPatientModal.itemPatientInfo);
        return;
    }
    let formDataValue = {};
    formEditPatient.find('[name]').each((_, element) => {
        const element$ = $(element);
        const name = element$.attr('name');
        formDataValue = {
            ...formDataValue,
            [name]: element$.val()
        }
    });

    let isNewChange = false;
    const itemPatientInfo = moreDetailsPatientModal.itemPatientInfo;
    Object.keys(formDataValue).find(itemFormKey => {
        if (formDataValue[itemFormKey] === itemPatientInfo[itemFormKey]) {
            return false;
        }
        isNewChange = true;
        return true;
    })
    if (!isNewChange) {
        return;
    }
    return formDataValue;
}

function initFormEdit() {
    if (!moreDetailsPatientModal.itemPatientInfo) {
        return
    }
    formEditPatient.find('[name=first_name]').val(moreDetailsPatientModal.itemPatientInfo.first_name)
    formEditPatient.find('[name=last_name]').val(moreDetailsPatientModal.itemPatientInfo.last_name)
    formEditPatient.find('[name=id_password]').val(moreDetailsPatientModal.itemPatientInfo.id_password)
    formEditPatient.find('[name=phone]').val(moreDetailsPatientModal.itemPatientInfo.phone)
    formEditPatient.find('[name=serial_number]').val(moreDetailsPatientModal.itemPatientInfo.serial_number)
}

async function init() {

    $('#dropdownResultTestMenuNegative').on('click', async (e) => setResultTestValue(e))
    $('#dropdownResultTestMenuPositive').on('click', async (e) => setResultTestValue(e))
    $('#dropdownResultTestMenuDisqualification').on('click', async (e) => setResultTestValue(e))
    setStatusFormForPatient(true);
    listenClickStatusFormForPatient();
    $('#photoID').on('click', async () => {
        var mediaPath = $('#photoID').attr('data-src')

        if (!mediaPath) return;
        var blobUrl = await getMediaBlobUrl(mediaPath)

        $('#imageID').attr('src', blobUrl);

        backContentImage()
    });

    $('#outcomeDocumentation').on('click', async () => {
        var mediaPath = $('#outcomeDocumentation').attr('data-src')
        if (!mediaPath) return;
        var blobUrl = await getMediaBlobUrl(mediaPath);

        $('#imageID').attr('src', blobUrl);

        backContentImage()
    });

    $('#testDocumentation').on('click', async () => {
        var mediaPath = $('#testDocumentation').attr('data-src')
        if (!mediaPath) return;

        var blobUrl = await getMediaBlobUrl(mediaPath)

        backContentVideo(false)

        videojsID.src({ type: 'video/mp4', src: blobUrl});
    });
}

function setResultTestValue(e) {
    let primaryAction = $(e.target).closest("form").find('button.primary-action')
    let value = e.target.outerText;
    if (value) {
        $('#dropdownResultTestMenu').html(value)
        $('input[name="dropdownResultTest"]').val(value)
        primaryAction.prop('disabled', false);
        return;
    }
    primaryAction.prop('disabled', true);
}

function handleViewMedia(url, selector) {
    url ?
      $(selector).html('לחץ לצפייה').css("opacity", "1").attr("data-src",url) :
      $(selector).html('לא נמצא קובץ').css("opacity", "0.5");
}

var moreDetailsPatientModal = {
    itemPatientInfo: undefined,
    isUpdated: false,
    init: (itemPatient) => {
        moreDetailsPatientModal.reset();

        handleViewMedia(itemPatient.testDocumentationLink,'#testDocumentation')
        handleViewMedia(itemPatient.outcomeDocumentationLink,'#outcomeDocumentation')
        handleViewMedia(itemPatient.photoIDLink,'#photoID')
        moreDetailsPatientModal.customValue(itemPatient);
    },
    customValue: function (itemPatient) {
        moreDetailsPatientModal.itemPatientInfo = itemPatient;
        $('#mobileDetailPatientModal.button.primary-action').prop('disabled', true);

        $('input[name=patientID]').val(itemPatient.id);

        $('#patientName').html(`${itemPatient.first_name} ${itemPatient.last_name}`);
        let statusChecked = itemPatient.status;
        $('#statusChecked').html(statusChecked);
        $('#phone').html(itemPatient.phone);
        $('#IDPassport').html(itemPatient.id_password);
        $('#serialTest').html(itemPatient.serial_number);
        $('#testStatus').html(itemPatient.testStatus);
        $('#result').html(itemPatient.result);

        setStatusFormForPatient(true);
    },
    reset: function () {
        viewContent.removeClass('d-none');
        viewImage.addClass('d-none');
        viewVideo.addClass('d-none');
        editContent.addClass('d-none');
    },
    close: function () {
        moreDetailsPatientModal.reset();
        moreDetailsPatientModal.videoDispose();
        moreDetailsPatientModal.itemPatientInfo = undefined;
        moreDetailsPatientModal.isUpdated = false;
    },
    videoDispose: function () {
        if (videojsID && videojsID.dispose) {
            videojsID.pause();
        }
    }
}

formEditPatient.on('submit',async (e) => {
    e.preventDefault();
    let params = updatePatientInfo();
    if (!params) {
        setStatusFormForPatient(true)
        return;
    }
    params = {
        ...moreDetailsPatientModal.itemPatientInfo,
        ...params
    }
    Object.keys(params).map(paramKey => {
        if (!params[paramKey]) {
            params[paramKey] = undefined;
        }
    })
    let requestObject = new RequestObject('PUT', JSON.stringify(params), );
    request(`/api/agent/patients/${params.id}`, requestObject)
      .then(res => {
          handleEditSuccess(res, params);
      })
      .catch((res,ajax,status) => {
          try {
              const errorJSON = JSON.parse(res);
              handleEditFailure(errorJSON)
          } catch {
              handleEditFailure(null);
          }
      })

})

function handleEditSuccess(res, params) {
    moreDetailsPatientModal.isUpdated = true;
    Swal.success("Saved successfully")
    setStatusFormForPatient(true, params);
}

function handleEditFailure(res) {
    if (!res) {
        alertModal.display({
            modalId: 'alertModal',
            content: 'Sorry, looks like there are some errors detected, please try again.',
            hideSecondary: true,
            primaryLabel: "הבנתי",
        });
        return
    }
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
    } else {
        alertModal.display({
            modalId: 'alertModal',
            content: "Sorry, looks like there are some errors detected, please try again.",
            hideSecondary: true,
            primaryLabel: "הבנתי",
        });
    }
}

$(() => {

    init();
    window["moreDetailsPatientModal"] = moreDetailsPatientModal
});
