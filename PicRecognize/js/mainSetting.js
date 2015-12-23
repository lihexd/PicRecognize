
var initEditPage = function() {
    console.log("hello initEditPage");
}

var saveMainPassword = function() {
    mainPWSetTime = mainPWSetTime + 1;
    if (mainPWSetTime == 1) {
        firstMainPWSet = stringMainPW;
        if (firstMainPWSet != null) {
            $("#firstSetMainPW").text("Please set the main password again");
            $("#firstSetMainPW").css({
                "top": "20%"
            });
        } else {
            $("#firstSetMainPW").text("Please set the main password");
            $("#firstSetMainPW").css({
                "top": "20%"
            });
            mainPWSetTime = mainPWSetTime - 1;
        }

    } else if (mainPWSetTime == 2) {
        if (firstMainPWSet == stringMainPW) {
            var encMainPWAfter = Aes.Ctr.encrypt(stringMainPW);
            localStorage.setItem("<---setMainPassword--->", encMainPWAfter);

            mainPWFlg = 1;
            savePWMain = stringMainPW;
            savePWLength = savePWMain.length / 2;

            $("#listPage").show();
            $("#mainPage").hide();
            $("#unlockWaiting").hide();
            currentPage = "listPage";
            console.log("currentPage: " + currentPage);
            showAll();
            $("#setMainPW").hide();
        } else {
            $("#firstSetMainPW").text("Not the same as the last time, please reset");
        }
        mainPWSetTime = 0;
    }

    mainPWLength = 0;
    stringMainPW = "";
    $("#mainPWShow").text("");

}

var unlockMain = function(password) {
    stringMainPW = stringMainPW + password;
    mainPWLength = mainPWLength + 1;
    var passWordShow = "";
    for (var i = 1; i <= mainPWLength; i++) {
        passWordShow = passWordShow + "*";
    }
    $("#mainPWShow").text(passWordShow);
    //console.log("stringMainPW: " +  stringMainPW + "mainPWLength: " + mainPWLength);
    if (mainPWFlg != 0) {
        if (mainPWLength == savePWLength) {
            checkMainPW(stringMainPW);
        }
    }
}

var checkMainPW = function(password) {
    if (password == savePWMain) {
        $("#unlockWaiting").show();
        setTimeout(function() {
            if(autoBack!=1){
            	currentPage = "listPage";
            	$("#listPage").show();
            	console.log("currentPage: " + currentPage + ": " + autoBack);
            }else{
            	autoBack=0;
            	currentPage = "listPage";
            }
            $("#mainPage").hide();
            $("#unlockWaiting").hide();
            mainPWLength = 0;
            stringMainPW = "";
            $("#mainPWShow").text("");
        }, 2000);
        showAll();
    } else {
        mainPWLength = 0;
        stringMainPW = "";
        $("#mainPWShow").text("");
        showToast("Wrong password, please try again");
    }
}

var searchMainPW = function() {
    if (localStorage.length > 0) {
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) == "<---setMainPassword--->") {
                var mainPWStr = localStorage.key(i);
                var decMainPWBefore = localStorage.getItem(mainPWStr);
                savePWMain = Aes.Ctr.decrypt(decMainPWBefore);
                savePWLength = savePWMain.length / 2;
                //console.log("savePWMain: " + savePWMain + "savePWLength: " + savePWLength);
                mainPWFlg = 1;
                break;
            }

            if (localStorage.key(i) == "<-<-<---setFaceTextMain--->->->") {
                var mainPicStr = localStorage.key(i);
                saveFaceText = localStorage.getItem(mainPicStr);
            }
        }
        if (mainPWFlg == 0) {
            $("#setMainPW").show();
            $('#mainTitle').css("top", "5%");
        } else {
            $("#setMainPW").hide();
            resetMainPage();
        }
    } else {
        $("#setMainPW").show();
    }
}

var deleteMainPW = function() {
    mainPWLength = mainPWLength - 1;
    var passWordShow = "";
    for (var i = 1; i <= mainPWLength; i++) {
        passWordShow = passWordShow + "*";
    }
    $("#mainPWShow").text(passWordShow);
    console.log("stringMainPW delete before: " + stringMainPW);
    stringMainPW = stringMainPW.substr(0, mainPWLength * 2);
    console.log("stringMainPW delete after: " + stringMainPW);
}

var resetMainPage = function() {
    $('#mainTitle').css("top", "13%");
    $('#mainPWShow').css("top", "31%");
    $('#mainPWDelete').css("top", "31%");
    $('#mainPage3dBox').css("top", "46%");
}

var changeDivShow = function() { //show  
    var d = document.getElementById("settingMain");
    var w = d.offsetWidth;
    var maxw = 225;

    function dmove() {
        w += 20; //show speed  
        if (w >= maxw) {
            d.style.width = '70%';
            clearInterval(iIntervalId);
        } else {
            d.style.display = 'block';
            d.style.width = w + 'px';
        }
    }
    iIntervalId = setInterval(dmove, 2);
}

