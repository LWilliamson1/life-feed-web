
// Define some variables used to remember state.
var playlistId, nextPageToken, prevPageToken;
var newSubArr = new Array();
// After the API loads, call a function to get the uploads playlist ID.

function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

function handleAPILoaded() {
  //requestUserUploadsPlaylistId();
  getUserActivitiesList();
}
/*
$("#videoContainer").on('click', function(e){
	console.log("Saw click");
	$(".theater").removeClass("theater");
	$(this).addClass("theater");
});
*/
// Call the Data API to retrieve the playlist ID that uniquely identifies the
// list of videos uploaded to the currently authenticated user's channel.

function getUserActivitiesList() {
    var request = gapi.client.youtube.activities.list({
    maxResults: 10,
    part: 'contentDetails',
    home: true
  });

  request.execute(function(response) {
    var results = response.result;
    console.log(results);
   // $("#yt").html("");
    $.each(results.items, function(index, item) {
      if(item.contentDetails.upload){
        $("#yt").append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2"><h3>'+'channel name'+'</h3><img id="'+item.contentDetails.upload.videoId+'" class="yt-thumb images-responsive img-fluid tile-spacing" data-toggle="modal" data-target="#myModal" src="http://img.youtube.com/vi/'+item.contentDetails.upload.videoId+'/0.jpg"/></div>');
      }
    });
  
    $('#yt img').on('click', function(){
        console.log('click');
        $(".modal-body").html('<div class="col-xs-12"><div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="//www.youtube.com/embed/'+event.target.id+'" allowfullscreen="true"></iframe></div></div>');
      });
    
    resetVideoHeight();
    
  });

}

function requestUserUploadsPlaylistId() {
  // See https://developers.google.com/youtube/v3/docs/channels/list
	var request = gapi.client.youtube.activities.list({
		maxResults: 10,
		part: 'contentDetails',
		home: true
	});
/*	request.execute(function(response) {
		console.log(response);
		for(var i=0; i < 5; i++){
			if(response.result.items[i].contentDetails.upload){
			//	console.log(response.result.items[i]);
				newSubArr.push(response.result.items[i]);
					
			}
		}
	
		console.log(newSubArr);
	});
*/  
     request.execute(function(response) {
          var results = response.result;
	//console.log(results);
          $("#results").html("");
          $.each(results.items, function(index, item) {
		if(item.contentDetails.upload){
            $.get("tpl/item.html", function(data) {
                $("#results").append('tplawesome(data, [{"title":"title", "videoid":item.contentDetails.upload.videoId}])');
            });
	}
          });
          resetVideoHeight();
       });
 
  var request = gapi.client.youtube.channels.list({
    mine: true,
    part: 'contentDetails'
  });
  request.execute(function(response) {
	//console.log(response);
    playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
    requestVideoPlaylist(playlistId);
  });
}

// Retrieve the list of videos in the specified playlist.
function requestVideoPlaylist(playlistId, pageToken) {
  $('#video-container').html('');
  var requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    maxResults: 5
  };
  if (pageToken) {
    requestOptions.pageToken = pageToken;
  }
  var request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {
    // Only show pagination buttons if there is a pagination token for the
    // next or previous page of results.
    nextPageToken = response.result.nextPageToken;
    var nextVis = nextPageToken ? 'visible' : 'hidden';
    $('#next-button').css('visibility', nextVis);
    prevPageToken = response.result.prevPageToken
    var prevVis = prevPageToken ? 'visible' : 'hidden';
    $('#prev-button').css('visibility', prevVis);

    var playlistItems = response.result.items;
    if (playlistItems) {
      $.each(playlistItems, function(index, item) {
        displayResult(item.snippet);
      });
    } else {
      $('#video-container').html('Sorry you have no uploaded videos');
    }
  });
}

// Create a listing for a video.
function displayResult(videoSnippet) {
  var title = videoSnippet.title;
  var videoId = videoSnippet.resourceId.videoId;
  $('#video-container').append('<p>' + title + ' - ' + videoId + '</p>');
}

// Retrieve the next page of videos in the playlist.
function nextPage() {
  requestVideoPlaylist(playlistId, nextPageToken);
}

// Retrieve the previous page of videos in the playlist.
function previousPage() {
  requestVideoPlaylist(playlistId, prevPageToken);
}

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}


