$(document).ready(function () {
    var OAuthToken;
    var album_id
    var track_url;
    var artist;
    var artist_picture;

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC4Lopxflier0eeNKxefS9lRT14Cidv92E",
        authDomain: "chlauper-52373.firebaseapp.com",
        databaseURL: "https://chlauper-52373.firebaseio.com",
        projectId: "chlauper-52373",
        storageBucket: "",
        messagingSenderId: "254415066304"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val().artist);
        var artist_history_entry = $("<div>").text(snapshot.val().artist).addClass("artist-entry")
        $(".artist-history").append(artist_history_entry);
    })

    $(".history-button").on("click", function (response) {
        response.preventDefault();
        $(".artist-history").toggle();
    })

    $(".clear-history-button").on("click", function(response){
        response.preventDefault();
        database.ref().set({
            artist: null
        })
        $(".artist-history").remove();
    })

    $(".artist-search-button").on("click", function (response) {
        response.preventDefault();
        $(".artist-profile").empty();
        var slider = $("<div>").addClass("slider");
        $(".artist-profile").append(slider);
        artist = $(".artist-search-input").val();
        var databaseVal = {
            artist: artist
        }
        database.ref().push(databaseVal);
        // ajaxInstagram(artist);
        ajaxToken();
        newsApi();

    })

    function newsApi() {
        $("#article-table").empty();

        var url = 'https://newsapi.org/v2/everything?sources=mtv-news,buzzfeed,entertainment-weekly,mashable,the-lad-bible,the-huffington-post,mirror&language=en&q=' + artist + '&sortBy=publishedAt&pageSize=5&apiKey=f585602033364272b3a51389129301fc';

        var response = new Request(url);

        $.ajax({ url: url, method: "GET" })

            .done(function (response) {

                console.log(response);


                for (var i = 0; i < response.articles.length; i++) {

                    var linkTo = Object.values(response.articles[i])[4];

                    var headline = $("<th>");

                    headline.addClass("linked");

                    $("#linked").append(linkTo);

                    console.log(linkTo);

                    headline.append(response.articles[i].title);

                    headline.text(response.articles[i].title);

                    console.log(response.articles[i].title);

                    var describe = $("<td>");

                    describe.text(response.articles[i].description);

                    console.log(response.articles[i].description);

                    var imgUrl = Object.values(response.articles[i])[5];

                    $("<img>").append(imgUrl);

                    console.log(imgUrl);

                    var articleImg = $("<img>");

                    articleImg.attr("src", imgUrl);

                    articleImg.appendTo(articleDiv);

                    $("#displayArticle").append(articleImg);

                    var articleDiv = $("<div>");

                    console.log();

                    articleDiv.append(headline);
                    articleDiv.append(articleImg);
                    $("#article-table").append("<tr><th>" + response.articles[i].title + "</th></tr>" + "<tr><td>" + "<img src=" + Object.values(response.articles[i])[5] + "></img>" + "</td></tr>" + "<tr><td>" + response.articles[i].description + "</td></tr>")


                    $("form").trigger("reset");

                }
            });
    }

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
            artist_id = response.artists.items[0].id;
            artist_picture = response.artists.items[0].images[0].url
            console.log(artist_picture = response.artists.items[0].images[0].url)
            var image_element = $("<img>");
            image_element.attr("src", artist_picture);
            image_element.attr("height", "400");
            var nested_img_element = $("<div>").append(image_element);
            $(".slider").append(nested_img_element);
            ajaxAlbumList(OAuthToken, artist_id);
            ajaxTopTrack(OAuthToken, artist_id);
        });

    }

    function ajaxAlbumList(token, artist) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/artists/" + artist + "/albums?market=US",
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + token
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response.items);
            var albumNameArr = [];
            for (var i = 0; i < response.items.length; i++) {
                if (!albumNameArr.includes(response.items[i].name)) {
                    var album_img = response.items[i].images[0].url;
                    insert_album(album_img);
                    albumNameArr.push(response.items[i].name);
                }
            }
            console.log(albumNameArr.includes("Revival"));
            initiateBxSlider();
        })
    }

    function ajaxTopTrack(token, artistId) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?country=US",
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + token
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            for (var i = 0; i < response.tracks.length; i++) {
                if (response.tracks[i].album.album_type === "album") {
                    album_id = response.tracks[i].album.id;
                    var album_img = response.tracks[i].album.images[0].url;
                    break
                }
            }
            album_url = "https://open.spotify.com/embed/album/" + album_id;
            $("#iframe-play").attr("src", album_url);
        });
    }

    function insert_album(album_img) {
        var image_element = $("<img>");
        image_element.attr("src", album_img);
        image_element.attr("height", "400");
        var nested_img_element = $("<div>").append(image_element);
        $(".slider").append(nested_img_element);
    }

    function initiateBxSlider() {
        $('.slider').bxSlider({
            auto: true,
            autoStart: true,
            mode: "horizontal",
            slideWidth: 420,
            adaptiveHeight: true
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


    // function ajaxInstagram(artist){
    //     var settings = {
    //         "async": true,
    //         "crossDomain": true,
    //         "url": "https://www.instagram.com/explore/tags/" + artist + "/?__a=1",
    //         "method": "GET",
    //         "headers": {
    //         }
    //     }

    //     $.ajax(settings).done(function (response) {
    //         $(".containerInstagram").empty();
    //         console.log(response);
    //         for (var i = 0; i < response.graphql.hashtag.edge_hashtag_to_top_posts.edges.length; i++){
    //             console.log(response.graphql.hashtag.edge_hashtag_to_top_posts.edges[i].node.display_url);
    //             var url = response.graphql.hashtag.edge_hashtag_to_top_posts.edges[i].node.display_url;
    //             var image_element = $("<img>");
    //             image_element.attr("src", url);
    //             image_element.attr("height", "250");
    //             $(".containerInstagram").append(image_element);
    //         }
    //     });
    // }



})





