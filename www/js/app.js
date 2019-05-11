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

$$(".button.card-side").on("click", function(){
	$$(".button.card-side").removeClass("selected");
	$$(this).addClass("selected");
	var txt = ($$(this).hasClass("front") ? 'front' : 'back');
	$$("span.card-side").text(txt);
});

$$("#capturePhoto").on("click", capturePhoto);


function capturePhoto() {
// Take picture using device camera and retrieve image as base64-encoded string
    if (typeof camera === "undefined") {
		app.dialog.alert("No camera available");
    }
    else {
    	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
    }
}

//Callback function when the picture has been successfully taken
function onPhotoDataSuccess(imageData) {                
    // Get image handle
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    smallImage.style.display = 'block';
    smallImage.src = imageData;
}

//Callback function when the picture has not been successfully taken
function onFail(message) {
    app.alert('Failed to load picture because: ' + message);
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

