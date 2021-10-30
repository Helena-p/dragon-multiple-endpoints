import { cleanHTML } from "./sanitizer.js";

const app = document.querySelector(".app");
const endpointArticles = "https://vanillajsacademy.com/api/dragons.json";
const endpointBio = "https://vanillajsacademy.com/api/dragons-authors.json";

const responseHandler = (responses) => {
    return Promise.all(
        responses.map((response) => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
    );
};

function findAuthor(person, authors) {
    return authors.find((author) => author.author === person);
}

const errorHandler = (error) => {
    app.textContent = `${error}, No articles available at this time`;
};

const renderArticles = (data) => {
    let { articles, authors } = { ...data[0], ...data[1] };

    if (!articles || !articles.length) errorHandler();

    let htmlString = `
    ${articles
        .map((article) => {
            let bio = findAuthor(article.author, authors).bio;

            return `
            <h2 class="spacer">
                <a href=${article.url}>${article.title}</a>
            </h2>
                <p class="author">By ${article.author}</p>   
                <p class="bio">${bio}</p>
                <p>${article.article}</p>
                <small>${article.pubdate}</small>`;
        })
        .join("")}
                `;

    app.innerHTML = cleanHTML(htmlString);
};

const getArticles = async () => {
    try {
        const responses = await Promise.all([
            fetch(endpointArticles),
            fetch(endpointBio),
        ]);
        const data = await responseHandler(responses);
        const renderData = renderArticles(data);
        return renderData;
    } catch (error) {
        errorHandler(error);
        console.error(error);
    }
};

getArticles();
