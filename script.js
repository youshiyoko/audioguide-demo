const audioSource = document.getElementById('audio-source');
const playPauseButton = document.getElementById('play-pause-button');
const rewindButton = document.getElementById('rewind-button');
const forwardButton = document.getElementById('forward-button');
const stationTitle = document.getElementById('station-title');
const progressBarContainer = document.querySelector('.progress-bar-container');
const progressBar = document.querySelector('.progress-bar');


// SVG ikonok tárolása
const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

// Hangfájlok alapútvonala
const audioBasePath = 'mp3/';
const englishAudioBasePath = 'eng_mp3/';
let fileNumber; // Állomás szám változó deklarálása (globális scope-ban)

// Képek listája - most már HTML-ből jön
let stationImages;

// Böngésző nyelvének lekérdezése és hangfájl forrásának beállítása
function setAudioSourceBasedOnLanguage() {
    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage.substring(0, 2).toLowerCase();

    let selectedAudioBasePath = audioBasePath;

    if (languageCode !== 'hu') {
        selectedAudioBasePath = englishAudioBasePath;
    }

    const audioFilePath = selectedAudioBasePath + fileNumber + (languageCode === 'hu' ? '.mp3' : '_eng.mp3');
    audioSource.src = audioFilePath;
    console.log('Betöltött hangfájl:', audioFilePath);
}

// Állomás számának és képek listájának beállítása HTML-ből
function initializeStationData() {
    if (typeof window.fileNumber !== 'undefined') {
        fileNumber = window.fileNumber;
    } else {
        // Fájlnévből próbáljuk kinyerni az állomás számát
        const filename = window.location.pathname.split('/').pop();
        const match = filename.match(/station_(\d+)\.html/);
        if (match && match[1]) {
            fileNumber = match[1];
        } else {
            fileNumber = '01'; // Alapértelmezett állomás szám, ha nem sikerül kinyerni
            console.warn('Nem sikerült kinyerni az állomás számát a fájlnévből, alapértelmezett: 01');
        }
    }

    if (typeof window.stationImages !== 'undefined') {
        stationImages = window.stationImages;
    } else {
        stationImages = []; // Üres képtömb, ha nincs inline megadva
        console.warn('Nincs inline stationImages tömb megadva, üres galéria lesz.');
    }

    // Böngésző nyelvének lekérdezése
    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage.substring(0, 2).toLowerCase();

    // Többnyelvű cím beállítása
    let stationLabel = (languageCode === 'hu') ? `Állomás ${fileNumber}` : `Station ${fileNumber}`;
    stationTitle.textContent = stationLabel;
}



// Inicializálás
initializeStationData();
setAudioSourceBasedOnLanguage();


playPauseButton.addEventListener('click', () => {
    if (audioSource.paused) {
        audioSource.play();
        playPauseButton.innerHTML = pauseIcon;
        playPauseButton.classList.add('playing'); // pulzáló animáció bekapcsolása
    } else {
        audioSource.pause();
        playPauseButton.innerHTML = playIcon;
        playPauseButton.classList.remove('playing'); // animáció kikapcsolása
    }
});

// Visszatekerés gomb funkcionalitása
rewindButton.addEventListener('click', () => {
    audioSource.currentTime -= 10;
});


// Előretekerés gomb funkcionalitása
forwardButton.addEventListener('click', () => {
    audioSource.currentTime += 10;
});

// Progress bar frissítése lejátszás közben
audioSource.addEventListener('timeupdate', () => {
    if (audioSource.duration) {
        const progressPercentage = (audioSource.currentTime / audioSource.duration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
});

// Kattintás a progress bar-ra (ugrás az adott pontra)
progressBarContainer.addEventListener('click', (event) => {
    const clickPosition = event.offsetX / progressBarContainer.clientWidth;
    audioSource.currentTime = clickPosition * audioSource.duration;
});


// Sebességértékek tömbje körforgáshoz
const playbackRates = [1, 1.2, 1.5, 0.8];
let currentRateIndex = 0; // Alapérték 1x (0. index)

const speedButton = document.getElementById('speed-button');

// Sebesség beállítása függvény
function setPlaybackRate(rate) {
    audioSource.playbackRate = rate;
    speedButton.textContent = rate + '×';
}

// Kezdeti érték beállítása
setPlaybackRate(playbackRates[currentRateIndex]);

// Sebesség gomb eseményfigyelő
speedButton.addEventListener('click', () => {
    currentRateIndex = (currentRateIndex + 1) % playbackRates.length;
    setPlaybackRate(playbackRates[currentRateIndex]);
});


// 🔄 Kör alakú galéria működtetése
const galleryImage = document.getElementById('gallery-image');
const prevButton = document.getElementById('prev-image');
const nextButton = document.getElementById('next-image');

// Ellenőrizzük, hogy vannak-e képek
if (window.stationImages && window.stationImages.length > 0) {
    let currentImageIndex = 0;

    function updateGalleryImage() {
        galleryImage.classList.add('fade-out');
    
        setTimeout(() => {
            galleryImage.src = `images/${window.stationImages[currentImageIndex]}`;
            galleryImage.classList.remove('fade-out');
        }, 300); // ennyi az idő, amíg eltűnik (300ms)
    }

    prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + window.stationImages.length) % window.stationImages.length;
        updateGalleryImage();
    });

    nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % window.stationImages.length;
        updateGalleryImage();
    });

    // Kezdőérték beállítása
    updateGalleryImage();
}

