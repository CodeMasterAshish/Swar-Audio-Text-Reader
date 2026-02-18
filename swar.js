 const synth = window.speechSynthesis;
  let utterance = null;
  let voices = [];
  let words = [];
  let currentWordIndex = 0;
  let isPaused = false;
  let isPlaying = false;

  const samples = {
    quote: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. Every day brings new chances to reshape ourselves, to grow beyond yesterday's limitations.",
    science: "The observable universe is approximately 93 billion light-years in diameter. Within it, there are an estimated two trillion galaxies, each containing hundreds of billions of stars — and around each star, the possibility of worlds.",
    poem: "I carry your heart with me, I carry it in my heart. I am never without it, anywhere I go you go. And whatever is done by only me is your doing, my darling. I fear no fate, for you are my fate."
  };

  function loadSample(key) {
    document.getElementById('inputText').value = samples[key];
    updateWordCount();
    stopReading();
  }

  function clearText() {
    document.getElementById('inputText').value = '';
    updateWordCount();
    stopReading();
  }

  function updateWordCount() {
    const text = document.getElementById('inputText').value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    document.getElementById('wordCount').textContent = count + ' words';
  }

  document.getElementById('inputText').addEventListener('input', updateWordCount);
  updateWordCount();

  // Load voices
  function loadVoices() {
    voices = synth.getVoices();
    const select = document.getElementById('voiceSelect');
    select.innerHTML = '';
    voices.forEach((v, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = v.name.slice(0, 22) + (v.lang ? ` (${v.lang})` : '');
      select.appendChild(opt);
    });
  }

  synth.onvoiceschanged = loadVoices;
  loadVoices();

  function voiceChanged() { /* voice change updates on next play */ }

  function setStatus(state) {
    const dot = document.getElementById('statusDot');
    const txt = document.getElementById('statusText');
    const waveform = document.getElementById('waveform');
    dot.className = 'status-dot ' + (state === 'playing' ? 'active' : state === 'paused' ? 'paused' : '');
    txt.textContent = state === 'playing' ? 'Speaking...' : state === 'paused' ? 'Paused' : 'Ready';
    waveform.className = 'waveform' + (state === 'playing' ? ' playing' : '');
    document.getElementById('readingDisplay').className = 'reading-display' + (state !== 'ready' ? ' active' : '');
  }

  function renderWords(text) {
    words = text.trim().split(/(\s+)/);
    const container = document.getElementById('readingText');
    container.innerHTML = '';
    let wordIndex = 0;
    words.forEach((part, i) => {
      if (/\S/.test(part)) {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = part;
        span.id = 'w' + wordIndex;
        container.appendChild(span);
        wordIndex++;
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function highlightWord(index) {
    document.querySelectorAll('.word').forEach((el, i) => {
      el.classList.remove('active');
      if (i < index) el.classList.add('spoken');
      else el.classList.remove('spoken');
    });
    const current = document.getElementById('w' + index);
    if (current) {
      current.classList.add('active');
      current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    // Update progress
    const total = document.querySelectorAll('.word').length;
    document.getElementById('progressFill').style.width = total ? (index / total * 100) + '%' : '0%';
  }

  function togglePlay() {
    if (isPlaying && !isPaused) {
      pauseReading();
      return;
    }
    if (isPaused) {
      resumeReading();
      return;
    }
    startReading();
  }

  function startReading() {
    const text = document.getElementById('inputText').value.trim();
    if (!text) return;

    synth.cancel();
    renderWords(text);

    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = parseFloat(document.getElementById('rateSlider').value);
    utterance.pitch = parseFloat(document.getElementById('pitchSlider').value);
    utterance.volume = parseFloat(document.getElementById('volSlider').value);

    const vi = document.getElementById('voiceSelect').value;
    if (voices[vi]) utterance.voice = voices[vi];

    currentWordIndex = 0;

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        highlightWord(currentWordIndex);
        currentWordIndex++;
      }
    };

    utterance.onend = () => {
      isPlaying = false;
      isPaused = false;
      setStatus('ready');
      document.getElementById('playBtn').textContent = '▶ Play';
      document.getElementById('pauseBtn').disabled = true;
      document.getElementById('progressFill').style.width = '100%';
      setTimeout(() => document.getElementById('progressFill').style.width = '0%', 1000);
    };

    utterance.onerror = () => {
      isPlaying = false;
      setStatus('ready');
    };

    synth.speak(utterance);
    isPlaying = true;
    isPaused = false;
    setStatus('playing');
    document.getElementById('playBtn').textContent = '⏸ Pause';
    document.getElementById('pauseBtn').disabled = false;
  }

  function pauseReading() {
    if (!isPlaying) return;
    synth.pause();
    isPaused = true;
    setStatus('paused');
    document.getElementById('playBtn').textContent = '▶ Resume';
  }

  function resumeReading() {
    synth.resume();
    isPaused = false;
    setStatus('playing');
    document.getElementById('playBtn').textContent = '⏸ Pause';
  }

  function stopReading() {
    synth.cancel();
    isPlaying = false;
    isPaused = false;
    setStatus('ready');
    document.getElementById('playBtn').textContent = '▶ Play';
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('readingText').innerHTML = '<span style="color: var(--muted); font-family: \'DM Mono\', monospace; font-size: 0.8rem; letter-spacing: 0.1em;">Press PLAY to begin reading...</span>';
  }

  function rewind() {
    stopReading();
    setTimeout(startReading, 100);
  }

  function updateRate(v) {
    document.getElementById('rateVal').textContent = parseFloat(v).toFixed(1) + '×';
    if (utterance) utterance.rate = parseFloat(v);
  }
  function updatePitch(v) {
    document.getElementById('pitchVal').textContent = parseFloat(v).toFixed(1);
    if (utterance) utterance.pitch = parseFloat(v);
  }
  function updateVol(v) {
    document.getElementById('volVal').textContent = Math.round(v * 100) + '%';
    if (utterance) utterance.volume = parseFloat(v);
  }

  // ── Audio Recording & Download ──────────────────────────────────────────
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;
  let recordedBlob = null;
  let recordStartTime = null;
  let timerInterval = null;

  async function toggleRecord() {
    if (isRecording) stopRecord();
    else await startRecord();
  }

  async function startRecord() {
    const text = document.getElementById('inputText').value.trim();
    if (!text) {
      setDownloadInfo('⚠ Please enter text first.', false);
      return;
    }
    recordedChunks = [];
    recordedBlob = null;

    // Use getDisplayMedia to capture tab audio (Chrome/Edge support)
    // Falls back to AudioContext destination capture
    let stream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1, height: 1, frameRate: 1 },
        audio: { echoCancellation: false, noiseSuppression: false, sampleRate: 44100 }
      });
      // Keep only audio tracks
      stream.getVideoTracks().forEach(t => t.stop());
      if (stream.getAudioTracks().length === 0) throw new Error('No audio track');
    } catch(e) {
      // Fallback: AudioContext silent stream (still allows file generation)
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = ctx.createMediaStreamDestination();
      const osc = ctx.createOscillator();
      const g = ctx.createGain(); g.gain.value = 0.0001;
      osc.connect(g); g.connect(dest); osc.start();
      stream = dest.stream;
      setDownloadInfo('ℹ Tip: for best results, allow tab audio capture when prompted.', false);
    }

    const mimeType = ['audio/webm;codecs=opus','audio/webm','audio/ogg'].find(m => {
      try { return MediaRecorder.isTypeSupported(m); } catch(e){ return false; }
    }) || '';

    try {
      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    } catch(e) {
      mediaRecorder = new MediaRecorder(stream);
    }
    mediaRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = finalizeRecording;
    mediaRecorder.start(100);

    isRecording = true;
    recordStartTime = Date.now();
    document.getElementById('recordBtn').classList.add('recording');
    document.getElementById('recordBtn').innerHTML = '<span class="rec-dot"></span> Stop';
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('downloadInfo').innerHTML = 'Recording... <span id="recTimer">0s</span>';

    timerInterval = setInterval(() => {
      const el = document.getElementById('recTimer');
      if (el) el.textContent = Math.floor((Date.now()-recordStartTime)/1000) + 's';
    }, 500);

    // Speak the text
    speakForRecording(text);
  }

  function speakForRecording(text) {
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = parseFloat(document.getElementById('rateSlider').value);
    utt.pitch = parseFloat(document.getElementById('pitchSlider').value);
    utt.volume = parseFloat(document.getElementById('volSlider').value);
    const vi = document.getElementById('voiceSelect').value;
    if (voices[vi]) utt.voice = voices[vi];
    utt.onend = () => { setTimeout(() => { if (isRecording) stopRecord(); }, 500); };
    utt.onerror = () => { if (isRecording) stopRecord(); };
    synth.speak(utt);
  }

  function stopRecord() {
    if (!isRecording) return;
    isRecording = false;
    clearInterval(timerInterval);
    synth.cancel();
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    document.getElementById('recordBtn').classList.remove('recording');
    document.getElementById('recordBtn').innerHTML = '<span class="rec-dot"></span> Record';
  }

  function finalizeRecording() {
    if (recordedChunks.length === 0) {
      setDownloadInfo('⚠ No audio captured.', false);
      return;
    }
    const type = recordedChunks[0].type || 'audio/webm';
    recordedBlob = new Blob(recordedChunks, { type });
    const dur = Math.floor((Date.now()-recordStartTime)/1000);
    const kb = Math.round(recordedBlob.size/1024);
    setDownloadInfo(`✓ Ready &nbsp;·&nbsp; <span>${dur}s · ${kb} KB</span>`, true);
    document.getElementById('downloadBtn').disabled = false;
  }

  function downloadAudio() {
    if (!recordedBlob) return;
    const ext = recordedBlob.type.includes('ogg') ? 'ogg' : 'webm';
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'swar-reading.' + ext;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function setDownloadInfo(html, success) {
    const el = document.getElementById('downloadInfo');
    el.innerHTML = html;
    el.style.color = success ? 'var(--muted)' : 'var(--accent2)';
  }
