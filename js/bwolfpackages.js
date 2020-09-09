const baseUrl = "https://api.github.com/repos/bvanderwolf/BWolfPackages/contents/";
const subtractString = "https://github.com/Bvanderwolf/BWolfPackages/tree/master";
const root = document.getElementById("packages");
const converter = new showdown.Converter();
converter.setFlavor('github');

fetch(baseUrl + "README.md").then(res => {
    res.json().then(json => {
        const readme = atob(json.content);
        const doc = new DOMParser().parseFromString(converter.makeHtml(readme), "text/html");
        for (let link of doc.getElementsByTagName("a")) {
            const path = link.href.substring(subtractString.length);
            fetch(baseUrl + path + "/README.md")
                .then(res => res.json()
                    .then(json => {
                        CreatePackageCardFromContent(json);
                    }));
        }

    })
});

function CreatePackageCardFromContent(json) {
    const text = atob(json.content);
    const card = CreateCard();

    let html = converter.makeHtml(text);
    let headerHtml = html.split("\n", 1)[0];
    headerHtml = ReplaceTag(headerHtml, "h1", "h3");
    card.header.innerHTML = headerHtml;

    html = html.substring(headerHtml.length);
    card.body.innerHTML = html;

    for (let head of card.body.getElementsByTagName("h2")) {
        head.appendChild(document.createElement("hr"));
    }
}


function CreateCard() {
    const card = document.createElement("div");
    card.className = "card package-text mb-5";

    const _header = document.createElement("div");
    _header.className = "card-header text-center";

    const _body = document.createElement("div");
    _body.className = "card-body ml-2";

    root.appendChild(card);
    card.appendChild(_header);
    card.appendChild(_body);

    return { header: _header, body: _body };
}



function ReplaceTag(element, oldtag, newtag) {
    element = element.replace(oldtag, newtag);
    element = element.replace(`/${oldtag}`, `/${newtag}`);
    return element;
}