var changeDivHide = function() { //hide  
    var d = document.getElementById("settingMain");
    var w = d.offsetWidth;

    function dmove() {
        w -= 25; //hide speed  
        if (w <= 0) {
            d.style.display = 'block';
            clearInterval(iIntervalId);
            $("#settingMain").hide();
        } else {
            d.style.width = w + 'px';
        }
    }
    iIntervalId = setInterval(dmove, 2);
}

var resetMainPassword = function() {
    $('#mainTitle').css("top", "5%");
    $('#mainPWShow').css("top", "28%");
    $('#mainPWDelete').css("top", "28%");
    $('#mainPage3dBox').css("top", "43%");
    $("#firstSetMainPW").text("Please reset the main password, click the pieces of the box");
    $("#setMainPW").show();
    mainPWSetTime = 0;
    mainPWFlg = 0;
    $("#mainPage").show();
    $("#listPage").hide();
    currentPage = "mainPage";
}

var resetPageSize = function() {
    $('#mainPage').css("height", deviceHeight-20);
    $('#detailPage').css("height", deviceHeight);
    $('#editPage').css("height", deviceHeight);
}

var checkIfClick = function() {
    isClick = 0;
    clearInterval(clickSign);
    clickSign = setInterval(checkIfBackToMain, judgeSpeed);
}

var checkIfBackToMain = function() {
    if (isClick == 0 && currentPage != "mainPage") {
    	autoBack = 1;
        allBackToMain();
        clearInterval(clickSign);
        clickSign = setInterval(checkIfBackToMain, judgeSpeed);
    }
    isClick = 0;
}

var allBackToMain = function() {
    resetMainPage();
    hideAll();
    mainPWFlg = 1;
    $("#mainPage").show();
    if(autoBack!=1){
        $("#listPage").hide();  	
    }
    currentPage = "mainPage";
}

var hideAll = function() {
    $("#settingMain").hide();
    $("#popPwGen").hide();
    $("#localApplicationList").hide();
    $("#fadeEdit").hide();
    $("#fadeList").hide();
    $("#setMainPictures").hide();
}

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

function change3dCheckStyle() {
    if ($("check_box_3d").attr('checked') == "checked") {
        $("#setBoxName" + index).click();
    }
}

function reset3dBox() {
	console.log("saveFrontPic: " + saveFrontPic);
    if (saveFrontPic != "" && saveFrontPic != undefined) {
        $("#setFrontPicture").attr("src", saveFrontPic);
    }
    if (saveBackPic != "" && saveBackPic != undefined) {
        $("#setBackPicture").attr("src", saveBackPic);
    }
    if (saveTopPic != "" && saveTopPic != undefined) {
        $("#setTopPicture").attr("src", saveTopPic);
    }
    if (saveBottomPic != "" && saveBottomPic != undefined) {
        $("#setBottomPicture").attr("src", saveBottomPic);
    }
    if (saveLeftPic != "" && saveLeftPic != undefined) {
        $("#setLeftPicture").attr("src", saveLeftPic);
    }
    if (saveRightPic != "" && saveRightPic != undefined) {
        $("#setRightPicture").attr("src", saveRightPic);
    }
    if (saveFaceText == "check") {
        $("#BoxFront").text("Front");
        $("#BoxBack").text("Back");
        $("#BoxLeft").text("Left");
        $("#BoxRight").text("Right");
        $("#BoxTop").text("Top");
        $("#BoxBottom").text("Bottom");
    } else {
        $("#BoxFront").text("");
        $("#BoxBack").text("");
        $("#BoxLeft").text("");
        $("#BoxRight").text("");
        $("#BoxTop").text("");
        $("#BoxBottom").text("");
    }

}

function setMainPictures() {
    $("#setMainPictures").hide();
    $("#settingMain").hide();

    var checkBox3d = $("#check_box_3d").attr('checked');
    if (checkBox3d == "checked") {
        $("#BoxFront").text("Front");
        $("#BoxBack").text("Back");
        $("#BoxLeft").text("Left");
        $("#BoxRight").text("Right");
        $("#BoxTop").text("Top");
        $("#BoxBottom").text("Bottom");
        localStorage.setItem("<-<-<---setFaceTextMain--->->->", "check");
    } else {
        $("#BoxFront").text("");
        $("#BoxBack").text("");
        $("#BoxLeft").text("");
        $("#BoxRight").text("");
        $("#BoxTop").text("");
        $("#BoxBottom").text("");
        localStorage.setItem("<-<-<---setFaceTextMain--->->->", "uncheck");
    }
}

function getFacePictures() {
    getPictures("setFront.png");
    getPictures("setBack.png");
    getPictures("setTop.png");
    getPictures("setBottom.png");
    getPictures("setLeft.png");
    getPictures("setRight.png");
    
    setTimeout(function() {
    	reset3dBox();
    }, 1500);
}

function changeSettingCheckStyle() {
	if (saveFaceText == "check" || saveFaceText == ""|| saveFaceText==undefined) {
	    if ($("#check_box_3d").attr('checked') == undefined) {
	        $("#setBoxName").click();
	    }		
	}else if(saveFaceText == "uncheck"){
	    if ($("#check_box_3d").attr('checked') == "checked") {
	        $("#setBoxName").click();
	    }		
	}
}

console.log('view.js initialized');