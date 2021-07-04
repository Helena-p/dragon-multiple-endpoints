const app = document.querySelector("#app");
const endpointArticles = "https://vanillajsacademy.com/api/dragons.json";
const endpointAuthors = "https://vanillajsacademy.com/api/dragons-authors.json";

/**
 * Sanitize and encode all HTML in a user-submitted string
 * https://portswigger.net/web-security/cross-site-scripting/preventing
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
function sanitizeHTML(str) {
    return str
        .replace(/javascript:/gi, "")
        .replace(/[^\w-_. ]/gi, function (c) {
            return `&#${c.charCodeAt(0)};`;
        });
}

/**
 * Find the first matching author
 * @param  {String} name    The author name
 * @param  {Array}  authors The author details
 * @return {Array}          The author
 */
function getAuthor(name, authors) {
    return authors.find(function (author) {
        return author.author === name;
    });
}

/**
 * Render articles into the DOM
 * @param  {Array} articles The articles to render
 * @param  {Array} authors  The author details
 */
const displayData = (articles, authors) => {
    if (!articles || articles.length < 1) {
        throw "Cannot find articles at this time";
    }

    app.innerHTML = articles
        .map((article) => {
            let author = getAuthor(article.author, authors);
            return ` 
        <div class="article-container">
          <div class="article-container__box">
            <h2 class="header-secondary"><a href="${sanitizeHTML(
                article.url
            )}">${sanitizeHTML(article.title)}</a></h2>
            <h3 class="header-tertiary">By ${
                author
                    ? `${sanitizeHTML(author.author)} - ${sanitizeHTML(
                          author.bio
                      )}`
                    : sanitizeHTML(article.author)
            }</h3>
            <p class="paragraph">${sanitizeHTML(article.article)}</p>
            <p class="paragraph"><small>${sanitizeHTML(
                article.pubdate
            )}</small></p>
          </div>     
        </div>`;
        })
        .join(" ");
};

const getArticles = () => {
    Promise.all([fetch(endpointArticles), fetch(endpointAuthors)])
        .then((responses) => {
            // Iteration over the api array and calling the json method on each of them
            return Promise.all(responses.map((response) => response.json()));
        })
        .then((data) => {
            displayData(data[0].articles, data[1].authors);
        })
        .catch((error) => {
            app.innerHTML =
                "There have been an error. Please refresh page or try again later.";
            console.warn(error);
        });
};

getArticles();
