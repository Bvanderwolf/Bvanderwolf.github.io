const gistURL = "https://api.github.com/users/Bvanderwolf/gists";
const embedURL = "https://gist.github.com/Bvanderwolf/";
const jsExt = ".js";
const maxGists = 5;
const projects = ["MathRecycler", "HubGames", "CMS", "BoatGame"];
const gistStoreKey = "gists";

async function StartGistHandlingASync(fromPage) {
  const gistHandler = new GistHandler();
  let projectGists = gistHandler.GetProjectGists(fromPage);

  if (projectGists.length == 0) {
    projectGists = await gistHandler.LoadGistsASync(fromPage);
    console.log("loading gists");
    if (projectGists.length == 0) {
      console.log("failed loading gists");
      return;
    }
  }

  const items = document.getElementsByClassName("carousel-item");
  if (items.length > maxGists) return;

  //for each carousel item, get card title, card text and script and set those with gist values
  for (let i = 0; i < items.length; i++) {
    const title = items[i].getElementsByClassName("card-title")[0];
    const description = items[i].getElementsByClassName("card-text")[0];
    await gistHandler.SetupHtmlElementsASync(title, description, projectGists[i]);
  }

  //add script tags with a source based on embedUrl + gistID + jsExt
}

class GistHandler {
  async LoadGistsASync(page) {
    //fetch git list from github api
    const response = await fetch(gistURL);
    const json = await response.json();
    if (!json) return [];

    //store item in local storage
    try {
      localStorage.setItem(gistStoreKey, JSON.stringify(json));
    } catch (error) {
      console.log("failed setting gist storage :: " + localStorage);
    }

    return this.GetProjectGists(page);
  }

  //returns filtered array with gists related to page
  GetProjectGists(page) {
    const a = [];
    //the page has to be a project page
    if (!projects.includes(page)) return a;

    //try getting stored value
    const item = localStorage.getItem(gistStoreKey);
    if (!item) {
      //return empty array when no item was found
      return a;
    }

    //loop through all gists and select maxGists ammount to show for project
    const allGists = JSON.parse(item);
    let count = 0;
    for (let i = 0; i < allGists.length; i++) {
      //get description and check if it has the necessary split char
      const description = allGists[i].description;
      if (!description.includes("|")) continue;

      //split the desciption to get the project and if related to page add it to return array
      const project = description.split("|")[0].trim();
      if (project == page && count != maxGists) {
        a.push(allGists[i]);
        count++; //makes sure only max_gists gets added to return array
      }
    }
    return a;
  }

  async SetupHtmlElementsASync(titleEl, descriptionEl, projectGist) {
    if (!projectGist) return;
    if (titleEl) {
      const filename = Object.values(projectGist.files)[0].filename;
      const title = filename.split(".")[0].concat(" Class");
      titleEl.innerText = title;
    }

    if (descriptionEl) {
      const desciption = projectGist.description.split("|")[1].trim();
      descriptionEl.innerText = desciption;
    }
  }
}
