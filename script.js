
async function loadJSONFromFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
}


document.addEventListener("DOMContentLoaded", async function() {
  const nrOfCells = 25
  var todayCellInfo = null;
  const grid = document.querySelector(".grid");
  const currentDate = new Date();
  var parameter = 0;
  if (currentDate.getMonth() + 1 === 12) {
    parameter = parseInt(currentDate.getDate());

    // parameter = 17;
    // if (parameter > 24) {
    //   parameter = 24;
    // }

    const info = document.querySelector(".info-text");
    info.innerHTML = "Vajuta pildile all paremas nurgas, et näha seda suuremalt.";

  } else {
    const info = document.querySelector(".info-alert");
    info.innerHTML = "Esimene luuk avaneb juba 1.detsembril!";
  }
  var audioPlayers = [];
  const imageElement = document.createElement("img");
  imageElement.classList.add("image");

  // window.history.pushState({}, null, 'ho-ho-hoo!');

  function toggleCell(cell, audioSrc, imageUrl) {
      // console.log(cell, audioSrc, imageUrl)
      imageElement.src = "static/images/" + imageUrl;

      var audioElem = document.querySelector(".audio-elem");
      if (audioElem.src != null && !audioElem.src.endsWith(audioSrc)) {
        // console.log("new audio")
        audioElem.src = audioSrc;
      } 
      // console.log(audioElem.src, audioSrc)

      var cells = document.querySelectorAll('.cell');

      cells.forEach(function(cell) {
          cell.classList.remove('playing');
      });

      if (audioElem.paused) {
        audioElem.play();
        cell.classList.add("playing");
      } else {
        audioElem.pause();
      }
  }

  function addMonitor(element, category, label) {
    element.addEventListener('click', function() {
      gtag('event', 'click', {
        'event_category': category,
        'event_label': label
      });
    });
  }

  try {
    const json = await loadJSONFromFile("text.json");

    for (let i = 1; i <= nrOfCells; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = i;

      if (i == nrOfCells) {
        addMonitor(cell, "img-cell-click", "img")

        cell.classList.add("image-container");
        let imgNr = parameter;
        if (imgNr > 24) {imgNr = 24};
        const imageUrl = "static/images/" + json[imgNr - 1]['image'];
        imageElement.src = imageUrl;

        cell.appendChild(imageElement);

      } else {
        const textArea = document.createElement("div");
        textArea.classList.add("textArea");
        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = json[i - 1]['name'];
        textArea.appendChild(title);
        cell.appendChild(textArea);

        if (i <= parameter) {
          addMonitor(cell, "cell-click", "id")

          cell.classList.add("active");
          const textContent = document.createElement("p");
          textContent.textContent = json[i-1]['text'];
          textContent.classList.add("hidden-on-mobile");

          //const audioPlayer = document.createElement("audio");
          // audioPlayer.loading = "lazy";
          // audioPlayers.push(audioPlayer);
          // audioPlayer.classList.add("audio-player");
          // audioPlayer.src = "static/audio/" + json[i-1]['audio'];
          // audioPlayer.controls = false;

          // cell.addEventListener("click", function () {
          //   toggleCell(cell, audioPlayer, json[i-1]['image']);
          // });

          let audioSrc = "static/audio/" + json[i-1]['audio'];

          // console.log(audioSrc);
          cell.addEventListener("click", function () {
            // console.log("cell cliced", audioSrc)
            toggleCell(cell, audioSrc, json[i-1]['image']);
          });

          textArea.appendChild(textContent);
          // cell.appendChild(audioPlayer);

          if (i == parameter) {
            todayCellInfo = [cell, audioSrc, json[i-1]['image']]
          }
        }
      }

      grid.appendChild(cell);

    }

    const calendar = document.querySelector(".grid");
    const imageContainer = document.querySelector(".image-container");
    const image = document.querySelector(".image");
    // console.log(image);

    function toggleImageSize() {
      // console.log('toggle', image);

      const isBigImage = calendar.querySelector("img.big-image");

      if (isBigImage) {
        image.style.opacity = 0;
        setTimeout(function () {
          image.classList.remove("big-image");
          image.remove();
          imageContainer.appendChild(image);
          image.style.opacity = 1;

        }, 1000);


      } else {
        image.classList.toggle("big-image");
        image.remove();
        calendar.appendChild(image);

        image.style.opacity = 0;
        setTimeout(function () {
          image.style.opacity = 1;
        }, 100);
      }
    }

    image.addEventListener("click", toggleImageSize);

    image.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    if (todayCellInfo != null) {
      toggleCell(todayCellInfo[0], todayCellInfo[1], todayCellInfo[2])
    } else {
      imageElement.src = "static/images/24.jpg";
    }

  } catch (error) {
    console.error("Overall error:", error);
  }
});

// For resizing image
document.addEventListener("DOMContentLoaded", function() {

});
