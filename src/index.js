const button = document.querySelector("#search");

button.addEventListener("click", function(e) {
  const city = document.querySelector("#city").value;

  if (!city) {
    document.querySelector("#error").classList.remove("hidden");
    return;
  } else {
    document.querySelector("#error").classList.add("hidden");
    button.classList.add("cursor-wait");
    grabMeteo(city).then(insertMeteo);
  }
});

function grabMeteo(city) {
  return fetch(
    "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=metric&cnt=19&lang=fr&appid=9a58d9d9ad44dab2e87ee23c3a987260"
  ) // On fait notre appel
    .then(res => res.json()); // Le resultat sera certainement en json donc nous le convertissons
}

function insertMeteo(meteoArray) {
  console.log(meteoArray);

  if (meteoArray["message"] === "city not found") {
    document.querySelector("#error").classList.remove("hidden");
    button.classList.remove("cursor-wait");
    return;
  }

  //tableau des différents id correspondant à la méteo de chaque jour à la même heure
  const tabId = [0, 8, 16];

  //prototype d'objet
  const objMeteo = {
    id: " ",
    city: " ",
    main: " ",
    description: " ",
    temp: " ",
    feel: " ",
    icon: " ",
    wind: " ",
    humidity: " ",
    cloud: " ",
    hour: " "
  };

  //jour 1
  const meteo1 = Object.create(objMeteo);

  //jour 2
  const meteo2 = Object.create(objMeteo);

  //jour 3
  const meteo3 = Object.create(objMeteo);

  //tableau des météos des 3 jours
  const tabMeteo = [meteo1, meteo2, meteo3];

  //remplir les données pour chaque jour
  for (let i = 0; i < tabMeteo.length; i++) {
    tabMeteo[i]["id"] = i;
    tabMeteo[i]["city"] =
      meteoArray["city"]["name"] + ", " + meteoArray["city"]["country"];
    tabMeteo[i]["main"] = meteoArray["list"][tabId[i]]["weather"][0]["main"];
    tabMeteo[i]["description"] =
      meteoArray["list"][tabId[i]]["weather"][0]["description"];
    tabMeteo[i]["temp"] = meteoArray["list"][tabId[i]]["main"]["temp"] + "°";
    tabMeteo[i]["feel"] =
      meteoArray["list"][tabId[i]]["main"]["feels_like"] + "°";
    tabMeteo[i]["icon"] =
      "src/img/" + meteoArray["list"][tabId[i]]["weather"][0]["icon"] + ".png";
    tabMeteo[i]["wind"] =
      meteoArray["list"][tabId[i]]["wind"]["speed"] + " m/s";
    tabMeteo[i]["humidity"] =
      meteoArray["list"][tabId[i]]["main"]["humidity"] + " %";
    tabMeteo[i]["cloud"] = meteoArray["list"][tabId[i]]["clouds"]["all"] + " %";
    tabMeteo[i]["hour"] = meteoArray["list"][tabId[i]]["dt_txt"];
  }

  const slides = tabMeteo.map(item => {
    return createSlide(
      item["city"],
      item["hour"],
      item["temp"],
      item["feel"],
      item["main"],
      item["description"],
      item["icon"],
      item["cloud"],
      item["wind"],
      item["humidity"]
    );
  });

  const navs = tabMeteo.map(item => {
    return createNav(item["id"], item["temp"], item["feel"], item["icon"]);
  });

  if (document.querySelector("#slider-for"))
    document.querySelector("#slider-for").remove();
  if (document.querySelector("#slider-nav"))
    document.querySelector("#slider-nav").remove();

  const slickElement = document.createElement("div");
  slickElement.id = "slider-for";
  slides.forEach(item => slickElement.appendChild(item));

  const slickNav = document.createElement("div");
  slickNav.id = "slider-nav";
  slickNav.className = "mx-4 md:mx-12 text-white my-2 md:my-4 text-center";
  navs.forEach(item => slickNav.appendChild(item));

  document.querySelector("#slider-container").appendChild(slickElement);
  document.querySelector("#slider-container").appendChild(slickNav);

  //Affichage
  $("#slider-for").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    swipe: false,
    asNavFor: "#slider-nav"
  });
  $("#slider-nav").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: "#slider-for",
    dots: false,
    centerMode: false,
    focusOnSelect: true
  });

  document.querySelector("#bienvenue").classList.add("hidden");
  button.classList.remove("cursor-wait");
}

