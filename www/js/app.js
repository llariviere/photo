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
	$$("#listPhoto").on("click", listPhoto);
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
		
		if (B.fromfile) {
			$$('#card-photo-front').attr("src","");
			$$('#card-photo-back').attr("src","");
			$$(".button.card-side.back").trigger("click");
			$$(".button.card-side.front").trigger("click");
			return false;
		}
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
					   	$$("#listPhoto").parent().removeClass("hidden");
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
					   	$$("#listPhoto").parent().removeClass("hidden");
						}, onFail0);
		         }, onFail1);
				}, onFail2);
			}, onFail3);
		}
	}
	
	function listPhoto() {
		
		B.dynamicPopup = app.popup.create({
		  content: 
'<div class="popup" style="overflow-y: scroll">\
		<div class="navbar">\
      <div class="navbar-inner">\
        <div class="left"></div>\
        <div class="title">List of saved card photos</div>\
        <div class="right"><a href="#" class="link popup-close">Close</a></div>\
      </div>\
    </div>\
	<div class="list">\
		<ul id="ulPhoto"></ul>\
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
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
			B.fs_ = fileSys;
			B.cwd_ = B.fs_.root;
			var html = [];
	  		// On liste les dossiers...
	  		ls_(function(dir_entries) {
	         if (dir_entries.length) {
	           console.log("dir_entries.length = "+dir_entries.length)
	           
	           for(var i=0; i<dir_entries.length; i++) {
	           	 var entry = dir_entries[i];
	           	 if (entry.isFile) {
	           	 	dir_entries[i].remove();
	           	 } else {
	           	 	
	           	 	B.dirname = entry.name;
	           	 	
	           	 	B.cwd_ = B.fs_.root;
						B.cwd_.getDirectory(B.dirname, {}, function(dirEntry) {
							B.cwd_ = dirEntry;
							var frontfile = '', backfile = '';
							ls_(function(file_entries) {
	           	 			
								if (file_entries.length) {
									
									for(var i=0; i<file_entries.length; i++) {
										
										if(file_entries[i].name=="front.png") frontfile = file_entries[i].nativeURL;
										if(file_entries[i].name=="back.png")  backfile = file_entries[i].nativeURL;
									}
									
									var dirDate = new Date(parseInt(dirEntry.name));
									
									$$("#ulPhoto").append('<li onClick="loadPhoto(\''+dirEntry.name+'\')" class="item-content">\
								 <div class="item-inner item-cell">\
								 	<div class="item-row">\
								      <div class="item-cell">'+dirDate.toString()+'</div>\
								    </div>\
								    <div class="item-row">\
								      <div class="item-cell thumb"><img src="'+ frontfile +'" /></div>\
								      <div class="item-cell thumb"><img src="'+ backfile  +'" /></div>\
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
      }, onFail);
	}

	function capturePhoto() {
	    if (typeof Camera === "undefined") {
			app.dialog.alert("No camera available");
	    }
	    else {
	    	var options = setOptions(Camera.PictureSourceType.CAMERA);
	    	navigator.camera.getPicture( function(imageUri) {
			    $$('#card-photo-'+B.card_side).attr("src", imageUri);
			    
				 B.fromfile = false;
			    //$$("#listPhoto").parent().addClass("hidden");
			    $$("#savePhoto, #processPhoto").parent().removeClass("hidden");
			}, onFail, options);
	    }
	}
	
	function loadPhoto(dirname) {
		B.cwd_ = B.fs_.root;
		B.cwd_.getDirectory(dirname, {}, function(dirEntry) {
			B.cwd_ = dirEntry;
			ls_(function(file_entries) {
				var frontfile = '', backfile = '';
				for(var i=0; i<file_entries.length; i++) {
					if(file_entries[i].name=="front.png") frontfile = file_entries[i].nativeURL;
					if(file_entries[i].name=="back.png")  backfile  = file_entries[i].nativeURL;
				}
				$$('#card-photo-front').attr("src", frontfile);
				$$('#card-photo-back').attr("src",  backfile);
				$$(".button.card-side.front").trigger("click");
				
				//dirEntry.removeRecursively();
			   //$$("#listPhoto").parent().addClass("hidden");
			   
			   $$("#processPhoto").parent().removeClass("hidden");
				B.dynamicPopup.close();
				B.fromfile = true;
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
    
    var entries = [];
    var reader = B.cwd_.createReader();

    var readEntries = function() {
      reader.readEntries(function(results) {
        if (!results.length) {
          entries.sort();
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
	
