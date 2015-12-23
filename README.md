# Tizen-App-PicRecognize

## 概述

PicRecognize 是一款图像识别应用。这款应用可以识别jpg , bmp, png,gif 等格式图片上的英文与数字，并且给出识别图片所用的时间。
## 算法介绍

PicRecognize基于TIZEN web project开发，主要使用了Html与Javascript技术。通过调用OnBtnClick和onImageChanged函数进行图片的选择与显示，之后调用recognize_image函数识别图片并计时，recognize_image中的OCRAD为图片识别函数的接口。
```js
function onBtnClick(view) {
    var image = $('#imageSelect');
    image.click();
    console.error('onBtnClick:' + view.id);
    setFace = view.id;
}

function onImageChanged(e) {
    console.log('onImageChanged');

    var input = $("#imageSelect")[0];

    if (input.files && input.files[0]) {

        console.log("input.files[0]: " + input.files[0]);
        console.log("input.files[0]: " + input.value);

        var reader = new FileReader();

        reader.onload = function(event) {
            //console.error(event.target.result);
            var picName = setFace + ".png";
            var picContent = event.target.result;
            var picPath = input.value;
            var newPicPath = "/opt/usr/media/Images/" + picName;
            
            var sPicContent = picContent.replace("data:image/png;base64,", "");
            savePictures(picName, sPicContent);

            $("#" + setFace).attr("src", picContent);
            $("#" + setFace + "Pic").val(picPath);

            //localStorage.setItem("<-<-<---" + setFace + "Main--->->->", newPicPath);

            $("#" + setFace + "Picture").attr("src", picContent);
            $("#imageSelect").val('');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

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
function recognize_image() { 
	var start = new Date().getTime();//起始时间
    var string_1 = OCRAD(document.getElementById("setTop"));
    document.getElementById('in').innerText = string_1;
	var end = new Date().getTime();//接受时间
	var time1=(end - start)/1000;//返回函数执行需要时间
	var time2=time1+"s";
    if(string_1) {
		alert("Recognize succeed!time:"+time2);
    }
    else{
		alert("Could not recognize!time:"+time2);
    }
}
	```
