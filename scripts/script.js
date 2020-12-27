// get DOM elements needed in this program
const getDOMElements = () => {
  return {
    listenButton: document.getElementById("listen-button"),
    saveButton: document.getElementById("save-button"),
    result: document.getElementById("result"),
    main: document.getElementsByTagName("main")[0]
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const { listenButton, saveButton, result, main } = getDOMElements();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // show user if the Speech Recognition API is not available in the browser
  if (typeof SpeechRecognition === "undefined") {
    listenButton.remove();
    result.innerHTML = "Ooops... Something went wrong. It seems that your browser doesn't support Speech Recognition. Sorry.";
  } else {
    // load saved data from Local Storage
    const saved = localStorage.getItem('rubber-duck-explained');
    if (saved !== null) {
      result.innerText = saved;
      saveButton.removeAttribute("disabled");
    }

    let listening = false;
    const recognition = new SpeechRecognition();

    // when user presses listenButton...
    const start = () => {
      // remove previously saved data from Local Storage
      localStorage.removeItem('rubber-duck-explained');

      // remove text from result
      result.innerHTML = "";

      // start listening
      recognition.start();

      // change listenButton's text
      listenButton.textContent = "Stop";

      // add animation class to main section to indicate listening
      main.classList.add("speaking");

      // disable saveButton
      saveButton.setAttribute("disabled", true);
    }

    // when user presses stopButton
    const stop = () => {
      // stop listening
      recognition.stop();

      // change button back
      listenButton.textContent = "I'm ready to debug!";

      // stop animation of main section
      main.classList.remove("speaking");

      // enable saveButton
      saveButton.removeAttribute("disabled");

      // strip off duplicate new lines of result
      const formatted = result.innerText.replace(/\n\n/g, "\n");

      // save data to local storage
      localStorage.setItem('rubber-duck-explained', formatted);
    }

    // when getting results from Speech Recognition
    const onResult = event => {
      // clear result
      result.innerHTML = "";

      // go through the results array and create a new p element for each
      for (const res of event.results) {
        const text = document.createTextNode(res[0].transcript);
        const p = document.createElement("p");
        if (res.isFinal) {
          p.classList.add("final");  
        }
        p.appendChild(text);
        result.appendChild(p);
      }
    }

    // recognition config
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", onResult);

    // add event listener to listenButton
    listenButton.addEventListener("click", () => {
      listening ? stop() : start();
      listening = !listening;
    })
  }

  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };
    
  saveButton.addEventListener('click', () => {
    downloadToFile(result.innerText, 'debugged_with_duck_norris.txt', 'text/plain');
  });
})