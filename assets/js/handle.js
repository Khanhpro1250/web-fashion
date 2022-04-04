// UPLOAD img cloudinary
const cloudName = 'khanh15032001';
const unsignedUploadPreset = 'act5mvqc';
$.cloudinary.config({
    cloud_name: cloudName
})

$('.cloudinary_fileupload').unsigned_cloudinary_upload(unsignedUploadPreset, {
    cloud_name: cloudName,
    tags: 'browser_uploads'
}, {
    multiple: true
}).bind('cloudinarydone', function (e, data) {
    console.log(`data.loaded: ${data.loaded}, data.total: ${data.total}`)
}).bind('fileuploadprogress', function (e, data) {
    console.log(`fileuploadprogress data.loaded: ${data.loaded},
                data.total: ${data.total}`);
}).bind('cloudinaryprogress', function (e, data) {
    console.log(`cloudinaryprogress data.loaded: ${data.loaded},
                data.total: ${data.total}`);
})
    .bind('cloudinarydone', function (e, data) {
        console.log('Upload result', data.result);
        console.log(e)
    });

