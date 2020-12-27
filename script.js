document.addEventListener("DOMContentLoaded", async () => {
  const listenButton = document.getElementById("listen-button");
  const saveButton = document.getElementById("save-button");
  const result = document.getElementById("result");
  const main = document.getElementsByTagName("main")[0];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (typeof SpeechRecognition === "undefined") {
    listenButton.remove();
    result.innerHTML = "Ooops... Something went wrong. It seems that your browser doesn't support Speech Recognition. Sorry.";
  } else {
    const saved = await localStorage.getItem('rubber-duck-explained');
    if (saved !== null) {
      result.innerText= saved;
      saveButton.removeAttribute("disabled");
    }

    let listening = false;
    const recognition = new SpeechRecognition();

    const start = () => {
      localStorage.removeItem('rubber-duck-explained');
      result.innerHTML = "";
      recognition.start();
      listenButton.textContent = "Stop";
      main.classList.add("speaking");
      saveButton.setAttribute("disabled", true);
    }

    const stop = async () => {
      recognition.stop();
      listenButton.textContent = "I'm ready to debug!";
      main.classList.remove("speaking");
      // enable Save button
      saveButton.removeAttribute("disabled");

      // strip off duplicate new lines
      const formatted = result.innerText.replace(/\n\n/g, "\n");
      // save text to local storage
      await localStorage.setItem('rubber-duck-explained', formatted);
    }

    const onResult = async event => {
      result.innerHTML = "";
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

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", onResult);

    listenButton.addEventListener("click", () => {
      listening ? stop() : start();
      listening = !listening;
    })
  }

  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
  
      URL.revokeObjectURL(a.href);
  };
    
  saveButton.addEventListener('click', () => {
    downloadToFile(result.innerText, 'debugged_with_duck_norris.txt', 'text/plain');
  });
})