//---------------------------------------------------------------------//
//template slide
function createSlide(
  city,
  hour,
  temp,
  feel,
  main,
  description,
  icon,
  cloud,
  wind,
  humidity
) {
  const app = document.createElement("div");
  app.className = "text-center mx-3 md-8";
  const box = document.createElement("div");
  box.className =
    "flex flex-col md:flex-row md:justify-between items-center mx-6 md:mx-12 my-4 p-6 md:p-12 shadow";

  //background color
  if (main === "Clear") {
    box.style.backgroundColor = "#FBD38D";
    app.style.backgroundColor = "#FEEBC8";
  } else if (main === "Thunderstorm") {
    app.style.backgroundColor = "#718096";
    box.style.backgroundColor = "#A0AEC0";
  } else if (main === "Rain" || main === "Drizzle") {
    box.style.backgroundColor = "#A0AEC0";
    app.style.backgroundColor = "#CBD5E0";
  } else if (main === "Snow") {
    app.style.backgroundColor = "#EBF8FF";
    box.style.backgroundColor = "#BEE3F8";
  } else if (main === "Clouds") {
    box.style.backgroundColor = "#CBD5E0";
    app.style.backgroundColor = "#E2E8F0";
  }

  const weatherDiv = document.createElement("div");
  weatherDiv.className = "flex flex-col items-start text-white";

  //ville
  const cityDiv = document.createElement("div");
  cityDiv.innerHTML = city;
  cityDiv.className = "text-xl md:text-2xl";

  //heure
  const hourDiv = document.createElement("P");
  hourDiv.innerHTML = hour;

  const weatherDiv2 = document.createElement("div");
  weatherDiv2.className = "flex flex-col items-end";

  const weatherDiv3 = document.createElement("div");
  weatherDiv3.className =
    "flex flex-row items-center justify-center mt-2 md:pr-12";

  const weatherDiv4 = document.createElement("div");
  weatherDiv4.className =
    "flex flex-col items-end w-48 pr-4 md:pr-6 pb-2 border-r-2 border-white";

  //température
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = temp;
  tempDiv.className = "text-4xl md:text-6xl flex flex-row";

  //température ressentie
  const feelDiv = document.createElement("div");
  feelDiv.innerHTML = feel;
  feelDiv.className = "md:text-lg";

  //icon
  const iconImg = document.createElement("img");
  iconImg.src = icon;
  iconImg.alt = "Icon Meteo";
  iconImg.className = "ml-16 md:ml-4 w-32 h-32 object-contain animated fadeIn";

  //decription météo
  const descriptionDiv = document.createElement("div");
  descriptionDiv.innerHTML = description;
  descriptionDiv.className =
    "font-bold text-2xl md:text-4xl capitalize text-teal-500 md:mt-4";

  const detailDiv = document.createElement("div");
  detailDiv.className =
    "flex flex-row md:flex-col items-start justify-end mx-6 mt-4 md:mt-0 text-gray-800";

  //nuage
  const cloudDiv = document.createElement("div");
  cloudDiv.className =
    "flex flex-col md:flex-row py-2 w-24 md:w-full border-r-2 md:border-b-2 md:border-r-0 border-white";

  const cloudH = document.createElement("P");
  cloudH.className = "mr-2";
  cloudH.innerHTML = "Nuage";

  const cloudSpan = document.createElement("span");
  cloudSpan.className = "hidden md:inline-flex md:mx-2";
  cloudSpan.innerHTML = " : ";

  const cloudH2 = document.createElement("P");
  cloudH.className = "font-semibold";
  cloudH2.innerHTML = cloud;

  //vent
  const windDiv = document.createElement("div");
  windDiv.className =
    "flex flex-col md:flex-row py-2 w-24 md:w-full border-r-2 md:border-b-2 md:border-r-0 border-white";

  const windH = document.createElement("P");
  windH.className = "mr-2";
  windH.innerHTML = "Vent";

  const windSpan = document.createElement("span");
  windSpan.className = "hidden md:inline-flex md:mx-2";
  windSpan.innerHTML = " : ";

  const windH2 = document.createElement("P");
  windH.className = "font-semibold";
  windH2.innerHTML = wind;

  //humidité
  const humidityDiv = document.createElement("div");
  humidityDiv.className = "flex flex-col md:flex-row py-2 w-24 md:w-full";

  const humidityH = document.createElement("P");
  humidityH.className = "mr-2";
  humidityH.innerHTML = "Humidité";

  const humiditySpan = document.createElement("span");
  humiditySpan.className = "hidden md:inline-flex md:mx-2";
  humiditySpan.innerHTML = " : ";

  const humidityH2 = document.createElement("P");
  humidityH.className = "font-semibold";
  humidityH2.innerHTML = humidity;

  //div info globale

  //ville
  weatherDiv.appendChild(cityDiv);

  //heure
  weatherDiv.appendChild(hourDiv);

  //info
  weatherDiv4.appendChild(tempDiv);
  weatherDiv4.appendChild(feelDiv);

  weatherDiv3.appendChild(weatherDiv4);
  weatherDiv3.appendChild(iconImg);

  weatherDiv2.appendChild(weatherDiv3);
  weatherDiv2.appendChild(descriptionDiv);

  weatherDiv.appendChild(weatherDiv2);

  box.appendChild(weatherDiv);

  //div info detail

  //nuage
  cloudH.appendChild(cloudSpan);
  cloudDiv.appendChild(cloudH);
  cloudDiv.appendChild(cloudH2);

  detailDiv.appendChild(cloudDiv);

  //vent
  windH.appendChild(windSpan);
  windDiv.appendChild(windH);
  windDiv.appendChild(windH2);

  detailDiv.appendChild(windDiv);

  //humidité
  humidityH.appendChild(humiditySpan);
  humidityDiv.appendChild(humidityH);
  humidityDiv.appendChild(humidityH2);

  detailDiv.appendChild(humidityDiv);

  box.appendChild(detailDiv);

  //boite englobante
  app.appendChild(box);

  return app;
}

