/* =========================================================
   cake.js — Interactive Birthday Cake, Mic Blow & Voice Wish
   ========================================================= */

(function () {
  const wishBtn        = document.getElementById('wish-btn');
  const micWishBtn     = document.getElementById('mic-wish-btn');
  const voiceWishBtn   = document.getElementById('voice-wish-btn');
  const stopVoiceBtn   = document.getElementById('stop-voice-btn');
  const voiceStatusBox = document.getElementById('voice-status-box');
  const voiceStatusText= document.getElementById('voice-status-text');
  const flames         = document.querySelectorAll('.flame-3d');
  const wishMessage    = document.getElementById('wish-message');

  let audioContext = null;
  let analyser     = null;
  let micStream    = null;

  const mainWishText = "Happy Birthday Rithika! May your special day be filled with endless joy, laughter, and beautiful memories. You are truly extraordinary, talented, and kind. Happy Birthday Rithika!";

  window.speakBirthdayWish = function (text = mainWishText) {
    if (!('speechSynthesis' in window)) {
      alert("Happy Birthday Rithika! Sending all love and blessings to you! 💖");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    if (voiceStatusBox) voiceStatusBox.classList.remove('hidden');
    if (voiceStatusText) voiceStatusText.textContent = "Playing Birthday Voice Blessing... 🎙️✨";

    utterance.onend = () => {
      if (voiceStatusBox) voiceStatusBox.classList.add('hidden');
    };

    window.speechSynthesis.speak(utterance);
  };

  if (stopVoiceBtn) {
    stopVoiceBtn.addEventListener('click', () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (voiceStatusBox) voiceStatusBox.classList.add('hidden');
    });
  }

  if (voiceWishBtn) {
    voiceWishBtn.addEventListener('click', () => window.speakBirthdayWish());
  }

  // Wish Button Click
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      flames.forEach(f => f.classList.add('extinguished'));
      if (wishMessage) wishMessage.classList.remove('hidden');
      if (window.launchFireworks) window.launchFireworks(5000);
      if (window.launchConfetti) window.launchConfetti(5000);
      window.speakBirthdayWish();
    });
  }

  // Mic Blow Detection
  if (micWishBtn) {
    micWishBtn.addEventListener('click', async () => {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(micStream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function checkBlow() {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          let average = sum / dataArray.length;

          if (average > 45) { // Loud blow detected
            flames.forEach(f => f.classList.add('extinguished'));
            if (wishMessage) wishMessage.classList.remove('hidden');
            if (window.launchFireworks) window.launchFireworks(5000);
            if (window.launchConfetti) window.launchConfetti(5000);
            window.speakBirthdayWish();
            micStream.getTracks().forEach(t => t.stop());
            return;
          }
          requestAnimationFrame(checkBlow);
        }

        checkBlow();
      } catch (err) {
        alert("Microphone access permission needed or click 'Make A Birthday Wish' button! ✨");
      }
    });
  }
})();
