var docPath = 'images';

var getPictures = function(fileName) {
    var doucumentPath;
    var readContent;
    var rootPath = "/opt/usr/media/Images/";

    function openStreamReadSuccess(file) {

        try {
            readContent = file.read(1024 * 1024 * 8);
            //console.log("fileContent:" + readContent);
            console.log("read success");

        } catch (e) {
            console.log("Error read:" + e.message);
        }
        setTimeout(function() {
            file.close();
        }, 1000);
    }

    function openStreamReadError(error) {
        console.log("openStreamReadError " + error.message);
    }

    function listFilesonSuccess(files) {
        //check if picture file is exist
        for (var i = 0; i < files.length; i++) {
            if (files[i].name == fileName) {
                console.log("file " + fileName + " is exist");
                var faceFlg = fileName.replace(".png", "Pic");
                faceFlg = faceFlg.replace("set", "save");
                if (faceFlg === "saveFrontPic") {
                    saveFrontPic = rootPath + fileName;
                } else if (faceFlg === "saveBackPic") {
                    saveBackPic = rootPath + fileName;
                } else if (faceFlg === "saveTopPic") {
                    saveTopPic = rootPath + fileName;
                } else if (faceFlg === "saveBottomPic") {
                    saveBottomPic = rootPath + fileName;
                } else if (faceFlg === "saveLeftPic") {
                    saveLeftPic = rootPath + fileName;
                } else if (faceFlg === "saveRightPic") {
                    saveRightPic = rootPath + fileName;
                }
                //files[i].openStream("r", openStreamReadSuccess, openStreamReadError);
                break;
            }
        }
    }

    function listFilesonError(error) {
        console.log("listFilesError " + error.message);
    }

    function resolveonsuccess(dir) {
        doucumentPath = dir;
        dir.listFiles(listFilesonSuccess, listFilesonError);
    }

    function resolveonerror(error) {
        console.log("resolve_error" + error.message);
    }

    tizen.filesystem.resolve(docPath, resolveonsuccess, resolveonerror);
}

var savePictures = function(fileName, content) {
    var fileExistFlag = false;
    var doucumentPath;

    function openStreamWriteSuccess(file) {
        try {
            file.writeBase64(content);
            //console.log("write success: " + content);
            console.log("save success to: " + fileName);
        } catch (e) {
            console.log("Error write:" + e.message);
        }

        setTimeout(function() {
            file.close();
        }, 1000);

    }

    function openStreamWriteError(error) {
        console.log("openStreamWriteError" + error.message);
    }

    function listFilesonSuccess(files) {
        //check if picture file is exist
        for (var i = 0; i < files.length; i++) {
            if (files[i].name == fileName) {
                files[i].openStream("w", openStreamWriteSuccess, openStreamWriteError);
                fileExistFlag = true;
                break;
            }
        }

        //if picture file is not exist, create it
        if (fileExistFlag == false) {
            var picFile = doucumentPath.createFile(fileName);
            tizen.filesystem.resolve(docPath, resolveonsuccess, resolveonerror);
        }
    }

    function listFilesonError(error) {
        console.log("listFilesError " + error.message);
    }

    function resolveonsuccess(dir) {
        doucumentPath = dir;
        dir.listFiles(listFilesonSuccess, listFilesonError);
    }

    function resolveonerror(error) {
        console.log("resolve_error" + error.message);
    }

    tizen.filesystem.resolve(docPath, resolveonsuccess, resolveonerror);
}

var createPictures = function(fileName) {
    var fileExistFlag = false;
    var doucumentPath;

    function listFilesonSuccess(files) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].name == fileName) {
                fileExistFlag = true;
                break;
            }
        }

        //if picture file is not exist, create it
        if (fileExistFlag == false) {
            var picFile = doucumentPath.createFile(fileName);
            fileExistFlag = true;
        }
    }

    function listFilesonError(error) {
        console.log("listFilesError " + error.message);
    }

    function resolveonsuccess(dir) {
        doucumentPath = dir;
        dir.listFiles(listFilesonSuccess, listFilesonError);
    }

    function resolveonerror(error) {
        console.log("resolve_error" + error.message);
    }

    tizen.filesystem.resolve(docPath, resolveonsuccess, resolveonerror);
}

//copy to function
function copyImages(originFilePath, fileName) {
    var doucumentPath;

    function copyToFileonsuccess() {
        console.log("Copy to file success!");
    }

    function copyToFileonerror(error) {
        console.error("Copy to file error: " + error.message);
    }

    tizen.filesystem.resolve(docPath, function(dir) {
        doucumentPath = dir;
        doucumentPath.copyTo(originFilePath, docPath + "/" + fileName, false, copyToFileonsuccess,
            copyToFileonerror);
    }, function(error) {
        console.error("Error: " + error.message);
    }, "rw");
}

console.log('saveSelectPic.js initialized');