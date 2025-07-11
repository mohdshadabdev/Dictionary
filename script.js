const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const result = document.getElementById('result');
const themeSwitch = document.getElementById('theme-switch');
const fontSelect = document.getElementById('font-select');

searchBtn.addEventListener('click', () => {
  const word = searchInput.value.trim();
  if (word) {
    fetchWord(word);
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

async function fetchWord(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    displayResult(data[0]);
  } catch (err) {
    result.innerHTML = "<p>Word not found. Try another.</p>";
  }
}

function displayResult(data) {
  const audioSrc = data.phonetics.find(p => p.audio)?.audio || "";
  const audioBtn = audioSrc ? `<button class="audio-btn" onclick="playAudio('${audioSrc}')">▶️ Play</button>` : "";
  let html = `
    <div>
      <span class="word-title">${data.word}</span>
      <span class="phonetic">${data.phonetic || ""}</span>
      ${audioBtn}
    </div>
  `;

  data.meanings.forEach(meaning => {
    html += `
      <div class="part-of-speech">${meaning.partOfSpeech}</div>
      <h3>Meaning</h3>
      <ul>
        ${meaning.definitions.map(def => `<li>${def.definition}${def.example ? `<br><em>"${def.example}"</em>` : ""}</li>`).join('')}
      </ul>
    `;
    if (meaning.synonyms?.length) {
      html += `<div class="synonyms"><strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}</div>`;
    }
  });

  html += `<div class="source">Source: <a href="${data.sourceUrls[0]}" target="_blank">${data.sourceUrls[0]}</a></div>`;
  result.innerHTML = html;
}

function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
}

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});

fontSelect.addEventListener('change', () => {
  document.body.classList.remove('inter', 'serif', 'mono');
  const font = fontSelect.value;
  if (font === 'serif') document.body.classList.add('serif');
  else if (font === 'mono') document.body.classList.add('mono');
});
