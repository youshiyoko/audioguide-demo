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

// 🔹 Nyelvfüggő állomás információs adatok
const stationDescriptions = {
    "hu": {
        "01": [
            { title: "Történeti háttér", content: "Utah államban, a Bonneville sóstómedrében ezzel kezdetét vette a szárazföldi sebességrekordok sugárhajtású korszaka. Breedlove járművét az F–86 Sabre vadászgéphez fejlesztett sugárhajtóművel szerelték, az eredményét azonban eleinte nem ismerték el, mivel nem felelt meg az FIA előírásainak azzal, hogy csak három kereke volt, és a hajtómű nem közvetlenül a kerekeket hajtotta. Nem sokkal később az FIM a motorkerékpárok közt elismerte a rekordot." },
            { title: "Első állomás jellemzői", content: "Siculiana szállást, étkezést és idegenvezetést is biztosít, ehhez mindössze egy élményvideót kell készíteniük a szerencsés nyerteseknek. HIRDETÉS Siculiana egy apró, tengerparti olasz városka, amely lélegzetelállító környezetben fekszik. A turisták is kedvelik, de a csak a főszezonban látogatják meg. A város most egy sajátos akcióval próbálja elérni, hogy az érdeklődőket a csúcsszezonon kívül is bevonzzák – írja a Metro. Három napot magában foglaló hétvégi nyaralást kínálnak mindössze 1 euróért, ami március 19-ei állás szerint picivel több mint 400 forintot jelent. A csomag tulajdonképpen ingyenes, hisz ez az összeg csak az idegenforgalmi adót fedezi. A szerencsés nyerteseknek nem kell fizetniük a szállásért, reggelit, ebédet, valamint vacsorát is kapnak, illetve díjmentes idegenvezetést biztosítanak számukra a városban és környékén. HIRDETÉS Ahhoz, hogy valaki részt vehessen egy ilyen nyaraláson, 18 éven felülinek kell lennie, és el kell küldenie egy videót a városnak, amelyben kifejti, miért is szeretne részt venni a programban. De még ebben is segít a város turisztika tanácsa, amely ölteket is adott, a „megérdemeljük a nyaralást”, a „szeretjük Szicíliát” vagy a „szicíliai ételeket akarunk enni” is szerepel a tippek között. A pályázatokat a turisztikai tanács bírálja el. Azt nézik, hogy mennyire eredeti vagy kreatív a jelentkezés, mennyire lelkes a jelentkező vagy hogy mennyiben motiválja, hogy megismerje Siculianát. Összesen 10 pár vehet részt a nyaraláson, az első turnus április 4-től 6-ig tartózkodik a városban, a nyertesek névsorát március 20-án hirdetik ki. A szerencsés turistáknak csak élvezniük kell a nyaralást, mindössze egy feladatuk van, videót kell készíteniük, amelyben beszámolnak az élményeikről. Siculiana Szicília nyugati partján fekszik, nagyjából 18 kilométerre Agrigentótól. Sok olasz városhoz hasonlóan ősszel és télen elcsendesedik picit, ráadásul az elmúlt 20 évben ötödével csökkent a lakosság, mivel a fiatalok inkább a nagyobb városokba vagy külföldre költöznek. A város abban bízik, hogy az akcióval sikerül fellendíteniük a turizmust, és esetleg kedvet csinálniuk a fiataloknak, hogy Siculianában telepedjenek le." }
        ],
        "02": [
            { title: "Második állomás története", content: "Nem kellett sokat várni Craig Breedlove válaszára, és mire a 966 km/órás sebességet megfutotta, az FIA és FIM megegyezett abban, hogy a kerekek számától és hajtásától függetlenül is elismerik a járművek eredményét, így a Spirit of America Sonic I lett hivatalosan is az első sugárhajtású sebességrekorder. A járművel Breedlove felesége is történelmet írt, 496 km/órával a világ leggyorsabb nője címét szerezte meg." },
            { title: "Második állomás jellemzői", content: "a Spirit of America Sonic I rekordja pedig 1970-ig tartotta magát, amikor a Blue Flame átlépte az ezer km/órás sebességet. A hangsebességet pedig nem is a Richard Noble által vezetett, 1983-ban 1019 km/órát elérő Thrust 2 lépte túl, hanem 1997-ben a Thrust SSC, amit Andy Green vezetett, és második próbálkozásra 1227,986 km/órával száguldott, a mai napig tartva a szárazföldi sebességrekordot." }
        ]
        // "03" nincs megadva → nem fog megjelenni szöveg
    },
    "en": {
        "01": [
            { title: "Historical Background", content: "To protect crops from rising droughts, scientists are looking to the genes of a small group of plants that can survive months of drought then regreen within hours. It was as a child growing up in South Africa in the 1970s that Jill Farrant first noticed several plants around her apparently coming back from the dead. These plants, she later learned, can survive six months or more without water. Their leaves turn brown and brittle to the touch but, given water, they will regreen within hours. Within a day, they've returned to their former self and can continue to photosynthesise." },
            { title: "Architectural Features", content: "Resurrection plants have evolved this essential skill by replacing disappearing water with sugars such as sucrose, turning the inside of their cells into a viscous, glass-like substance that slows down any chemical reactions. Known as vitrification, the same tactic is used by desiccation-tolerant animals such as tardigrades (also known as water bears) and the eggs of Artemia shrimp (sea monkeys)." }
        ],
        "02": [
            { title: "History of Station 2", content: "Resurrection plants have evolved this essential skill by replacing disappearing water with sugars such as sucrose, turning the inside of their cells into a viscous, glass-like substance that slows down any chemical reactions. Known as vitrification, the same tactic is used by desiccation-tolerant animals such as tardigrades (also known as water bears) and the eggs of Artemia shrimp (sea monkeys)." },
            { title: "Unknown data", content: "Resurrection plants have evolved this essential skill by replacing disappearing water with sugars such as sucrose, turning the inside of their cells into a viscous, glass-like substance that slows down any chemical reactions. Known as vitrification, the same tactic is used by desiccation-tolerant animals such as tardigrades (also known as water bears) and the eggs of Artemia shrimp (sea monkeys)." }
        ]
    }
};

// 🔎 Az aktuális állomás számának lekérése
const selectedDescriptions = stationDescriptions[languageCode] && stationDescriptions[languageCode][fileNumber]
    ? stationDescriptions[languageCode][fileNumber]
    : [];

// Ha nincs tartalom az állomásnál, elrejti az információs blokkot
const stationInfoSection = document.querySelector('.station-info');
if (selectedDescriptions.length === 0) {
    stationInfoSection.style.display = 'none';
} else {
    // 📌 Ha van tartalom, építse fel a harmonikát
    selectedDescriptions.forEach((item) => {
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        const accordionHeader = document.createElement('div');
        accordionHeader.classList.add('accordion-header');
        accordionHeader.textContent = item.title;

        const accordionContent = document.createElement('div');
        accordionContent.classList.add('accordion-content');
        accordionContent.innerHTML = `<p>${item.content}</p>`;

        // 📌 Nyitás-zárás működés + automatikus gördítés
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

        // 📌 Az elkészült elemek DOM-ba illesztése
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