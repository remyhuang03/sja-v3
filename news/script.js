/**** render markdown article ****/
let converter = new showdown.Converter({tables:true});
// article_md defined in news index page
const article_html = converter.makeHtml(article_md);
document.getElementById("article").innerHTML = article_html;


/***** set tab title ****/
let title = document.getElementsByTagName("h1")[0].innerHTML;
document.title = title;
