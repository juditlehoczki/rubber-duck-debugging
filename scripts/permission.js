// get permission to use microphone
navigator.mediaDevices.getUserMedia({audio: true})
  .then(() => {
    window.close()
  });