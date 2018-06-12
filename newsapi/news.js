$(document).ready(function(){

    $("#addArtist").on("click", function(){
        console.log("Hi");

        event.preventDefault() 

        var q = $("#artist-input").val();
        
        var url = 'https://newsapi.org/v2/everything?sources=mtv-news,buzzfeed,entertainment-weekly&language=en&q='+ q + '&sortBy=popularity&pageSize=5&apiKey=f585602033364272b3a51389129301fc';

        var response = new Request(url);

        $.ajax({url: url, method: "GET"})

        .done(function(response){

        console.log(response);

        
        for (var i = 0; i < response.articles.length; i++){

            var headline = $("<th>").prepend(response.articles[i].title);
            headline.text(response.articles[i].title);

            var describe = $("<td>");
            describe.text(response.articles[i].description);

            console.log(response.articles[i].description);

            var imgUrl = Object.values(response.articles[i])[5]; 

            $("<img>").prepend(imgUrl);

            console.log(imgUrl);

            var articleImg = $("<img>");

            articleImg.attr("src", imgUrl);

            articleImg.appendTo(articleDiv);

            $("#displayArticle").prepend(articleImg);

            var articleDiv = $("<div>");

            console.log();

            articleDiv.prepend(headline);
            articleDiv.prepend(articleImg);
            $("#article-table tbody").prepend("<tr><th>" + response.articles[i].title + "</th></tr>" + "<tr><td>" + "<img src=" + Object.values(response.articles[i])[5] + "></img>" + "</td></tr>" + "<tr><td>" + response.articles[i].description + "</td></tr>" )
        
            }
        });

    });
}); 