async function LoadDefaultInfo() {
  //load json file
  const response = await fetch("/projectinfo.json");
  const json = await response.json();

  //first entry is the main entry for the page
  const keys = Object.keys(json);
  const main = json[keys[0]];

  //set all project info related elements
  attachEventListeners();
  setImageSources(getImageSources(json, keys));
  setTitle(main.title);
  setDescription(main.description);
  setSubTitle(main.subtitle);
  setDetailsList(main.detailslist);
}

async function onChangeInfo(element) {
  //load json file
  const response = await fetch("/projectinfo.json");
  const json = await response.json();

  //get main img element
  const mainImg = document.getElementById("projectinfo-img");

  //get their current data value
  const maindata = mainImg.dataset.project;
  const otherdata = element.dataset.project;

  //get the src values based on that
  const srcList = getImageSources(json, Object.keys(json));
  const srcArray = [];
  let mainSrc;
  let otherSrc;
  for (let i = 0; i < srcList.length; i++) {
    if (!srcList[i]) continue;
    if (srcList[i].key == maindata) {
      mainSrc = srcList[i];
    } else if (srcList[i].key == otherdata) {
      otherSrc = srcList[i];
    } else {
      srcArray.push(srcList[i]);
    }
  }
  srcArray.unshift(mainSrc);
  srcArray.unshift(otherSrc);

  const main = json[otherSrc.key];

  setImageSources(srcArray);
  setTitle(main.title);
  setDescription(main.description);
  setSubTitle(main.subtitle);
  setDetailsList(main.detailslist);
}

function attachEventListeners() {
  const otherImgs = document.getElementsByClassName("projectinfo-other");
  for (const img of otherImgs) {
    img.addEventListener("click", () => {
      onChangeInfo(img);
    });
  }
}

function getImageSources(json, keys) {
  let srcArray = [];

  if (!json || !keys) return srcArray;

  for (let i = 0; i < keys.length; i++) {
    const src = json[keys[i]].imgSrc;
    if (src) {
      srcArray.push({key: keys[i], imgSrc: src});
    }
  }

  return srcArray;
}

function setImageSources(srcArray) {
  if (srcArray.length == 0) return;

  const mainImg = document.getElementById("projectinfo-img");
  if (mainImg) {
    mainImg.dataset.project = srcArray[0].key;
    mainImg.src = srcArray[0].imgSrc;
  }

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