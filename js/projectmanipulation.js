const projectsStoreKey = "projects";

async function LoadDefaultInfo() {
  //load json file
  const json = await GetProjectInfo();

  if (!json) return;
  //first entry is the main entry for the page
  const keys = Object.keys(json);
  const main = json[keys[0]];

  //set all project info related elements
  addEventListeners();
  setImageSources(getImageSources(json, keys));
  setTitle(main.title);
  setDescription(main.description);
  setSubTitle(main.subtitle);
  setDetailsList(main.detailslist);
}

async function onChangeInfo(element) {
  if (!element || !element.dataset.project) return;

  const response = await fetch("/projectinfo.json");
  const json = await response.json();

  if (!json) return;

  const newMainData = element.dataset.project;

  const srcArray = getShiftedSources(getImageSources(json, Object.keys(json)), newMainData);
  const main = json[srcArray[0].key];

  setImageSources(srcArray);
  setTitle(main.title);
  setDescription(main.description);
  setSubTitle(main.subtitle);
  setDetailsList(main.detailslist);
}

async function GetProjectInfo() {
  //get json string from local storage
  let json = localStorage.getItem(projectsStoreKey);
  if (!json) {
    //if json is not in storage get in from files and set it as json string
    json = await fetch("/projectinfo.json").then(response => response.json());
    localStorage.setItem(projectsStoreKey, JSON.stringify(json));
  }
  else {
    //if json is in storage parse is for usage in project manipulation
    json = JSON.parse(json);
  }

  return json;
}

function addEventListeners() {
  const otherImgs = document.getElementsByClassName("projectinfo-other");
  if (!otherImgs) return;

  for (const img of otherImgs) {
    img.addEventListener("click", () => {
      onChangeInfo(img);
    });
  }
}

function getShiftedSources(original, newmain_key) {
  const srcArray = [];
  if (!original || !newmain_key) return srcArray;

  let newMain;
  //store new main object and add others to list
  for (let i = 0; i < original.length; i++) {
    if (!original[i]) continue;
    if (original[i].key == newmain_key) {
      newMain = original[i];
    } else {
      srcArray.push(original[i]);
    }
  }
  //make sure the new main is the first element in the array
  srcArray.unshift(newMain);
  return srcArray;
}

function getImageSources(json, keys) {
  let srcArray = [];

  if (!json || !keys) return srcArray;
  //add key value objects to src array if the sources is valid
  for (let i = 0; i < keys.length; i++) {
    const src = json[keys[i]].imgSrc;
    const githubLink = json[keys[i]].githubLink;
    if (src) {
      srcArray.push({ key: keys[i], imgSrc: src, link: githubLink });
    }
  }

  return srcArray;
}

function setImageSources(srcArray) {
  if (srcArray.length == 0) return;
  //set main img src and project dateset
  const mainImg = document.getElementById("projectinfo-img");
  if (mainImg) {
    mainImg.dataset.project = srcArray[0].key;
    mainImg.src = srcArray[0].imgSrc;
    mainImg.parentElement.href = srcArray[0].link;
  }

  //set other project image sources and project datasets if there are any
  if (srcArray.length == 1) return;
  const otherImgs = document.getElementsByClassName("projectinfo-other");
  for (let srci = 1, imgi = 0; srci < srcArray.length; srci++, imgi++) {
    if (otherImgs[imgi] && srcArray[srci]) {
      otherImgs[imgi].dataset.project = srcArray[srci].key;
      otherImgs[imgi].src = srcArray[srci].imgSrc;
    }
  }
}

function setTitle(title) {
  if (!title) return;

  const el = document.getElementById("projectinfo-title");
  if (el) {
    el.innerText = title;
  }
}

function setDescription(description) {
  if (!description) return;

  const el = document.getElementById("projectinfo-description");
  if (el) {
    el.innerText = description;
  }
}

function setSubTitle(subtitle) {
  if (!subtitle) return;

  const el = document.getElementById("projectinfo-subtitle");
  if (el) {
    el.innerText = subtitle;
  }
}

function setDetailsList(ls) {
  if (!ls) return;

  const ulElement = document.getElementById("projectinfo-detailslist");
  if (!ulElement) return;

  //remove current children if it has any
  if (ulElement.hasChildNodes()) {
    while (ulElement.firstChild) {
      ulElement.removeChild(ulElement.lastChild);
    }
  }

  //if list and element are truthy, add truthy values from list to element as li elements
  for (let i = 0; i < ls.length; i++) {
    if (ls[i]) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(ls[i]));
      ulElement.appendChild(li);
    }
  }
}
