async function LoadDefaultInfo() {
  //load json file
  const response = await fetch("/projectinfo.json");
  const json = await response.json();

  //get default entry or first
  const dft = json["mathrecycler"];

  //get child elements
  const img = document.getElementById("projectinfo-img");
  const title = document.getElementById("projectinfo-title");
  const description = document.getElementById("projectinfo-description");
  const subtitle = document.getElementById("projectinfo-subtitle");
  const detailslist = document.getElementById("projectinfo-detailslist");

  //assign values from json to elements
  img.src = dft.imgSrc;
  title.innerText = dft.title;
  description.innerText = dft.description;
  subtitle.innerText = dft.subtitle;

  const ls = dft["detailslist"];
  for (let i = 0; i < ls.length; i++) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(ls[i]));
    detailslist.appendChild(li);
  }
}

//Important! do checks on json values
//make const for default value
//split code more into functions
//add more projects
