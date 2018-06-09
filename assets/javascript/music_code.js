$(document).ready(function () {
    var OAuthToken;
    var album_id
    var track_url;
    var artist;


    $(".artist-search-button").on("click", function (response) {
        response.preventDefault();
        artist = $(".artist-search-input").val();
        ajaxInstagram(artist);
        // ajaxToken();
    })

    function ajaxToken() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token",
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic MjNmZWQ0ZDk5M2M4NDNkZGJmODUwMDYyNTc1NWEzYTc6N2M4ZTE1NmNhMGJhNGUzNjliYTQwM2ZiNDVlNjBmNjI="
            },
            "data": {
                "grant_type": "client_credentials"
            }
        }

        $.ajax(settings).then(function (response) {
            console.log(response);
            console.log(response.access_token);
            OAuthToken = response.access_token;
            ajaxSearchAlbum(OAuthToken, artist);
        });
    }

    function ajaxSearchAlbum(token, artist) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?query=" + artist + "&offset=0&limit=20&type=artist",
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + token
            }
        }

        $.ajax(settings).then(function (response) {
            console.log(response);
            console.log(response.artists.items[0].id)
            album_id = response.artists.items[0].id;
            ajaxTopTrack(OAuthToken, album_id);
        });

    }

    function ajaxTopTrack(token, albumId) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/artists/" + albumId + "/top-tracks?country=US",
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + token
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            console.log(response.tracks[0].preview_url);
            album_id = response.tracks[0].album.id;
            album_url = "https://open.spotify.com/embed/album/" + album_id;
            $("#iframe-play").attr("src", album_url);
        });
    }

    // var videoId;

    // var settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": "https://cors-anywhere.herokuapp.com/https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + artist + "&order=viewCount&regionCode=us&type=video&videoSyndicated=true&videoCategoryId=10&=&videoCaption=closedCaption&key=AIzaSyAB0_d8yri4L92KMqlXoR_NHTyhCJh6Zqs&null=",
    //     "method": "GET",
    //     "headers": {
    //       "Cache-Control": "no-cache",
    //       "Postman-Token": "dba79417-af5d-4ac5-8410-7cfd7e1379ee"
    //     }
    //   }

    //   $.ajax(settings).done(function (response) {
    //     console.log(response.items[0].id.videoId);
    //     videoId = response.items[0].id.videoId;
    //     $(".video").append('<iframe id="existing-iframe-example" scrolling="no" width="640" height="360" src="http://youtubeonrepeat.com/watch/?v=' + videoId +'" frameborder="0" style="border: solid 4px #37474F"></iframe>')
    //   });


    function ajaxInstagram(artist){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://www.instagram.com/explore/tags/" + artist + "/?__a=1",
            "method": "GET",
            "headers": {
            }
        }
    
        $.ajax(settings).done(function (response) {
            $(".containerInstagram").empty();
            console.log(response);
            for (var i = 0; i < response.graphql.hashtag.edge_hashtag_to_top_posts.edges.length; i++){
                console.log(response.graphql.hashtag.edge_hashtag_to_top_posts.edges[i].node.display_url);
                var url = response.graphql.hashtag.edge_hashtag_to_top_posts.edges[i].node.display_url;
                var image_element = $("<img>");
                image_element.attr("src", url);
                image_element.attr("height", "250");
                $(".containerInstagram").append(image_element);
            }
        });
    }



})





