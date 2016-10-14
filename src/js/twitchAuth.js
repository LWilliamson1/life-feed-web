
  // Initialize. If we are already logged in, there is no
  // need for the connect button

    Twitch.init({clientId: 'sse4niadmptvtv0pcpupi3lpbuzwlt9'}, function(error, status) {
        if (status.authenticated) {
          // we're logged in :)
          $('.status input').val('Logged in! Allowed scope: ' + status.scope);
          // Show the data for logged-in users
          $('.authenticated').removeClass('hidden');
            
        Twitch.api({method: 'user'}, function(error, user) {
          $('#twitch-username').text(user.display_name);
        });
                
        } else {
          $('.status input').val('Not Logged in! Better connect with Twitch!');
          // Show the twitch connect button
          $('.authenticate').removeClass('hidden');
        }
        Twitch.api({method: 'streams/followed'}, function(error, user){
          console.log('display streams');
          //$("#results").append("<div>");
          $.each(user.streams, function(index, item) {
            $("#twitch").append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" style="padding-bottom:1rem"><div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="http://player.twitch.tv/?autoplay=false&channel='+item.channel.name+'" allowfullscreen="true" </iframe></div></div>');
        
//        $.each(user.streams, function(index, item) {
//            $("#twitch").append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2"> <img class="images-responsive img-fluid" src="'+item.preview.large+'"></img></div>');
              
//              <img class="images-responsive img-fluid" src="'+item.preview.large+'"></img>
//              '<iframe src="http://player.twitch.tv/?autoplay=false&channel='+item.channel.name+'" height="720" width="1280" frameborder="0"  scrolling="no" allowfullscreen="trues" autoplay="false"></iframe>'

          });
          $("#results").append("</div>");
        });
      });


      $('.twitch-connect').click(function() {
        Twitch.login({
          scope: ['user_read', 'channel_read']
        });
      });

      $('#logout button').click(function() {
        Twitch.logout();

        // Reload page and reset url hash. You shouldn't
        // need to do this.
        window.location = window.location.pathname
      })

      $('#get-name button').click(function() {
        Twitch.api({method: 'user'}, function(error, user) {
          $('#get-name input').val(user.display_name);
	var name = user.display_name;
	Twitch.api({method: '/users/'+name+'/follows/channels', verb:'GET'}, function(error, user){
		console.log(user);
	});
	
	Twitch.api({method: 'streams/followed'}, function(error, user){
		console.log(user);
		$("#results").append("<div>");
		$.each(user.streams, function(index, item) {
			$("#results").append('<div class="col-xs-12 col-sm-6 col-md-3"><img class="images-responsive img-fluid" src="'+item.preview.large+'"></img></div>');
//<!--'<iframe src="http://player.twitch.tv/?autoplay=false&channel='+item.channel.name+'" height="720" width="1280" frameborder="0"  scrolling="no" allowfullscreen="true" autoplay="false"></iframe>'-->

		});
		
		$("#results").append("</div>");
	});
	 });
      })


      $('#get-stream-key button').click(function() {
        Twitch.api({method: 'channel'}, function(error, channel) {
          $('#get-stream-key input').val(channel.stream_key);
        });
      })