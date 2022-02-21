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
    formEditPatient.find('[name=id_number]').val(moreDetailsPatientModal.itemPatientInfo.id_number)
    formEditPatient.find('[name=phone]').val(moreDetailsPatientModal.itemPatientInfo.phone)
    formEditPatient.find('[name=serial_number]').val(moreDetailsPatientModal.itemPatientInfo.serial_number)
}

async function init() {

    $('#dropdownResultTestMenuNegative').on('click', async (e) => sendResultTestValue(e, {status: 'negative'}))
    $('#dropdownResultTestMenuPositive').on('click', async (e) => sendResultTestValue(e, {status: 'positive'}))
    $('#dropdownResultTestMenuDisqualification').on('click', async (e) => sendResultTestValue(e, {status: 'defected'}))
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

function sendResultTestValue(e, {status}) {
    if (!moreDetailsPatientModal.itemPatientInfo.kit_id) {
        alertModal.display({
            modalId: 'alertModal',
            icon: "error",
            content: 'Sorry, kit_id is empty',
            hideSecondary: true,
            primaryLabel: "הבנתי",
        });
        return;
    }

    let requestObject = new RequestObject('PUT', JSON.stringify({status}), );
    request(`/api/test-kit/${moreDetailsPatientModal.itemPatientInfo.kit_id}`, requestObject)
      .then(res => {
          setResultTestValue(e);
      })
      .catch((res,ajax,status) => {
          try {
              const errorJSON = JSON.parse(res);
              handleEditFailure(errorJSON)
          } catch {
              handleEditFailure(null);
          }
      })
}

function setResultTestValue(e, form$, value, defaultValue) {
    let primaryAction;
    if (form$) {
        primaryAction = form$.find('button.primary-action');
    } else {
        primaryAction = $(e.target).closest("form").find('button.primary-action')
    }
    if (!value && e) {
        value = e.target.outerText;
    }
    if (value) {
        $('#dropdownResultTestMenu').html(value)
        $('input[name="dropdownResultTest"]').val(value)
        primaryAction.prop('disabled', false);
        return;
    } else {
        $('#dropdownResultTestMenu').html(defaultValue)
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
        if (itemPatient && itemPatient.birth_date) {
            const birthDateMoment = moment(itemPatient.birth_date, "YYYY-MM-DD");
            itemPatient = {
                ...itemPatient,
                DOB_year: birthDateMoment.format('YYYY'),
                DOB_month: birthDateMoment.format('MM'),
                DOB_day: birthDateMoment.format('DD'),
            }
        }
        if (itemPatient && itemPatient.statusChecked) {
            switch (itemPatient.statusChecked) {
                case 'negative': {
                    itemPatient.statusChecked = $('#dropdownResultTestMenuNegative')[0].outerText;
                    break
                }
                case 'positive': {
                    itemPatient.statusChecked = $('#dropdownResultTestMenuPositive')[0].outerText;
                    break
                }
                case 'defected': {
                    itemPatient.statusChecked = $('#dropdownResultTestMenuDisqualification')[0].outerText;
                    break
                }
            }
        }
        moreDetailsPatientModal.itemPatientInfo = itemPatient;

        $('#mobileDetailPatientModal.button.primary-action').prop('disabled', true);

        Object.keys(itemPatient).map((itemPatientKey) => {
            const itemInput$ = $(`[name=${itemPatientKey}]`);
            if (itemInput$.length) {
                if (itemInput$.is('select')) {
                    itemInput$.val(`${itemPatient[itemPatientKey]}`).trigger('change');
                    moreDetailsPatientModal.itemPatientInfo[itemPatientKey] = `${itemPatient[itemPatientKey]}`;
                    return;
                }
                itemInput$.val(itemPatient[itemPatientKey]);
            }
        })

        $('input[name=patientID]').val(itemPatient.id);

        $('#patientName').html(`${itemPatient.first_name} ${itemPatient.last_name}`);
        let statusChecked = itemPatient.result ? itemPatient.statusChecked : '';
        if (itemPatient.result) {
            setResultTestValue(null, formEditPatient, itemPatient.statusChecked);
        } else {
            setResultTestValue(null, formEditPatient, null, itemPatient.statusChecked);
        }
        $('#statusChecked').html(statusChecked);
        $('#phone').html(itemPatient.phone);
        $('#IDPassport').html(itemPatient.id_number);
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
    const birth_date = [
        formEditPatient.find('[name=DOB_day]').val(),
        formEditPatient.find('[name=DOB_month]').val(),
        formEditPatient.find('[name=DOB_year]').val()].join('/');
    params = {
        ...moreDetailsPatientModal.itemPatientInfo,
        ...params,
        birth_date
    }
    params['DOB_day'] = undefined;
    params['DOB_month'] = undefined;
    params['DOB_year'] = undefined;
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

function deletePatient() {
    handleEditSuccessDelete();
    let requestObject = new RequestObject('DELETE', JSON.stringify({}), );
    request(`/api/agent/patients/${moreDetailsPatientModal.itemPatientInfo.id}`, requestObject)
      .then(res => {
          handleEditSuccessDelete();
      })
      .catch((res,ajax,status) => {
          try {
              const errorJSON = JSON.parse(res);
              handleEditFailure(errorJSON)
          } catch {
              handleEditFailure(null);
          }
      })
}

function handleEditSuccessDelete() {
    moreDetailsPatientModal.isUpdated = true;
    Swal.success("Deleted successfully");
    $('#mobileDetailPatientModal button.secondary-action').click();
}

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

function handleBirthDateValidator() {
    var monthSelect = $("#DOB_month");
    var daySelect = $("#DOB_day");

    monthSelect.on("change", e => {
        var selectedValue = e.target.value;

        const thirtyDayMonths = ["04", "06", "09", "11"];


        if (thirtyDayMonths.includes(selectedValue)) {
            if (daySelect.val() === '31') {
                daySelect.val("1").trigger('change');
            }
            daySelect.find('[value="31"]').attr("disabled", "disabled");
        } else if (selectedValue === "02") {
            switch (daySelect.val()) {
                case '29':
                case '30':
                case '31':
                {
                    daySelect.val("01").trigger('change');
                }
            }
            daySelect.find('[value="29"],[value="30"],[value="31"]').attr("disabled", "disabled");
        } else {
            daySelect.find("option").removeAttr("disabled");
        }
    });
}

function initCities() {
    $.getJSON("/media/cities.json", data =>
      $.each(data, (i, val) =>
        $('[name="city_code"]').append(
          `<option value="${val.City_Code}">${val.CityName_Hebrew}</option>`
        )
      )
    );
}

$(() => {

    init();
    initCities();
    initSelect2(formEditPatient);
    handleBirthDateValidator();
    window["moreDetailsPatientModal"] = moreDetailsPatientModal
});
