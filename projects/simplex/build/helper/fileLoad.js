define(["require", "exports", 'filesaver'], function (require, exports, saveAs) {
    "use strict";
    function downloadFile(json) {
        var blob = new Blob([json], { type: "application/json;charset=utf-8" });
        saveAs(blob, 'simplex-' + Date.now() + '.json');
    }
    exports.downloadFile = downloadFile;
    function uploadFile(callback, event) {
        var file = event.target.files[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var res = JSON.parse(e.target.result);
            callback(res);
        };
        reader.readAsText(file);
    }
    exports.uploadFile = uploadFile;
});

//# sourceMappingURL=fileLoad.js.map
