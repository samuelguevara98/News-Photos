
let article_info = {};
let article_data = [];

$(document).ready(function(){

    $("#loader").hide();

    //favorites save confirmation:
    $('.modal').modal();

    $("form").on('submit', function(event){
        event.preventDefault();
        let query = $("#keywords").val();
        /* Isuses with spaces in the query, fixed with this code. */
        let remove_space = query.replace(/ /g,'-'); 
        /* URL DATE NEEDS TO BE UPDATED, KEY LETS DATA RETRIEVE FROM A MONTH AGO */
        let url = `https://newsapi.org/v2/everything?q=${remove_space}&from=2020-04-04&to=2020-04-04&sortBy=popularity&apiKey=a75938fbed57442696e756c8b556a3e8`;
        if (query !== ""){
            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                beforeSend: function(){
                    $("#loader").show();
                  },
                  complete: function(){
                    $("#loader").hide();
                },
                success: function(news){
                    let output = "";
                    let latestNews = news.articles;
                    //check if there is any search results, if not, add a container:
                    if ( $('#newsResults').children().length === 0 ) {
                        $('#newsResults').append('<div class="row">' +
                                                            '<div class="section">' +
                                                                '<div id="place-cards">' +
                                                                '</div>' +
                                                            '</div>' +
                                                          '</div>');
                    }

                    for(var x in latestNews){

                        addArticleData(latestNews[x].publishedAt, latestNews[x].title, latestNews[x].urlToImage, latestNews[x].url, latestNews[x].description, latestNews[x].author, latestNews[x].source.name);

                    output +=`
                        <div class="col xl3 l4 m6 s12 article_search_result">
                          <div class="card">
                            <div class="card-image">
                              <img src="${latestNews[x].urlToImage}">
                            </div>
                            <div class="card-content">
                                <a href="${latestNews[x].url}" target="_blank"><h5 class="card-title">${latestNews[x].title}</h5></a>
                                <p>${latestNews[x].description}</p>
                                <p><strong>By:</strong><a href="${latestNews[x].author}"></a>, ${latestNews[x].source.name}<p>
                                <a name="${latestNews[x].publishedAt}" onclick="addFavorite(name)" href="#modal1" class="btn waves-effect waves-light blue darken-3 modal-trigger">Add<i class="material-icons right">thumb_up</i></a>
                            </div>
                          </div>
                        </div>`;
                       
                    }
                    if(output !== ""){
                        $("#place-cards").html(output);
                    }else{
                        /* ADD newsResults to search_form.html */;
                        $("#place-cards").html("<div style='font-size:40px; text-align:center;'><font color='red'>No news results were found for - "+query+" -</font></div><br><br>");
                    }
                },
                error: function(){
                    console.log("error");
                }
            })
        }else{
            console.log("Please enter something");
        }
    });
});

function addArticleData(id, title, image, url, description, author, source) {

    article_info = {};

    article_info["article_time_stamp"] = id;
    article_info["article_title"] = title;
    article_info["article_image"] = image;
    article_info["article_url"] = url;
    article_info["article_description"] = description;
    article_info["article_author"] = author;
    article_info["article_source"] = source;

    article_data.push(article_info);

}

function addFavorite(id) {

    //find place id:

    $.each(article_data, function(index, article) {

        if (id === article.article_time_stamp) {

            //set sessionStorage:
            article = JSON.stringify(article);
            sessionStorage.setItem(id, article);

        }

    });
}