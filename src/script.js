const app = document.querySelector("#app");
const endpointArticles = "https://vanillajsacademy.com/api/dragons.json";
const endpointAuthors = "https://vanillajsacademy.com/api/dragons-authors.json";

/**
 * Sanitize and encode all HTML in a user-submitted string
 * https://portswigger.net/web-security/cross-site-scripting/preventing
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
const sanitizeHTML = (str) => {
    return str
        .replace(/javascript:/gi, "")
        .replace(/[^\w-_. ]/gi, function (c) {
            return `&#${c.charCodeAt(0)};`;
        });
};

const getAuthor = (name, authors) => {
    return authors.find((author) => author.author === name);
};

const displayData = (articles, authors) => {
    if (!articles || articles.length < 1) {
        throw new Error(error);
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

const errorHandler = (error) => {
    console.error(error);
    app.innerHTML = `
        <p class='error-message'>No articles found at this point. 
        Please refresh page or try again later.</p>
        `;
};

const getArticles = () => {
    Promise.all([fetch(endpointArticles), fetch(endpointAuthors)])
        .then((responses) =>
            Promise.all(
                responses.map((response) => {
                    if (!response.ok) throw new Error(error);
                    return response.json();
                })
            )
        )
        .then((data) => displayData(data[0].articles, data[1].authors))
        .catch((error) => errorHandler(error));
};

getArticles();
