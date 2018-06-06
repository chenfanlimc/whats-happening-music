$(document).ready(function () {
    var OAuthToken;
    var album_id
    var track_url;
    var artist = "beyonce";

    ajaxToken();

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
            track_url = response.tracks[0].preview_url;
            // window.open(track_url, "insert_name_of_iframe_element");
            window.open(track_url);
        });
    }

})


