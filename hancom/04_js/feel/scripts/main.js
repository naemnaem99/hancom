const question = document.querySelector("#question");
const btn = document.querySelector("#btn");
const cards = document.querySelector("#cards");
const promptEl = document.querySelector("#prompt");
const basketHint = document.querySelector("#basketHint");
const fireEl = document.querySelector("#fire");
const fireHint = document.querySelector("#fireHint");

let cardsShown = false;

const STORAGE_KEY = "feelHistory";
const CYCLE_SIZE = 3;

const saveToHistory = (text) => {
    const groups = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let lastGroup = groups[groups.length - 1];

    if (!lastGroup || lastGroup.length >= CYCLE_SIZE) {
        lastGroup = [];
        groups.push(lastGroup);
    }

    lastGroup.push(text);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
};

const MOODS = [
    { name: "기쁨" },
];

const DOWN_ARROW_PATTERN = [
    "...#...",
    "...#...",
    "...#...",
    "...#...",
    ".#.#.#.",
    "..###..",
    "...#...",
];
const UP_ARROW_PATTERN = [
    "...#...",
    "..###..",
    ".#.#.#.",
    "...#...",
    "...#...",
    "...#...",
    "...#...",
];
const ARROW_PIXEL = 2;

const createArrowIcon = (pattern) => {
    const icon = document.createElement("span");
    icon.className = "arrow-icon";

    const shadows = [];
    pattern.forEach((row, r) => {
        [...row].forEach((ch, c) => {
            if (ch !== "#") return;
            shadows.push(`${c * ARROW_PIXEL}px ${r * ARROW_PIXEL}px 0 0 #000`);
        });
    });

    const pixel = document.createElement("span");
    pixel.className = "arrow-pixel";
    pixel.style.width = `${ARROW_PIXEL}px`;
    pixel.style.height = `${ARROW_PIXEL}px`;
    pixel.style.boxShadow = shadows.join(", ");

    icon.appendChild(pixel);
    return icon;
};

const setPrompt = (text) => {
    promptEl.innerHTML = "";
    promptEl.appendChild(createArrowIcon(DOWN_ARROW_PATTERN));
    promptEl.appendChild(document.createTextNode(` ${text} `));
    promptEl.appendChild(createArrowIcon(DOWN_ARROW_PATTERN));
};

const setFireHint = (text) => {
    fireHint.innerHTML = "";
    fireHint.appendChild(createArrowIcon(UP_ARROW_PATTERN));
    fireHint.appendChild(document.createTextNode(` ${text} `));
    fireHint.appendChild(createArrowIcon(UP_ARROW_PATTERN));
};

setPrompt("오늘 기분이 어때요?");

const createCards = () => {
    cards.innerHTML = "";
    MOODS.forEach((mood) => {
        const card = document.createElement("div");
        card.className = "card";

        const front = document.createElement("div");
        front.className = mood.inverted ? "card-front inverted" : "card-front";

        const catchList = document.createElement("div");
        catchList.className = "catch-list";
        front.appendChild(catchList);

        card.appendChild(front);
        cards.appendChild(card);
    });

    basketHint.textContent = "바구니에 버리고 싶은 감정을 담아보세요";
    cards.appendChild(basketHint);
};

const spawnFire = () => {
    fireEl.style.display = "block";
    setFireHint("태워버리기");
};

let dragCard = null;
let dragStartX = 0;
let dragStartY = 0;
let dragOriginLeft = 0;
let dragOriginTop = 0;

const onDragMove = (e) => {
    if (!dragCard) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    dragCard.style.left = `${dragOriginLeft + dx}px`;
    dragCard.style.top = `${dragOriginTop + dy}px`;

    if (fireEl.style.display === "block" && overlaps(dragCard.getBoundingClientRect(), fireEl.getBoundingClientRect())) {
        dragCard.remove();
        onDragEnd();
        createCards();
    }
};

const onDragEnd = () => {
    if (dragCard) {
        dragCard.classList.remove("dragging");
    }
    dragCard = null;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
};

cards.addEventListener("pointerdown", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    const rect = card.getBoundingClientRect();

    dragCard = card;
    dragCard.classList.add("placed", "dragging");
    dragCard.style.left = `${rect.left}px`;
    dragCard.style.top = `${rect.top}px`;

    basketHint.textContent = "";
    spawnFire();

    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginLeft = rect.left;
    dragOriginTop = rect.top;

    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
});

const resetEl = (el) => {
    el.style.left = `${Math.random() * 88}vw`;
    el.style.animation = "none";
    void el.offsetWidth;
    const duration = 4 + Math.random() * 4;
    el.style.animation = `fall ${duration}s linear forwards`;
};

const spawnSnowText = (text) => {
    const count = 15;
    const usedPositions = [];

    for (let i = 0; i < count; i++) {
        let left;
        let attempts = 0;

        do {
            left = Math.random() * 88;
            attempts++;
        } while (
            usedPositions.some(pos => Math.abs(pos - left) < 10) &&
            attempts < 100
        );

        usedPositions.push(left);

        const el = document.createElement("span");
        el.className = "snow-text";
        el.textContent = text;
        el.style.left = `${left}vw`;
        el.style.animationDuration = `${4 + Math.random() * 4}s`;
        el.style.animationDelay = `${Math.random() * 3}s`;

        document.body.appendChild(el);

        el.addEventListener("animationend", () => resetEl(el));
    }
};

let clickCount = 0;

btn.addEventListener("click", () => {
    const text = question.value.trim();
    if (!text) return;

    saveToHistory(text);

    if (clickCount === 2) {
        clickCount = 0;
        setPrompt("오늘 기분이 어때요?");
        question.placeholder = "기분이 어때요?";
        btn.textContent = "ENTER";

        document.body.classList.add("top-layout");

        if (!cardsShown) {
            createCards();
            cardsShown = true;
        }
    } else {
        clickCount++;
        if (clickCount === 1) {
            setPrompt("좋은 일이 있었나요?");
            question.placeholder = "좋은 기분을 외쳐봐";
            btn.textContent = "외치기";
        } else if (clickCount === 2) {
            setPrompt("나쁜 말도 시원하게 해봅시다");
            question.placeholder = "욕도 좋으니 뭐든지 쏟아내봐";
            btn.textContent = "토해내기";
        }
    }

    spawnSnowText(text);
    question.value = "";
});

question.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});

const savedGroups = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const lastGroup = savedGroups[savedGroups.length - 1] || [];
lastGroup.forEach((text) => spawnSnowText(text));

const overlaps = (a, b) => (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
);

const checkCatches = () => {
    if (dragCard) {
        const catchList = dragCard.querySelector(".catch-list");

        if (catchList) {
            const cardRect = dragCard.getBoundingClientRect();
            const mouthWidth = cardRect.width / 3;
            const mouthRect = {
                left: cardRect.left + (cardRect.width - mouthWidth) / 2,
                right: cardRect.left + (cardRect.width - mouthWidth) / 2 + mouthWidth,
                top: cardRect.top,
                bottom: cardRect.top + cardRect.height / 3,
            };

            document.querySelectorAll(".snow-text").forEach((snow) => {
                const snowRect = snow.getBoundingClientRect();
                if (!overlaps(mouthRect, snowRect)) return;

                const word = document.createElement("span");
                word.className = "caught-word";
                word.textContent = snow.textContent;
                catchList.appendChild(word);

                snow.remove();
            });
        }
    }

    requestAnimationFrame(checkCatches);
};

requestAnimationFrame(checkCatches);
