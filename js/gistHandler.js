const gistURL = "https://api.github.com/users/Bvanderwolf/gists";
const embedURL = "https://gist.github.com/Bvanderwolf/";
const jsExt = ".js";
const max_gists = 5;

function Start(fromPage) {
  window.gistLoader = new GistLoader(fromPage);
}

class GistLoader {
  constructor(page) {
    this.LoadGists(page);
  }

  async LoadGists(page) {
    //fetch git list from github api
    const response = await fetch(gistURL);
    const json = await response.json();

    console.log(json);
    console.log(page);

    //get max_gists ammount om gists related to the page this script was loaded in

    //get the card bodies inside the carousel

    //add script tags with a source based on embedUrl + gistID + jsExt
  }
}
