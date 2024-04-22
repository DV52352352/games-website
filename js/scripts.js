menuToggler.addEventListener('click', ev => {
    menu.classList.toggle('open');
    menuToggler.textContent = menuToggler.textContent === "×" ? "≡" : "×";
  });

let pageSize = 12;
let currentPage;
let objectIDs;
  
async function loadObject(id) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
  const response = await fetch(url);
  return response.json();
}