//---------------------------------------------------------------------//
//template nav
function createNav(id, temp, feel, icon) {
  const element = document.createElement("div");
  element.className =
    "flex flex-col cursor-pointer mx-2 md:mx-4 items-center px-2 md:px-4 py-2 bg-gray-400 rounded";

  //jour
  const day = document.createElement("div");
  day.className =
    "text-teal-500 w-full rounded-full px-2 md:py-1 md:px-4 border-white border-2";

  const dayH = document.createElement("P");
  dayH.className = "hidden md:inline-flex font-medium";

  const daySpan = document.createElement("span");
  daySpan.className = "md:hidden";

  //titre pour chaque nav (jour)
  if (id === 0) {
    dayH.innerHTML = "Aujourd'hui";
    daySpan.innerHTML = "1";
  } else if (id === 1) {
    dayH.innerHTML = "Demain";
    daySpan.innerHTML = "2";
  } else if (id === 2) {
    dayH.innerHTML = "Après-demain";
    daySpan.innerHTML = "3";
  }

  //icon
  const iconImg = document.createElement("img");
  iconImg.src = icon;
  iconImg.alt = "Icon Meteo";
  iconImg.className =
    "icon transform -my-4 md:-my-2 scale-75 md:scale-100 w-32 h-32 object-contain animated fadeIn";

  //température
  const tempDiv = document.createElement("div");
  tempDiv.className = "text-2xl";
  tempDiv.innerHTML = temp;

  //température ressentie
  const feelDiv = document.createElement("div");
  feelDiv.innerHTML = feel;

  day.appendChild(dayH);
  day.appendChild(daySpan);

  element.appendChild(day);

  element.appendChild(iconImg);
  element.appendChild(tempDiv);
  element.appendChild(feelDiv);

  return element;
}
