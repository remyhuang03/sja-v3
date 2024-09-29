// a ul element
const newsList = document.querySelector('.news-wrapper ul');

function append_news(news) {
    newsList.innerHTML += `
        <li>
            <a href="/news/index.php?a=${news["article"]}">
                <article class="news">
                    <h2>${news["title"]}</h2>
                    <p>${news["description"]}</p>
                </article>
            </a>
        </li>
    `
}

//get the news list
fetch("/news/news-info.json").then(response => response.json()).then(data => {
    //render news
    data.forEach(news => {
        append_news(news);
    });
});



