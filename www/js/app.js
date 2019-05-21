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
	$$("#card-photo > img").addClass("hidden");
	$$("#card-photo > img."+B.card_side).removeClass("hidden");
});

	$$("#capturePhoto").on("click", capturePhoto);
	$$("#retreiveCard").on("click", retreiveCard);
	$$("#saveCard").on("click", saveCard);
	
	function setOptions(srcType) {
	    var options = {
	        quality: 50,
	        targetHeight: 1024,
	        targetWidth: 1024,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: srcType,
	        encodingType: Camera.EncodingType.JPEG,
	        mediaType: Camera.MediaType.PICTURE,
	        allowEdit: false,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
	    return options;
	}
	
	function saveCard() {
		var ImageUri = { 
			front:$$('#card-photo-front').attr("src"),
			back:$$('#card-photo-back').attr("src")
		}
		var nowName = new Date();
		var dirName = nowName.toString();

		if (ImageUri.front) {
			window.resolveLocalFileSystemURL(ImageUri.front, function (fileEntry) {
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
	          console.log("creating folder...");
	          fileSys.root.getDirectory( dirName, {create:true, exclusive: false}, function(directory) {
	              console.log("move to file..");
	              fileEntry.moveTo(directory, "front.png", successMove, onFail);
	          }, onFailo);
	        }, onFail);
			}, onFail);
		}
		
		if (ImageUri.back) {
			window.resolveLocalFileSystemURL(ImageUri.back, function (fileEntry) {
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
	          console.log("folder create");
	          fileSys.root.getDirectory( dirName, {create:true, exclusive: false}, function(directory) {
	              console.log("move to file..");
	              fileEntry.moveTo(directory, "back.png", successMove, onFail);
	          }, onFail0);
	        }, onFail);
			}, onFail);
		}
	}
	
	//Callback function when the file has been moved successfully - inserting the complete path
	function successMove(entry) {
	    //I do my insert with "entry.fullPath" as for the path
	    app.dialog.alert(entry.fullPath)
	}
	
	function retreiveCard() {
		var options = setOptions(Camera.PictureSourceType.PHOTOLIBRARY);
		navigator.camera.getPicture(onRetreived, onFail, options);
	}
	
	function onRetreived(imageUri) {
		$$('#card-photo-'+B.card_side).attr("src", imageUri);
	    $$("#retreiveCard, #saveCard, #processCard").parent().toggleClass("hidden");
	}

	function capturePhoto() {
	    if (typeof Camera === "undefined") {
			app.dialog.alert("No camera available");
	    }
	    else {
	    	var options = setOptions(Camera.PictureSourceType.CAMERA);
	    	navigator.camera.getPicture(onSuccess, onFail, options);
	    }
	}
	
	function onSuccess(imageUri) {
	    $$('#card-photo-'+B.card_side).attr("src", imageUri);
	    $$("#retreiveCard, #saveCard, #processCard").parent().toggleClass("hidden");
	}
	
	function onFail(message) {
	    app.dialog.alert('Failed because: ' + message);
	}
	
	function onFail0(message) {
	    app.dialog.alert('Failed "fileSys.root.getDirectory": ');
	    console.log(message)
	}
