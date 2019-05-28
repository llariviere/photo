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

var fs_ = null;
var cwd_ = null;
  
$$(".button.card-side").on("click", function(){
	$$(".button.card-side").removeClass("selected");
	$$(this).addClass("selected");
	B.card_side = ($$(this).hasClass("front") ? 'front' : 'back');
	$$("span.card-side").text(B.card_side);
	$$("#card-photo > img").addClass("hidden");
	$$("#card-photo > img."+B.card_side).removeClass("hidden");
});

	$$("#capturePhoto").on("click", capturePhoto);
	$$("#retreivePhoto").on("click", retreivePhoto);
	$$("#savePhoto").on("click", savePhoto);
	
	function setOptions(srcType) {
	    var options = {
	        quality: 50,
	        targetHeight: 1024,
	        targetWidth: 1024,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: srcType,
	        encodingType: Camera.EncodingType.PNG,
	        mediaType: Camera.MediaType.PICTURE,
	        allowEdit: false,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
	    return options;
	}
	
	function savePhoto() {
		var ImageUri = { 
			front:$$('#card-photo-front').attr("src"),
			back:$$('#card-photo-back').attr("src")
		}
		var now = Date.now();
		B.dirname = now.toString();

		if (ImageUri.front) {
			console.log("1");
			window.resolveLocalFileSystemURL(ImageUri.front, function (fileEntry) {
				console.log("2");
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
					fs_ = fileSys;
					cwd_ = fs_.root;
					console.log("3");
					cwd_.getDirectory(B.dirname, {create:true, exclusive: false}, function(dirEntry) {
						console.log("4");
						cwd_ = dirEntry;
						fileEntry.moveTo(dirEntry, "front.png", function(){
							console.log("5");
						}, onFail0);
					}, onFail);
				}, onFail);
			}, onFail);
		}
		
		if (ImageUri.back) {
			window.resolveLocalFileSystemURL(ImageUri.back, function (fileEntry) {
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
	          console.log("folder create : ");
	          console.log(fileSys);
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
	
	function retreivePhoto() {
		cwd_ = fs_.root;
		var html = [];
  		// On liste les dossiers...
  		ls_(function(dir_entries) {
         if (dir_entries.length) {
           
           for(var i=0; i<dir_entries.length; i++) {
           	 var entry = dir_entries[i];
           	 if (entry.isFile) {
           	 	// html.push('<div><img src="'+entry.nativeURL+'" /></div>');
           	 } else {
           	 	//html.push('<div><span class="">', entry.name, '</span></div>');
           	 	var dirname = entry.name;

					cwd_.getDirectory(dirname, {}, function(dirEntry) {
						cwd_ = dirEntry;
						var frontfile = '', backfile = '';
						ls_(function(file_entries) {
							if (file_entries.length) {
								for(var i=0; i<file_entries.length; i++) {
									if(file_entries[i].name=="front.png") frontfile = file_entries[i].nativeURL;
									if(file_entries[i].name=="back.png") backfile = file_entries[i].nativeURL;
								}
							}
      						});
					}, onFail);
					var date = new Date(parseInt(dirname));
					
					html.push('<li>\
			  <a href="#" onClick="loadPhoto('+dirname+')" class="item-link item-content">\
				 <div class="item-inner">\
					<div class="item-title">\
						<div class="item-header">'+date.toString()+'</div>\
					</div>\
			    	<div class="item-media"><img src="'+frontfile+'" height="80"/></div>\
			    	<div class="item-media"><img src="'+backfile+'" height="80"/></div>\
			    </div>\
			  </a>\
			</li>')

           	 }
           }
         }
      });
				         
		var dynamicPopup = app.popup.create({
		  content: 
'<div class="popup">\
	<div class="block">\
		<p>Popup created dynamically.</p>\
		<p><a href="#" class="link popup-close">Close</a></p>\
	</div>\
	<div class="list">\
		<ul>'+html.join('')+'</ul>\
	</div>\
</div>',
		  // Events
		  on: {
		    open: function (popup) {
		      console.log('Popup open');
		    },
		    opened: function (popup) {
		      console.log('Popup opened');
		    },
		  }
		});
	}
	function retreivePhoto0() {
		var options = setOptions(Camera.PictureSourceType.PHOTOLIBRARY);
		navigator.camera.getPicture(onRetreived, onFail, options);
	}
	
	function onRetreived(imageUri) {
		$$('#card-photo-'+B.card_side).attr("src", imageUri);
	    $$("#retreivePhoto, #savePhoto, #processCard").parent().toggleClass("hidden");
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
	    $$("#retreivePhoto, #savePhoto, #processCard").parent().toggleClass("hidden");
	}
	
	function onFail(message) {
	    app.dialog.alert('Failed because: ' + message);
	}
	
	function onFail0(message) {
	    app.dialog.alert('Failed "fileSys.root.getDirectory": ');
	    console.log(message)
	}
	
	function onFail1(message) {
	    app.dialog.alert('Failed "fileEntry.moveTo": ');
	    console.log(message)
	}
	
	function ls_(successCallback) {
    if (!fs_) {
      return;
    }

    // Read contents of current working directory. According to spec, need to
    // keep calling readEntries() until length of result array is 0. We're
    // guarenteed the same entry won't be returned again.
    var entries = [];
    var reader = cwd_.createReader();

    var readEntries = function() {
      reader.readEntries(function(results) {
        if (!results.length) {
          entries = entries.sort();
          successCallback(entries);
        } else {
          entries = entries.concat(util.toArray(results));
          readEntries();
        }
      }, onFail);
    };

    readEntries();
  }
  
var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};
	
