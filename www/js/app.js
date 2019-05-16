var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'B.i.z',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/about/',
      url: 'about.html',
    },
  ],
  // ... other parameters
});

var $$ = Dom7;

var mainView = app.views.create('.view-main');

var B = {
	card_side:"front"
};

$$(".button.card-side").on("click", function(){
	$$(".button.card-side").removeClass("selected");
	$$(this).addClass("selected");
	B.card_side = ($$(this).hasClass("front") ? 'front' : 'back');
	$$("span.card-side").text(B.card_side);
});

	$$("#capturePhoto").on("click", capturePhoto);
	
	function setOptions(srcType) {
	    var options = {
	        quality: 50,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: srcType,
	        encodingType: Camera.EncodingType.JPEG,
	        mediaType: Camera.MediaType.PICTURE,
	        allowEdit: false,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
	    return options;
	}

	function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	    if (typeof Camera === "undefined") {
			app.dialog.alert("No camera available");
	    }
	    else {
	    	var options = setOptions(Camera.PictureSourceType.CAMERA);
	    	navigator.camera.getPicture(onSuccess, onFail, options);
	    }
	}
	
	//Callback function when the picture has been successfully taken
	function onSuccess(imageUri) {
	    $$('#card-photo-'+B.card_side).attr("src", imageUri);
	}
	
	//Callback function when the picture has not been successfully taken
	function onFail(message) {
	    app.dialog.alert('Failed to load picture because: ' + message);
	}
	
	function movePic(file){ 
	    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
	} 
	
	//Callback function when the file system uri has been resolved
	function resolveOnSuccess(entry){
	    var d = new Date();
	    var n = d.getTime();
	    //new file name
	    var newFileName = n + ".jpg";
	    var myFolderApp = "biz";
	
	    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
	    	//The folder is created if doesn't exist
	    	fileSys.root.getDirectory( myFolderApp,
		 		{create:true, exclusive: false},
			 function(directory) {
				entry.moveTo(directory, newFileName,  successMove, resOnError);
			 },
		 	resOnError);
		 },
	    resOnError);
	}
	
	//Callback function when the file has been moved successfully - inserting the complete path
	function successMove(entry) {
	    //I do my insert with "entry.fullPath" as for the path
	}
	
	function resOnError(error) {
	    app.dialog.alert(error.code);
	}


/*
    navigator.camera.getPicture(options).then(movePic,function(imageData) {
        $rootScope.imageUpload=imageData;
    }, function(err) {
        console.error(err);
    });

    function movePic(imageData){
        console.log("move pic");
        console.log(imageData);
        window.resolveLocalFileSystemURL(imageData, resolveOnSuccess, resOnError);
    }

    function resolveOnSuccess(entry){
        console.log("resolvetosuccess");

        //new file name
        var newFileName = itemID + ".jpg";
        var myFolderApp = "ImgFolder";

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
            console.log("folder create");

            //The folder is created if doesn't exist
            fileSys.root.getDirectory( myFolderApp,
                {create:true, exclusive: false},
                function(directory) {
                    console.log("move to file..");
                    entry.moveTo(directory, newFileName,  successMove, resOnError);
                    console.log("release");

                },
                resOnError);
        },
        resOnError);
    }

    function successMove(entry) {
        //I do my insert with "entry.fullPath" as for the path
        console.log("success");
        //this is file path, customize your path
        console.log(entry);
    }

    function resOnError(error) {
        console.log("failed"+error);
        app.dialog.alert(error.code);
    }
*/
