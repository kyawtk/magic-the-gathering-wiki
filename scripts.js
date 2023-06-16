window.addEventListener("load", requestServer);

async function requestServer() {
  try {
    let sets = await server.getSets();
    UI.createSelectSets(sets);
  } catch (error) {
    console.error(error);
  }
}

let UI = (function () {
  let container = document.querySelector(".cards-container");
    function changeBG(){

    }
  function displayCards(cards) {
    container.innerHTML = "";
    cards.forEach((card) => {
      let carddiv = document.createElement("div");
      carddiv.classList.add("card");
      let img = document.createElement("img");
      img.src = card.imageUrl;
      img.alt = card.name
        img.dataset.name = card.name 
        img.addEventListener('click',(e)=>{handleImgClick(e,card)})
      carddiv.appendChild(img);
      container.appendChild(carddiv);
    });
  }
  function handleImgClick(e,card){
console.log(e.target.dataset.name)


  }
  function createSelectSets(sets) {
    let usrInputArea = document.querySelector('.inputArea')
    let label = document.createElement("label");
    label.innerText = "Choose your Set:";
    label.setAttribute("for", "selectSets");

    let select = document.createElement("select");
    select.setAttribute("id", "selectSets");
    select.setAttribute("name", "selectSets");

    sets.forEach((set) => {
      let option = document.createElement("option");

      option.value = set.code;
      option.text = set.name;
      select.appendChild(option);
    });

    // Step 6: Add event listener to the select element
    select.addEventListener("change", handleSelect);

    async function handleSelect(event) {
        showLoader()
      // Event handling code

      let setCode = event.target.value;
      try {
         let cards = await server.getCards(setCode)
      console.log("Selected value: " + setCode);
      console.log(cards)
      UI.displayCards(cards)
      } catch (error) {
        console.error(error)
      }finally{
        hideLoader()
      }
     
    }
    function showLoader() {
        let loader = document.createElement("div");
        loader.innerHTML = '<h1> Loading..... </h1>'
        loader.classList.add("loader");
        document.body.appendChild(loader);
      }
    
      function hideLoader() {
        let loader = document.querySelector(".loader");
        if (loader) {
          loader.remove();
        }
      }

    label.appendChild(select);
    usrInputArea.prepend(label);
  }

  return {
    createSelectSets: createSelectSets,
    displayCards: displayCards,
  };
})();

let server = (function () {
  async function getCards(setCode = "2X2") {
    try {
      let url = `https://api.magicthegathering.io/v1/cards?set=${setCode}`;
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.status);
      }
      let jsonData = await response.json();
      return jsonData.cards;
    } catch (error) {
      console.error(error);
    }
  }

  async function getSets() {
    try {
      let url = "https://api.magicthegathering.io/v1/sets";
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.status);
      }
      let jsonData = await response.json();
      return jsonData.sets;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    getCards: getCards,
    getSets: getSets,
  };
})();