// 🔽 Böngésző nyelvének lekérdezése
const browserLanguage = navigator.language || navigator.userLanguage;
const languageCode = browserLanguage.substring(0, 2).toLowerCase();

// 🔽 Harmonika menü működtetése
const accordionContainer = document.getElementById('accordion');

// Nyelvfüggő állomás információs adatok
const stationDescriptions = {
    "hu": [
        { title: "Történeti háttér", content: "A magyar törvényhozás legkorábbi írásos emlékei Szent István király idejéből maradtak ránk. A gazdagon illusztrált román kori kódex fontosságát nemcsak művészettörténeti jelentősége adja, hanem az is, hogy államalapító Szent István királyunk (1000–1038) törvényeinek legkorábbi kéziratát őrzi. István király két fennmaradt törvénykönyve nagy hangsúlyt helyezett a frissen alapított magyar katolikus egyház zavartalan működésének biztosítására és a nomád életmódot felváltó feudális, magántulajdonra épülő berendezkedés megszilárdítására. A király szigorú törvényei előírták az egyházi tized fizetését, a tíz falunkénti kötelező templomépítést, valamint az egyházi szertartások és szokások megtartását. Keményen büntették a közrend megsértőit, más birtokainak és tulajdonának zargatóit. Államalapító királyunk uralkodói hatalma megkérdőjelezhetetlen volt, mégis, már e korai törvénykezés is számos helyen hivatkozik az uralkodó mellett működő királyi tanács szerepére a törvényhozásban. A király tehát törvényei megalkotásakor kezdettől fogva e szűk tanácsadó testületre támaszkodott." },
        { title: "Építészeti jellemzők", content: "Az épület különleges stílusjegyei és tervezése magyarul." }
    ],
    "en": [
        { title: "Historical Background", content: "This is the history and interesting facts about the station in English." },
        { title: "Architectural Features", content: "The special architectural style and design of the building in English." }
    ]
};

// Nyelvfüggő tartalom kiválasztása
const selectedDescriptions = stationDescriptions[languageCode] || stationDescriptions["en"];

// Ha van tartalom, akkor építse fel a harmonikát
if (selectedDescriptions.length > 0) {
    selectedDescriptions.forEach((item) => {
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        const accordionHeader = document.createElement('div');
        accordionHeader.classList.add('accordion-header');
        accordionHeader.textContent = item.title;

        const accordionContent = document.createElement('div');
        accordionContent.classList.add('accordion-content');
        accordionContent.innerHTML = `<p>${item.content}</p>`;

        // Nyitás-zárás működés + automatikus gördítés
        accordionHeader.addEventListener('click', () => {
            const isActive = accordionHeader.classList.contains('active');

            // Minden másik lezárása
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.classList.remove('active');
                header.nextElementSibling.style.maxHeight = null;
                header.nextElementSibling.style.padding = "0 14px";
            });

            // Az aktuális lenyitása
            if (!isActive) {
                accordionHeader.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                accordionContent.style.padding = "14px";

                // 📱 Automatikus gördítés mobilra optimalizálva
                setTimeout(() => {
                    accordionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });

        // Összekapcsolás a DOM-mal
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionContent);
        accordionContainer.appendChild(accordionItem);
    });
}

// Animáció kikapcsolása, ha véget ér a hang (a harmonikán kívül!)
audioSource.addEventListener('ended', () => {
    playPauseButton.innerHTML = playIcon;
    playPauseButton.classList.remove('playing');
});