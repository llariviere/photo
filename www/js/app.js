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

B.fs_ = null;
B.cwd_ = null;

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
			console.log("1 : "+ImageUri.front);
			window.resolveLocalFileSystemURL(ImageUri.front, function (fileEntry) {
				console.log("2");
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
					B.fs_ = fileSys;
					B.cwd_ = B.fs_.root;
					console.log("3");
					B.cwd_.getDirectory(B.dirname, {create:true, exclusive: false}, function(dirEntry) {
						B.cwd_ = dirEntry;
						fileEntry.moveTo(dirEntry, "front.png", function(){
							console.log("front.png moved!");
							$$('#card-photo-front').attr("src","");
					   	$$("#savePhoto, #processPhoto").parent().addClass("hidden");
					   	$$("#retreivePhoto").parent().removeClass("hidden");
						}, onFail0);
					}, onFail1);
				}, onFail2);
			}, onFail3);
			
		}
		
		if (ImageUri.back) {
			console.log("1 : "+ImageUri.back);
			window.resolveLocalFileSystemURL(ImageUri.back, function (fileEntry) {
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
					B.fs_ = fileSys;
					B.cwd_ = B.fs_.root;
					B.cwd_.getDirectory(B.dirname, {create:true, exclusive: false}, function(dirEntry) {
						B.cwd_ = dirEntry;
						fileEntry.moveTo(dirEntry, "back.png", function(){
							console.log("back.png moved!");
							$$('#card-photo-back').attr("src","");
					   	$$("#savePhoto, #processPhoto").parent().addClass("hidden");
					   	$$("#retreivePhoto").parent().removeClass("hidden");
						}, onFail0);
		         }, onFail1);
				}, onFail2);
			}, onFail3);
		}
	}
	
	function retreivePhoto() {
		
		B.dynamicPopup = app.popup.create({
		  content: 
'<div class="popup">\
	<div class="block">\
		<p>List of saved card photos.</p>\
		<p><a href="#" class="link popup-close">Close</a></p>\
	</div>\
	<div class="list">\
		<ul id="listPhoto"></ul>\
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
		
		B.dynamicPopup.open();
		
		B.cwd_ = B.fs_.root;
		var html = [];
  		// On liste les dossiers...
  		ls_(function(dir_entries) {
         if (dir_entries.length) {
           console.log("dir_entries.length = "+dir_entries.length)
           for(var i=0; i<dir_entries.length; i++) {
           	 var entry = dir_entries[i];
           	 if (entry.isFile) {
           	 	
           	 } else {
           	 	
           	 	B.dirname = entry.name;
           	 	
           	 	console.log("B.dirname = "+B.dirname)
           	 	
           	 	B.cwd_ = B.fs_.root;
					B.cwd_.getDirectory(B.dirname, {}, function(dirEntry) {
						B.cwd_ = dirEntry;
						var frontfile = '', backfile = '';
						ls_(function(file_entries) {
							
           	 			console.log("file_entries.length = "+file_entries.length)
           	 			
							if (file_entries.length) {
								for(var i=0; i<file_entries.length; i++) {
									if(file_entries[i].name=="front.png") frontfile = file_entries[i].nativeURL;
									if(file_entries[i].name=="back.png")  backfile = file_entries[i].nativeURL;
								}
								
								var dirDate = new Date(parseInt(dirEntry.name));
								
								$$("#listPhoto").append('<li onClick="loadPhoto('+dirEntry.name+')" class="item-content">\
							 <div class="item-inner item-cell">\
							 	<div class="item-row">\
							      <div class="item-cell">'+dirDate.toString()+'</div>\
							    </div>\
							    <div class="item-row">\
							      <div class="item-cell"><img src="'+ frontfile +'" height="80"/></div>\
							      <div class="item-cell"><img src="'+ backfile  +'" height="80"/></div>\
							    </div>\
						    </div>\
						</li>')

							}
      				});
					}, onFail);
           	 }
           }
         } 
         else {
	         console.log("No entries...")
         }
      });
	}
	
	function retreivePhoto0() {
		var options = setOptions(Camera.PictureSourceType.PHOTOLIBRARY);
		navigator.camera.getPicture(onRetreived, onFail, options);
	}
	
	function onRetreived(imageUri) {
		 $$('#card-photo-'+B.card_side).attr("src", imageUri);
	    $$("#retreivePhoto").parent().addClass("hidden");
	    $$("#savePhoto, #processCard").parent().removeClass("hidden");
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
	    $$("#retreivePhoto").parent().addClass("hidden");
	    $$("#savePhoto, #processCard").parent().removeClass("hidden");
	}
	
	function loadPhoto(dirname) {
		B.cwd_ = B.fs_.root;
		B.cwd_.getDirectory(dirname.toString(), {}, function(dirEntry) {
			ls_(function(file_entries) {
				for(var i=0; i<file_entries.length; i++) {
					if(file_entries[i].name=="front.png") $$('#card-photo-front').attr("src", file_entries[i].nativeURL);
					if(file_entries[i].name=="back.png")  $$('#card-photo-back').attr("src",  file_entries[i].nativeURL);
				}
				dirEntry.removeRecursively();
			   $$("#retreivePhoto").parent().addClass("hidden");
			   $$("#savePhoto, #processCard").parent().removeClass("hidden");
				B.dynamicPopup.open();
			});
		}, onFail);
	} 
	
	function onFail(message) {
	    app.dialog.alert('Failed because: ' + message);
	}
	
	function onFail0(message) {
	    app.dialog.alert('Failed "fileEntry.moveTo"');
	    console.log(message)
	}
	
	function onFail1(message) {
	    app.dialog.alert('Failed "B.cwd_.getDirectory"');
	    console.log(message)
	}
	
	function onFail2(message) {
	    app.dialog.alert('Failed "requestFileSystem"');
	    console.log(message)
	}
	
	function onFail3(message) {
	    app.dialog.alert('Failed "resolveLocalFileSystemURL"');
	    console.log(message)
	}
	
	function ls_(successCallback) {
    if (!B.fs_) {
      return;
    }

    // Read contents of current working directory. According to spec, need to
    // keep calling readEntries() until length of result array is 0. We're
    // guarenteed the same entry won't be returned again.
    var entries = [];
    var reader = B.cwd_.createReader();

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
	
