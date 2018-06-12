$(document).ready(function () {

    $("#addArtist").on("click", function searchArtist() {
        console.log("Hi");

        event.preventDefault()

        $("#article-table").empty();

        var q = $("#artist-input").val();

        console.log(q);

        var url = 'https://newsapi.org/v2/everything?sources=mtv-news,buzzfeed,entertainment-weekly,mashable,the-lad-bible,the-huffington-post,mirror&language=en&q=' + q + '&sortBy=publishedAt&pageSize=5&apiKey=f585602033364272b3a51389129301fc';

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
    });

}); 