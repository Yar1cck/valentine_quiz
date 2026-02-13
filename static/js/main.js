document.addEventListener("DOMContentLoaded", () => {
    // Проверяем, если ли созданные профили
    checkUserProfiles();

    // Проверяем, на какой странице мы находимся
    const isQuizPage = document.getElementById("quiz-constructor") !== null;
    const isValentinePage = document.querySelector(".valentine-page-wrapper") !== null;

    if (isQuizPage) {
        setupConstructor();
        loadSavedQuizzes();
    }
    
    if (isValentinePage) {
        setupValentineQuizzes();
    }
});

// --- РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЕЙ ---

function checkUserProfiles() {
    const modal = document.getElementById("registrationModal");
    const profileBtn = document.getElementById("profileBtn");
    const profileNames = document.getElementById("profileNames");
    
    if (!modal) return;

    const profiles = JSON.parse(localStorage.getItem("userProfiles") || "null");
    
    if (!profiles) {
        modal.classList.remove("hidden");
        setupRegistrationForm();
    } else {
        modal.classList.add("hidden");
        // Обновляем отображение имен в header
        if (profileNames) {
            profileNames.textContent = `${profiles.person1.name} & ${profiles.person2.name}`;
        }
    }

    // Добавляем обработчик для редактирования профиля
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            editProfiles();
        });
    }
}

function setupRegistrationForm() {
    const form = document.getElementById("registrationForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const person1Name = document.getElementById("person1Name").value.trim();
        const person2Name = document.getElementById("person2Name").value.trim();

        if (!person1Name || !person2Name) {
            alert("Пожалуйста, введите имена обоих");
            return;
        }

        const person1Gender = document.querySelector('input[name="person1Gender"]:checked').value;
        const person2Gender = document.querySelector('input[name="person2Gender"]:checked').value;

        const profiles = {
            person1: { name: person1Name, gender: person1Gender },
            person2: { name: person2Name, gender: person2Gender }
        };

        localStorage.setItem("userProfiles", JSON.stringify(profiles));
        
        const modal = document.getElementById("registrationModal");
        modal.classList.add("hidden");

        // Обновляем имена в header
        const profileNames = document.getElementById("profileNames");
        if (profileNames) {
            profileNames.textContent = `${person1Name} & ${person2Name}`;
        }

        location.reload();
    });
}

function getUserProfiles() {
    return JSON.parse(localStorage.getItem("userProfiles") || "null");
}

function editProfiles() {
    const modal = document.getElementById("registrationModal");
    if (modal) {
        modal.classList.remove("hidden");
        const profiles = getUserProfiles();
        if (profiles) {
            document.getElementById("person1Name").value = profiles.person1.name;
            document.getElementById("person2Name").value = profiles.person2.name;
            document.querySelector(`input[name="person1Gender"][value="${profiles.person1.gender}"]`).checked = true;
            document.querySelector(`input[name="person2Gender"][value="${profiles.person2.gender}"]`).checked = true;
        }
    }
}

function setupQuizTabs() {
    const tabs = document.querySelectorAll(".quiz-tab");
    const sections = {
        movie: document.getElementById("quiz-movie"),
        constructor: document.getElementById("quiz-constructor"),
    };

    if (!tabs.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            Object.entries(sections).forEach(([key, section]) => {
                if (!section) return;
                section.classList.toggle("active", key === target);
            });
        });
    });
}

function setupMovieQuiz() {
    const form = document.getElementById("movieForm");
    const resultBlock = document.getElementById("movieResult");
    if (!form || !resultBlock) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const mood = data.get("movieMood");
        const tempo = data.get("movieTempo");
        const conflict = data.get("movieConflict");

        const profile = getMovieProfile(
            String(mood),
            String(tempo),
            String(conflict)
        );

        const imgSrc = `/static/images/movies/${profile.key}.jpg`;

        resultBlock.innerHTML = `
            <div class="result-layout">
                <div class="result-text">
                    <p><strong>Вы — пара из фильма «${profile.title}».</strong></p>
                    <p>${profile.description}</p>
                </div>
                <div class="result-image">
                    <img src="${imgSrc}" alt="Кадр из фильма ${profile.title}" loading="lazy" />
                </div>
            </div>
        `;
        resultBlock.classList.remove("hidden");
        resultBlock.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

function getMovieProfile(mood, tempo, conflict) {
    if (mood === "cozy" && tempo === "slow" && conflict === "talk") {
        return {
            key: "fault_in_our_stars",
            title: "Виноваты звёзды",
            description:
                "Нежная, глубокая и очень бережная история. Вы те, кто ценит каждую минуту вместе и умеет говорить о самом важном.",
        };
    }

    if (mood === "adventure" && tempo !== "slow") {
        return {
            key: "me_before_you",
            title: "До встречи с тобой",
            description:
                "Вы любите вытаскивать друг друга из зоны комфорта и делать жизнь ярче. В ваших отношениях всегда есть место приключениям.",
        };
    }

    if (mood === "funny") {
        return {
            key: "bridget_jones",
            title: "Дневник Бриджит Джонс",
            description:
                "Много смеха, немного хаоса и бесконечная поддержка. Вы умеете превращать неловкие моменты в тёплые воспоминания.",
        };
    }

    if (mood === "dramatic" && conflict === "storm") {
        return {
            key: "notebook",
            title: "Дневник памяти",
            description:
                "Ваши чувства сильные и яркие, иногда бурные, но в основе — безусловная любовь и желание быть рядом несмотря ни на что.",
        };
    }

    return {
        key: "la_la_land",
        title: "Ла-Ла Ленд",
        description:
            "Вы вдохновляете друг друга расти, мечтать и не бояться изменений. Ваша история — это музыка, огни города и вера в чудо.",
    };
}

// --- ВИКТОРИНЫ КО ДНЮ СВЯТОГО ВАЛЕНТИНА ---

const VALENTINE_QUIZZES = {
    "guess-couple": {
        title: "Угадай пару",
        questions: [
            {
                id: "gc1",
                text: "Эта пара познакомилась на съёмках фильма и поженилась в 1954 году. Он — актёр, она — актриса. О ком идёт речь?",
                options: [
                    { text: "Брэд Питт и Анджелина Джоли", image: "https://wealthgang.com/wp-content/uploads/2026/02/2-9.png" },
                    { text: "Пол Ньюман и Джоан Вудворд", image: "https://i0.wp.com/clv.h-cdn.co/assets/17/34/3200x3200/square-1503436843-paul-newman-joanne-woodward-lying-down.jpg?ssl=1" },
                    { text: "Ричард Бёртон и Элизабет Тейлор", image: "https://i.pinimg.com/736x/a8/61/73/a861737d0d55df22bba516c4b5b17bfc.jpg" },
                    { text: "Хамфри Богарт и Лорен Бэколл", image: "https://thechap.co.uk/wp-content/uploads/2024/12/bogie-betty.jpg" }
                ],
                correctIndex: 1,
            },
            {
                id: "gc2",
                text: "Эта историческая пара правили Египтом. Их любовь стала легендой. Кто они?",
                options: [
                    { text: "Клеопатра и Марк Антоний", image: "https://i.pinimg.com/736x/50/5b/38/505b38589ce4b5ea7a82cf838e57f3ac.jpg" },
                    { text: "Нефертити и Эхнатон", image: "https://img.pravda.ru/image/photo/0/6/0/237060.jpeg" },
                    { text: "Рамзес II и Нефертари", image: "https://i.pinimg.com/736x/5a/65/25/5a6525b6d311938721ecb6eba00b3296.jpg" },
                    { text: "Тутанхамон и Анхесенамон", image: "https://avatars.mds.yandex.net/i?id=906ccc5ebdb0a6797dd4109a2af812f6_l-5032983-images-thumbs&n=13" }
                ],
                correctIndex: 0,
            },
            {
                id: "gc3",
                text: "Эта пара из мира музыки поженилась в 2011 году. Он — рэпер, она — певица. О ком идёт речь?",
                options: [
                    { text: "Jay-Z и Бейонсе", image: "https://medianewsc.com/wp-content/uploads/2024/05/Jay-Z-dropped-some-bombshells-that-shook-the-foundation-of-Beyonces-career-and-ruined-years-of-Beyonces-hard-work.-So-what-exactly-did-he-say-and-what-consequences-could-his-words-have.png" },
                    { text: "Канье Уэст и Ким Кардашьян", image: "https://avatars.mds.yandex.net/i?id=93081a7b089f9ae06687f0090fe45c05_l-5232622-images-thumbs&n=13" },
                    { text: "Джастин Тимберлейк и Джессика Бил", image: "https://i.pinimg.com/736x/50/54/8c/50548c2553b9587414057457abaea825.jpg" },
                    { text: "Адам Левин и Бехати Принслу", image: "https://i.pinimg.com/736x/ae/5a/ff/ae5aff37e9e94f0cf50f17b6cf9cdea6.jpg" }
                ],
                correctIndex: 0,
            },
            {
                id: "gc4",
                text: "Эта литературная пара стала символом вечной любви. Их имена начинаются на Р и Д.",
                options: [
                    { text: "Ромео и Джульетта", image: "https://i.pinimg.com/originals/fe/43/87/fe4387769f4e68ece91799a8d0b80840.jpg" },
                    { text: "Ричард и Джулия", image: "https://media.zenfs.com/en/brit_co_650/8119b964b193fa021bf5986a5045af96" },
                    { text: "Роберт и Джулия", image: "https://media.zenfs.com/en/e__181/05969250423453e43cd1ee7a3cff8fd6" },
                    { text: "Роджер и Дженни", image: "https://www.usmagazine.com/wp-content/uploads/2018/11/jwoww-roger-mathews-3.jpg?w=1800&quality=86&strip=all" }
                ],
                correctIndex: 0,
            },
            {
                id: "gc5",
                text: "Эта пара из мира науки. Они вместе работали над исследованиями и получили Нобелевскую премию.",
                options: [
                    { text: "Пьер и Мария Кюри", image: "https://avatars.mds.yandex.net/i?id=f4a0a094b4cd981a6bae132cf44b0b32_l-4366154-images-thumbs&n=13" },
                    { text: "Альберт Эйнштейн и Милева Марич", image: "https://iknigi.net/books_files/online_html/72773/e002a.jpg" },
                    { text: "Нильс Бор и Маргарет Норлунд", image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Niels_Bohr_and_Margrethe_engaged_1910.jpg" },
                    { text: "Эрнест Резерфорд и Мэри Ньютон", image: "https://avatars.mds.yandex.net/i?id=876c819aebcf32fd2ef41891947d5748_sr-8220915-images-thumbs&n=13" }
                ],
                correctIndex: 0,
            },
        ],
    },
    "crossword": {
        title: "Романтический кроссворд",
        questions: [
            {
                id: "cw1",
                text: "Символ любви, который бьётся в груди (5 букв)",
                options: ["Сердце", "Валентинка", "Поцелуй", "Романтика"],
                correctIndex: 0,
            },
            {
                id: "cw2",
                text: "Открытка, которую дарят 14 февраля (9 букв)",
                options: ["Валентинка", "Поздравление", "Открытка", "Письмо"],
                correctIndex: 0,
            },
            {
                id: "cw3",
                text: "Бог любви в древнеримской мифологии (6 букв)",
                options: ["Купидон", "Амур", "Эрос", "Венера"],
                correctIndex: 0,
            },
            {
                id: "cw4",
                text: "Нежное прикосновение губами (7 букв)",
                options: ["Поцелуй", "Объятие", "Ласка", "Нежность"],
                correctIndex: 0,
            },
            {
                id: "cw5",
                text: "Чувство глубокой привязанности (6 букв)",
                options: ["Любовь", "Дружба", "Симпатия", "Уважение"],
                correctIndex: 0,
            },
        ],
    },
    "movie-quotes": {
        title: "Кино-валентинка",
        
        questions: [
            {
                id: "mq1",
                text: "Из какого фильма цитата: 'Ты заставляешь меня хотеть стать лучше'?",
                options: [
                    { text: "Титаник", image: "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/f50314e9-8595-4412-81de-2b1065dfe9f1/orig" },
                    { text: "Хороший доктор", image: "https://m.media-amazon.com/images/M/MV5BMTMzODgyNTc4OF5BMl5BanBnXkFtZTcwNjcwODc3Nw@@._V1_.jpg" },
                    { text: "Как я встретил вашу маму", image: "http://images-s.kinorium.com/movie/cover/347556/w1500_37698138.jpg" },
                    { text: "Ла-Ла Ленд", image: "https://i.pinimg.com/originals/19/66/16/196616d275f06acd2193cc4f2b17c36c.jpg" }
                ],
                correctIndex: 1,
            },
            {
                id: "mq2",
                text: "Из какого фильма цитата: 'Любовь означает никогда не просить прощения'?",
                options: [
                    { text: "История любви", image: "http://images-s.kinorium.com/movie/poster/61599/w1500_50586482.jpg" },
                    { text: "Виноваты звёзды", image: "https://static.kinoafisha.info/k/movie_posters/1920x1080/upload/movie_posters/7/4/0/8162047/6697288aaa876f4cbf2c55c7d72437e6.jpg" },
                    { text: "Дневник памяти", image: "https://s1.afisha.ru/mediastorage/f4/2d/d8ae14730f1f4d69b8f8dfa92df4.jpg" },
                    { text: "Ромео и Джульетта", image: "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/romeo_and_juliet_1968.png" }
                ],
                correctIndex: 0,
            },
            {
                id: "mq3",
                text: "Из какого фильма цитата: 'Я хочу, чтобы ты знала, что ты лучшая вещь, которая когда-либо случалась со мной'?",
                options: [
                    { text: "До встречи с тобой", image: "https://static10.labirint.ru/books/553753/cover.jpg" },
                    { text: "Виноваты звёзды", image: "https://static.kinoafisha.info/k/movie_posters/1920x1080/upload/movie_posters/7/4/0/8162047/6697288aaa876f4cbf2c55c7d72437e6.jpg" },
                    { text: "Дневник памяти", image: "https://s1.afisha.ru/mediastorage/f4/2d/d8ae14730f1f4d69b8f8dfa92df4.jpg" },
                    { text: "Титаник", image: "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/f50314e9-8595-4412-81de-2b1065dfe9f1/orig" }
                ],
                correctIndex: 0,
            },
            {
                id: "mq4",
                text: "Из какого фильма цитата: 'Я никогда не хотел никого так сильно, как хочу тебя'?",
                options: [
                    { text: "Сумерки", image: "https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_.jpg" },
                    { text: "50 оттенков серого", image: "https://cdn1.ozone.ru/multimedia/1012454283.jpg" },
                    { text: "Дневник Бриджит Джонс", image: "https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/84e2a326-ab07-48ba-90de-c2b695abf172/1920x" },
                    { text: "Дневник памяти", image: "https://s1.afisha.ru/mediastorage/f4/2d/d8ae14730f1f4d69b8f8dfa92df4.jpg" }
                ],
                correctIndex: 3,
            },
            {
                id: "mq5",
                text: "Из какого фильма цитата: 'Ты заставляешь меня хотеть быть хорошим человеком'?",
                options: [
                    { text: "Хороший доктор", image: "https://m.media-amazon.com/images/M/MV5BMTMzODgyNTc4OF5BMl5BanBnXkFtZTcwNjcwODc3Nw@@._V1_.jpg" },
                    { text: "Дневник памяти", image: "https://s1.afisha.ru/mediastorage/f4/2d/d8ae14730f1f4d69b8f8dfa92df4.jpg" },
                    { text: "Ла-Ла Ленд", image: "https://i.pinimg.com/originals/19/66/16/196616d275f06acd2193cc4f2b17c36c.jpg" },
                    { text: "Виноваты звёзды", image: "https://static.kinoafisha.info/k/movie_posters/1920x1080/upload/movie_posters/7/4/0/8162047/6697288aaa876f4cbf2c55c7d72437e6.jpg" }
                ],
                correctIndex: 0,
            },
        ], 
    },
    "riddles": {
        title: "Сердечные загадки",
        questions: [
            {
                id: "rd1",
                text: "Что летает в воздухе в День всех влюблённых?",
                options: ["Сердечки", "Бабочки", "Воздушные шары", "Конфетти"],
                correctIndex: 0,
            },
            {
                id: "rd2",
                text: "Что дарят в День святого Валентина, чтобы показать свои чувства?",
                options: ["Валентинку", "Подарок", "Цветы", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "rd3",
                text: "Какой цвет традиционно ассоциируется с Днём святого Валентина?",
                options: ["Красный", "Розовый", "Оба варианта", "Белый"],
                correctIndex: 2,
            },
            {
                id: "rd4",
                text: "Что символизирует стрела Купидона?",
                options: ["Любовь с первого взгляда", "Влюблённость", "Романтические чувства", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "rd5",
                text: "Какой цветок чаще всего дарят в День святого Валентина?",
                options: ["Роза", "Тюльпан", "Хризантема", "Гвоздика"],
                correctIndex: 0,
            },
        ],
    },
    "love-history": {
        title: "История любви",
        questions: [
            {
                id: "lh1",
                text: "Кто были главные герои самой известной истории любви в литературе, написанной Шекспиром?",
                options: ["Ромео и Джульетта", "Отелло и Дездемона", "Антоний и Клеопатра", "Петруччо и Катарина"],
                correctIndex: 0,
            },
            {
                id: "lh2",
                text: "Какая пара из истории стала символом трагической любви в России?",
                options: ["Пётр I и Екатерина I", "Павел I и Мария Фёдоровна", "Николай II и Александра Фёдоровна", "Александр II и Екатерина Долгорукова"],
                correctIndex: 2,
            },
            {
                id: "lh3",
                text: "Какая пара из мира искусства создала знаменитую картину 'Поцелуй'?",
                options: ["Густав Климт и Эмилия Флёге", "Пьер Огюст Ренуар и Алина Шариго", "Пабло Пикассо и Франсуаза Жило", "Сальвадор Дали и Гала"],
                correctIndex: 0,
            },
            {
                id: "lh4",
                text: "Какая пара из истории стала символом вечной любви благодаря письмам?",
                options: ["Абельар и Элоиза", "Наполеон и Жозефина", "Виктор Гюго и Адель Фуше", "Джон Адамс и Абигейл Адамс"],
                correctIndex: 1,
            },
            {
                id: "lh5",
                text: "Какая пара из мира музыки создала знаменитую оперу 'Тристан и Изольда'?",
                options: ["Рихард Вагнер и Матильда Везендонк", "Джузеппе Верди и Джузеппина Стреппони", "Пётр Чайковский и Надежда фон Мекк", "Вольфганг Амадей Моцарт и Констанция Вебер"],
                correctIndex: 0,
            },
        ],
    },
    "valentine-test": {
        title: "Валентинов тест",
        questions: [
            {
                id: "vt1",
                text: "В какой стране День святого Валентина отмечают как день дружбы?",
                options: ["Финляндия", "Япония", "Мексика", "Бразилия"],
                correctIndex: 0,
            },
            {
                id: "vt2",
                text: "Когда впервые появились валентинки?",
                options: ["XIV век", "XV век", "XVI век", "XVII век"],
                correctIndex: 1,
            },
            {
                id: "vt3",
                text: "Какой цветок традиционно дарят в День святого Валентина в Японии?",
                options: ["Роза", "Хризантема", "Сакура", "Орхидея"],
                correctIndex: 0,
            },
            {
                id: "vt4",
                text: "В какой стране День святого Валентина запрещён?",
                options: ["Саудовская Аравия", "Иран", "Пакистан", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "vt5",
                text: "Сколько валентинок отправляется ежегодно в США?",
                options: ["Около 1 миллиарда", "Около 500 миллионов", "Около 2 миллиардов", "Около 150 миллионов"],
                correctIndex: 0,
            },
        ],
    },
    "music": {
        title: "Музыкальный романс",
        questions: [
            {
                id: "ms1",
                text: "Кто исполнил песню 'My Heart Will Go On' из фильма 'Титаник'?",
                options: ["Селин Дион", "Уитни Хьюстон", "Мariah Carey", "Барбра Стрейзанд"],
                correctIndex: 0,
            },
            {
                id: "ms2",
                text: "Из какой песни цитата: 'I will always love you'?",
                options: ["I Will Always Love You - Уитни Хьюстон", "Endless Love - Лайонел Ричи", "Unchained Melody - The Righteous Brothers", "Can't Help Falling in Love - Элвис Пресли"],
                correctIndex: 0,
            },
            {
                id: "ms3",
                text: "Кто исполнил песню 'At Last'?",
                options: ["Этта Джеймс", "Арета Франклин", "Билли Холидей", "Элла Фицджеральд"],
                correctIndex: 0,
            },
            {
                id: "ms4",
                text: "Из какой песни цитата: 'I just called to say I love you'?",
                options: ["I Just Called to Say I Love You - Стиви Уандер", "Endless Love - Лайонел Ричи", "All of Me - Джон Ледженд", "Perfect - Эд Ширан"],
                correctIndex: 0,
            },
            {
                id: "ms5",
                text: "Кто исполнил песню 'All of Me'?",
                options: ["Джон Ледженд", "Бруно Марс", "Эд Ширан", "Джастин Тимберлейк"],
                correctIndex: 0,
            },
        ],
    },
    "culinary": {
        title: "Кулинарный вызов",
        questions: [
            {
                id: "cl1",
                text: "Какой десерт традиционно готовят на День святого Валентина?",
                options: ["Шоколадный торт", "Клубничный торт", "Красный бархатный торт", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "cl2",
                text: "Какой шоколад чаще всего дарят в День святого Валентина?",
                options: ["Тёмный шоколад", "Молочный шоколад", "Белый шоколад", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "cl3",
                text: "Какое блюдо традиционно готовят на романтический ужин?",
                options: ["Стейк", "Паста", "Рыба", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "cl4",
                text: "Какой напиток традиционно пьют на День святого Валентина?",
                options: ["Шампанское", "Красное вино", "Коктейли", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "cl5",
                text: "Какие конфеты традиционно дарят в День святого Валентина?",
                options: ["Шоколадные конфеты", "Мармеладные сердечки", "Карамель", "Все варианты верны"],
                correctIndex: 3,
            },
        ],
    },
    "literature": {
        title: "Литературная любовь",
        questions: [
            {
                id: "lt1",
                text: "Кто написал роман 'Гордость и предубеждение'?",
                options: ["Джейн Остин", "Шарлотта Бронте", "Эмили Бронте", "Джордж Элиот"],
                correctIndex: 0,
            },
            {
                id: "lt2",
                text: "Из какого произведения цитата: 'Любовь — это когда ты хочешь переживать все эмоции сразу, вечно'?",
                options: ["Великий Гэтсби", "Над пропастью во ржи", "Унесённые ветром", "Гордость и предубеждение"],
                correctIndex: 2,
            },
            {
                id: "lt3",
                text: "Кто написал стихотворение 'Я помню чудное мгновенье'?",
                options: ["Александр Пушкин", "Михаил Лермонтов", "Сергей Есенин", "Владимир Маяковский"],
                correctIndex: 0,
            },
            {
                id: "lt4",
                text: "Из какого произведения цитата: 'Любовь — это когда счастье другого человека важнее твоего собственного'?",
                options: ["Унесённые ветром", "Гордость и предубеждение", "Джейн Эйр", "Великий Гэтсби"],
                correctIndex: 0,
            },
            {
                id: "lt5",
                text: "Кто написал роман 'Джейн Эйр'?",
                options: ["Шарлотта Бронте", "Джейн Остин", "Эмили Бронте", "Джордж Элиот"],
                correctIndex: 0,
            },
        ],
    },
    "symbols": {
        title: "Символы любви",
        questions: [
            {
                id: "sy1",
                text: "Что символизирует красная роза?",
                options: ["Страстную любовь", "Дружбу", "Уважение", "Благодарность"],
                correctIndex: 0,
            },
            {
                id: "sy2",
                text: "Что символизирует сердце?",
                options: ["Любовь и эмоции", "Жизнь", "Душа", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "sy3",
                text: "Что символизирует стрела Купидона?",
                options: ["Влюблённость", "Любовь с первого взгляда", "Романтические чувства", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "sy4",
                text: "Что символизирует кольцо?",
                options: ["Вечную любовь", "Обязательства", "Единство", "Все варианты верны"],
                correctIndex: 3,
            },
            {
                id: "sy5",
                text: "Что символизирует голубь?",
                options: ["Мир и любовь", "Верность", "Невинность", "Все варианты верны"],
                correctIndex: 3,
            },
        ],
    },
};

function setupValentineQuizzes() {
    const grid = document.querySelector(".valentine-quizzes-grid");
    const activeQuizContainer = document.getElementById("activeValentineQuiz");
    if (!grid || !activeQuizContainer) return;

    grid.querySelectorAll(".valentine-quiz-card").forEach((card) => {
        card.addEventListener("click", () => {
            const quizKey = card.dataset.quiz;
            startValentineQuiz(quizKey);
        });
    });
}

function startValentineQuiz(quizKey) {
    const quiz = VALENTINE_QUIZZES[quizKey];
    if (!quiz) return;

    const grid = document.querySelector(".valentine-quizzes-grid");
    const activeQuizContainer = document.getElementById("activeValentineQuiz");
    if (!grid || !activeQuizContainer) return;

    grid.classList.add("hidden");
    activeQuizContainer.classList.remove("hidden");

    let currentQuestion = 0;
    let score = 0;
    const userAnswers = [];

    function renderQuestion() {
        if (currentQuestion >= quiz.questions.length) {
            showValentineResult();
            return;
        }

        const q = quiz.questions[currentQuestion];
        activeQuizContainer.innerHTML = `
            <div class="valentine-quiz-active">
                <div class="valentine-quiz-header">
                    <h3>${quiz.title}</h3>
                    <p>Вопрос ${currentQuestion + 1} из ${quiz.questions.length}</p>
                    <button class="btn btn-ghost btn-sm" id="backToValentineGrid">← Назад к списку</button>
                </div>
                <form id="valentineQuizForm" class="quiz-form">
                    <div class="question-card">
                        <p class="question-title">${q.text}</p>
                        <div class="question-options">
                            ${q.options.map((opt, idx) => {
                                const isOptionWithImage = typeof opt === "object" && opt.text;
                                const optText = isOptionWithImage ? opt.text : opt;
                                const optImage = isOptionWithImage ? opt.image : null;
                                
                                return `
                                    <label class="option-chip ${optImage ? 'option-with-image' : ''}">
                                        ${optImage ? `<div class="option-image-wrapper"><img src="${optImage}" alt="${optText}" class="option-image" /></div>` : ''}
                                        <input type="radio" name="answer" value="${idx}" required />
                                        <span class="option-dot"></span>
                                        <span>${optText}</span>
                                    </label>
                                `;
                            }).join("")}
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-glow wide">
                        ${currentQuestion === quiz.questions.length - 1 ? "Завершить викторину" : "Следующий вопрос"}
                    </button>
                </form>
            </div>
        `;

        const form = document.getElementById("valentineQuizForm");
        const backBtn = document.getElementById("backToValentineGrid");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const selected = form.querySelector('input[name="answer"]:checked');
            if (!selected) return;

            const answerIndex = parseInt(selected.value);
            userAnswers.push(answerIndex);
            if (answerIndex === q.correctIndex) {
                score++;
            }

            currentQuestion++;
            renderQuestion();
        });

        backBtn.addEventListener("click", () => {
            grid.classList.remove("hidden");
            activeQuizContainer.classList.add("hidden");
            activeQuizContainer.innerHTML = "";
        });

        // Добавить обработчики для клика по чипам
        form.querySelectorAll(".option-chip").forEach((chip) => {
            chip.addEventListener("click", (e) => {
                e.preventDefault();
                form.querySelectorAll(".option-chip").forEach((c) => c.classList.remove("selected"));
                chip.classList.add("selected");
                const input = chip.querySelector("input");
                if (input) {
                    input.checked = true;
                }
            });
        });
    }

    function showValentineResult() {
        const percent = Math.round((score / quiz.questions.length) * 100);
        let message;
        if (percent >= 80) {
            message = "Отличный результат! Вы настоящий эксперт в романтических вопросах!";
        } else if (percent >= 60) {
            message = "Хороший результат! Вы знаете много о любви и романтике.";
        } else {
            message = "Не расстраивайтесь! Любовь — это не только знания, но и чувства.";
        }

        activeQuizContainer.innerHTML = `
            <div class="valentine-quiz-result">
                <div class="result-layout">
                    <div class="result-text">
                        <div class="score">${percent}%</div>
                        <p><strong>Ваш результат: ${score} из ${quiz.questions.length}</strong></p>
                        <p>${message}</p>
                    </div>
                </div>
                <button class="btn btn-primary btn-glow wide" id="restartValentineQuiz">Пройти ещё раз</button>
                <button class="btn btn-ghost wide" id="backToValentineGrid2">← Назад к списку викторин</button>
            </div>
        `;

        document.getElementById("restartValentineQuiz").addEventListener("click", () => {
            currentQuestion = 0;
            score = 0;
            userAnswers.length = 0;
            renderQuestion();
        });

        document.getElementById("backToValentineGrid2").addEventListener("click", () => {
            grid.classList.remove("hidden");
            activeQuizContainer.classList.add("hidden");
            activeQuizContainer.innerHTML = "";
        });
    }

    renderQuestion();
}

// --- КОНСТРУКТОР ВИКТОРИН ---

function setupConstructor() {
    const form = document.getElementById("constructorForm");
    const addQuestionBtn = document.getElementById("addQuestionBtn");
    const questionsContainer = document.getElementById("questionsContainer");
    let questionCounter = 0;
    let quizType = "couple";  // По умолчанию парная

    if (!form || !addQuestionBtn || !questionsContainer) return;

    // Если есть поле выбора типа викторины, добавим обработчик
    const quizTypeSelect = form.querySelector('select[name="quizType"]');
    if (quizTypeSelect) {
        quizTypeSelect.addEventListener("change", (e) => {
            quizType = e.target.value;
            // Обновляем все вопросы для отображения/скрытия правильного ответа
            document.querySelectorAll(".question-editor").forEach((q) => {
                updateQuestionEditorForType(q, quizType);
            });
        });
        quizType = quizTypeSelect.value || "couple";
    }

    addQuestionBtn.addEventListener("click", () => {
        questionCounter++;
        const questionDiv = createQuestionEditor(questionCounter, quizType);
        questionsContainer.appendChild(questionDiv);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const title = formData.get("title")?.trim();
        if (!title) {
            alert("Введите название викторины");
            return;
        }

        const questions = [];
        const questionDivs = questionsContainer.querySelectorAll(".question-editor");
        
        for (const div of questionDivs) {
            const qText = div.querySelector(".question-text-input")?.value?.trim();
            const options = [];
            let correctIndex = -1;

            const optionRows = div.querySelectorAll(".option-editor-row");
            optionRows.forEach((row, index) => {
                const input = row.querySelector(".option-input");
                const opt = input?.value?.trim();
                if (opt) {
                    options.push(opt);
                }
                // Проверяем, отмечен ли этот ответ как правильный
                const correctCheckbox = row.querySelector(".correct-option-checkbox");
                if (correctCheckbox && correctCheckbox.checked) {
                    correctIndex = options.length - 1;
                }
            });

            if (qText && options.length >= 2) {
                const questionData = {
                    id: `q${div.dataset.questionId}`,
                    text: qText,
                    options: options,
                };

                // Если это викторина с правильными ответами, сохраняем правильный ответ
                if (quizType === "answers") {
                    if (correctIndex === -1) {
                        alert(`Пожалуйста, выберите правильный ответ для вопроса: "${qText}"`);
                        return;
                    }
                    questionData.correctIndex = correctIndex;
                }

                // Проверяем, есть ли загруженное изображение
                const imageInput = div.querySelector(".question-image-input");
                if (imageInput && imageInput.files.length > 0) {
                    const imageFile = imageInput.files[0];
                    const imgFormData = new FormData();
                    imgFormData.append("file", imageFile);
                    
                    try {
                        const response = await fetch("/api/upload-quiz-image", {
                            method: "POST",
                            body: imgFormData
                        });
                        const data = await response.json();
                        if (data.success) {
                            questionData.image = data.url;
                        }
                    } catch (err) {
                        console.error("Ошибка при загрузке изображения:", err);
                    }
                }

                questions.push(questionData);
            }
        }

        if (questions.length === 0) {
            alert("Добавьте хотя бы один вопрос с минимум 2 вариантами ответа");
            return;
        }

        const quiz = {
            id: Date.now().toString(),
            title: title,
            type: quizType,
            questions: questions,
            createdAt: new Date().toISOString(),
        };

        saveQuiz(quiz);
        form.reset();
        questionsContainer.innerHTML = "";
        questionCounter = 0;
        quizType = "couple";
        loadSavedQuizzes();
        alert("Викторина сохранена! Теперь вы можете пройти её в разделе 'Мои викторины'.");
    });

    // Добавить первый вопрос по умолчанию
    addQuestionBtn.click();
}

function updateQuestionEditorForType(questionDiv, type) {
    const optionRows = questionDiv.querySelectorAll(".option-editor-row");
    optionRows.forEach((row) => {
        const checkbox = row.querySelector(".correct-option-checkbox");
        if (type === "answers") {
            if (!checkbox) {
                const label = document.createElement("label");
                label.className = "correct-option-label";
                label.innerHTML = `
                    <input type="radio" name="correct-${questionDiv.dataset.questionId}" class="correct-option-checkbox" />
                    <span>✓ Правильный</span>
                `;
                row.appendChild(label);
            } else {
                checkbox.closest(".correct-option-label").style.display = "flex";
            }
        } else {
            if (checkbox) {
                checkbox.closest(".correct-option-label").style.display = "none";
            }
        }
    });
}

function createQuestionEditor(id, quizType = "couple") {
    const div = document.createElement("div");
    div.className = "question-editor";
    div.dataset.questionId = id;

    div.innerHTML = `
        <div class="question-editor-header">
            <h4>Вопрос ${id}</h4>
            <button type="button" class="btn-remove-question">✕</button>
        </div>
        <div class="field">
            <label>Текст вопроса</label>
            <input type="text" class="question-text-input" placeholder="Введите вопрос" required />
        </div>
        <div class="field">
            <label>Изображение для вопроса (опционально)</label>
            <div class="image-upload-area">
                <input type="file" class="question-image-input" accept="image/*" />
                <div class="image-preview"></div>
            </div>
        </div>
        <div class="options-editor">
            <label>Варианты ответов</label>
            <div class="options-list"></div>
            <button type="button" class="btn-add-option">+ Добавить вариант</button>
        </div>
    `;

    const removeBtn = div.querySelector(".btn-remove-question");
    removeBtn.addEventListener("click", () => {
        div.remove();
    });

    const imageInput = div.querySelector(".question-image-input");
    const imagePreview = div.querySelector(".image-preview");
    
    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px;" />`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = "";
        }
    });

    const addOptionBtn = div.querySelector(".btn-add-option");
    const optionsList = div.querySelector(".options-list");
    let optionCounter = 0;

    function addOption() {
        optionCounter++;
        const optionDiv = document.createElement("div");
        optionDiv.className = "option-editor-row";
        
        let html = `
            <input type="text" class="option-input" placeholder="Вариант ответа" required />
            <button type="button" class="btn-remove-option">✕</button>
        `;

        if (quizType === "answers") {
            html = `
                <input type="text" class="option-input" placeholder="Вариант ответа" required />
                <label class="correct-option-label">
                    <input type="radio" name="correct-${id}" class="correct-option-checkbox" />
                    <span>✓ Правильный</span>
                </label>
                <button type="button" class="btn-remove-option">✕</button>
            `;
        }

        optionDiv.innerHTML = html;
        
        const removeOptionBtn = optionDiv.querySelector(".btn-remove-option");
        removeOptionBtn.addEventListener("click", () => {
            optionDiv.remove();
        });
        optionsList.appendChild(optionDiv);
    }

    addOptionBtn.addEventListener("click", addOption);
    // Добавить 2 варианта по умолчанию
    addOption();
    addOption();

    return div;
}

function saveQuiz(quiz) {
    const saved = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
    saved.push(quiz);
    localStorage.setItem("customQuizzes", JSON.stringify(saved));
}

function loadSavedQuizzes() {
    const container = document.getElementById("quizzesList");
    if (!container) return;

    const saved = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
    container.innerHTML = "";

    if (saved.length === 0) {
        container.innerHTML = "<p>Пока нет сохранённых викторин</p>";
        return;
    }

    saved.forEach((quiz) => {
        const quizCard = document.createElement("div");
        quizCard.className = "quiz-card";
        quizCard.innerHTML = `
            <h4>${quiz.title}</h4>
            <p>Вопросов: ${quiz.questions.length}</p>
            <div class="quiz-card-actions">
                <button class="btn btn-primary btn-sm" data-quiz-id="${quiz.id}">Пройти</button>
                <button class="btn btn-ghost btn-sm" data-quiz-id="${quiz.id}" data-action="delete">Удалить</button>
            </div>
        `;

        const passBtn = quizCard.querySelector('[data-action]:not([data-action="delete"])');
        const deleteBtn = quizCard.querySelector('[data-action="delete"]');

        passBtn.addEventListener("click", () => {
            startCustomQuiz(quiz);
        });

        deleteBtn.addEventListener("click", () => {
            if (confirm("Удалить эту викторину?")) {
                deleteQuiz(quiz.id);
                loadSavedQuizzes();
            }
        });

        container.appendChild(quizCard);
    });
}

function deleteQuiz(quizId) {
    const saved = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
    const filtered = saved.filter((q) => q.id !== quizId);
    localStorage.setItem("customQuizzes", JSON.stringify(filtered));
}

function startCustomQuiz(quiz) {
    // Переключиться на вкладку совместимости и использовать кастомные вопросы
    // Это можно расширить, создав отдельную секцию для кастомных викторин
    alert(`Викторина "${quiz.title}" будет доступна в следующей версии! Пока используйте стандартные викторины.`);
}

// --- Общие функции ---

function renderQuestions(questions, container) {
    questions.forEach((q, qIndex) => {
        const card = document.createElement("div");
        card.className = "question-card";

        const title = document.createElement("p");
        title.className = "question-title";
        title.textContent = `${qIndex + 1}. ${q.text}`;
        card.appendChild(title);

        // Добавляем изображение вопроса, если оно есть
        if (q.image) {
            const img = document.createElement("img");
            img.src = q.image;
            img.alt = q.text;
            img.className = "question-image";
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            img.style.marginBottom = "12px";
            card.appendChild(img);
        }

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "question-options";

        q.options.forEach((opt, index) => {
            // Проверяем, является ли опция объектом с текстом и изображением
            const isOptionWithImage = typeof opt === "object" && opt.text;
            const optText = isOptionWithImage ? opt.text : opt;
            const optImage = isOptionWithImage ? opt.image : null;

            const id = `${q.id}_${index}`;
            const label = document.createElement("label");
            label.className = "option-chip";
            label.setAttribute("data-question", q.id);
            label.setAttribute("data-index", index.toString());

            const input = document.createElement("input");
            input.type = "radio";
            input.name = q.id;
            input.id = id;
            input.value = index.toString();

            const dot = document.createElement("span");
            dot.className = "option-dot";

            const text = document.createElement("span");
            text.textContent = optText;

            // Если есть изображение для опции, добавляем его ПЕРВЫМ
            if (optImage) {
                const imgWrapper = document.createElement("div");
                imgWrapper.className = "option-image-wrapper";
                const img = document.createElement("img");
                img.src = optImage;
                img.alt = optText;
                img.className = "option-image";
                imgWrapper.appendChild(img);
                label.appendChild(imgWrapper);
                label.classList.add("option-with-image");
            }

            label.appendChild(input);
            label.appendChild(dot);
            label.appendChild(text);

            label.addEventListener("click", () => {
                document
                    .querySelectorAll(`.option-chip[data-question="${q.id}"]`)
                    .forEach((chip) => chip.classList.remove("selected"));
                label.classList.add("selected");
            });

            optionsWrap.appendChild(label);
        });

        card.appendChild(optionsWrap);
        container.appendChild(card);
    });
}

function getAnswersFromForm(form, questions) {
    const formData = new FormData(form);
    const answers = {};
    questions.forEach((q) => {
        const value = formData.get(q.id);
        if (value !== null) {
            answers[q.id] = parseInt(value);
        }
    });
    return answers;
}
// --- ПАРНЫЕ ВИКТОРИНЫ ---

const COUPLE_QUIZZES = {
    compatibility: {
        title: "Тест совместимости",
        description: "Классический тест для пар",
        questions: [
            {
                id: "cp1",
                text: "Какой идеальный вечер для вас двоих?",
                options: ["Фильм под пледом", "Совместное путешествие", "Ужин при свечах", "Настольные игры"]
            },
            {
                id: "cp2",
                text: "Как вы проводите выходные?",
                options: ["Дома вместе", "На природе", "В путешествиях", "На встречах с друзьями"]
            },
            {
                id: "cp3",
                text: "Что вам нравится больше всего в партнёре?",
                options: ["Чувство юмора", "Надёжность", "Амбициозность", "Чуткость"]
            },
            {
                id: "cp4",
                text: "Как часто вы хотите проводить время в одиночестве?",
                options: ["Редко", "Иногда", "Часто", "Ежедневно"]
            },
            {
                id: "cp5",
                text: "Как вы справляетесь со стрессом?",
                options: ["Говорю с партнёром", "Остаюсь один", "Занимаюсь спортом", "Ищу отвлечение"]
            },
            {
                id: "cp6",
                text: "Какую роль играет романтика в вашей жизни?",
                options: ["Очень важну", "Важную", "Немного важну", "Не очень важну"]
            },
            {
                id: "cp7",
                text: "Как часто вы планируете будущее вместе?",
                options: ["Всегда", "Часто", "Иногда", "Редко"]
            },
            {
                id: "cp8",
                text: "Какой стиль питания вас более привлекает?",
                options: ["Везде пробовать", "Предпочитаю привычное", "Экспериментирую дома", "Не люблю готовить"]
            },
            {
                id: "cp9",
                text: "Как вы относитесь к путешествиям?",
                options: ["Люблю часто путешествовать", "Любить, но планировать заранее", "Редко путешествую", "Предпочитаю дома"]
            },
            {
                id: "cp10",
                text: "Какой музыкальный жанр вам нравится?",
                options: ["Поп", "Рок", "Классика", "Все варианты"]
            },
            {
                id: "cp11",
                text: "Как вы реагируете на конфликты?",
                options: ["Сразу обсуждаем", "Берём время на размышление", "Избегаем конфликта", "Один говорит, другой слушает"]
            },
            {
                id: "cp12",
                text: "Какой уровень физической активности вам подходит?",
                options: ["Высокий (спорт каждый день)", "Средний (регулярно)", "Низкий (иногда)", "Минимальный"]
            },
            {
                id: "cp13",
                text: "Что для вас главное в отношениях?",
                options: ["Взаимное доверие", "Общие интересы", "Физическая привлекательность", "Финансовая стабильность"]
            },
            {
                id: "cp14",
                text: "Как часто вы хотите видеть друзей друг друга?",
                options: ["Часто (еженедельно)", "Регулярно (раз в месяц)", "Иногда", "Редко"]
            },
            {
                id: "cp15",
                text: "Как вы видите свое будущее через 5 лет?",
                options: ["Жизнь вместе", "Вдвоём, но в своих домах", "Возможно разные пути", "Не планирую так далеко"]
            }
        ]
    },
    preferences: {
        title: "Предпочтения и мечты",
        description: "Узнайте, совпадают ли ваши мечты",
        questions: [
            {
                id: "pf1",
                text: "Где бы вы хотели жить?",
                options: ["Большой город", "Маленький город", "За городом", "Постоянно путешествовать"]
            },
            {
                id: "pf2",
                text: "Какая работа вас идеально устроит?",
                options: ["Карьера на первом месте", "Баланс между работой и жизнью", "Творческая работа", "Просто любимое дело"]
            },
            {
                id: "pf3",
                text: "Дети в будущем?",
                options: ["Да, несколько", "Да, один-двое", "Возможно", "Нет"]
            },
            {
                id: "pf4",
                text: "Как вы видите идеальный выпускной день?",
                options: ["Романтичный", "Весёлый с друзьями", "Спокойный и интимный", "Щедро и дорого"]
            },
            {
                id: "pf5",
                text: "Какой образ жизни привлекает вас больше?",
                options: ["Стабильный и предсказуемый", "Авантюрный", "Смешанный", "Нестандартный"]
            },
            {
                id: "pf6",
                text: "Творчество в вашей жизни — это?",
                options: ["Главное", "Важно", "Немного нужно", "Не очень"]
            },
            {
                id: "pf7",
                text: "Как бы вы хотели проводить отпуск?",
                options: ["На море", "В горах", "Культурный туризм", "Дома"]
            },
            {
                id: "pf8",
                text: "Материальное благополучие для вас это?",
                options: ["Главное", "Важно", "Полезно", "Не главное"]
            },
            {
                id: "pf9",
                text: "Как вы относитесь к благотворительности?",
                options: ["Активно помогаем", "Помогаем иногда", "Редко", "Не помогаем"]
            },
            {
                id: "pf10",
                text: "Какойторый образование для вас важно?",
                options: ["Очень важно учиться", "Профессиональное образование", "Жизненный опыт важнее", "Не очень важно"]
            },
            {
                id: "pf11",
                text: "Мечта номер один на ближайшие 5 лет?",
                options: ["Найти вторую половину", "Профессиональный рост", "Путешествие", "Свой дом"]
            },
            {
                id: "pf12",
                text: "Как вы хотите отметить годовщину?",
                options: ["Путешествие", "Скромно и интимно", "Вечеринка с друзьями", "Подарок"]
            }
        ]
    },
    "love-languages": {
        title: "Языки любви",
        description: "Как вы выражаете чувства",
        questions: [
            {
                id: "ll1",
                text: "Как вы предпочитаете выражать любовь?",
                options: ["Словами и комплиментами", "Делами и помощью", "Подарками", "Физическим близостью"]
            },
            {
                id: "ll2",
                text: "Как вы принимаете выражение любви?",
                options: ["Хочу слышать слова", "Хочу конкретные действия", "Хочу получать подарки", "Хочу сигн ко внимание"]
            },
            {
                id: "ll3",
                text: "Как часто вы хотите говорить о чувствах?",
                options: ["Каждый день", "Часто", "Иногда", "Редко"]
            },
            {
                id: "ll4",
                text: "Какой жест любви вас больше всего трогает?",
                options: ["Неожиданный завтрак в кровать", "Помощь в трудный момент", "Красивое украшение", "Долгий взгляд"]
            },
            {
                id: "ll5",
                text: "Как вы относитесь к демонстрации чувств публично?",
                options: ["Люблю", "Нормально", "Не особо", "Стесняюсь"]
            },
            {
                id: "ll6",
                text: "Какую роль играют прикосновения в вашей жизни?",
                options: ["Очень важны", "Важны", "Нормально", "Не особо важны"]
            },
            {
                id: "ll7",
                text: "Какой подарок вас больше порадует?",
                options: ["Тот, который я хотела", "Сделанный своими руками", "Любой, главное — внимание", "Не люблю подарки"]
            },
            {
                id: "ll8",
                text: "Как вы выражаете поддержку?",
                options: ["Слушаю и советую", "Помогаю делом", "Обнимаю", "Дарю что-то ценное"]
            },
            {
                id: "ll9",
                text: "Какой комплимент вас больше всего радует?",
                options: ["О внешности", "Об интеллекте", "О характере", "О том, как я люблю"]
            },
            {
                id: "ll10",
                text: "Как вы отмечаете значимые даты?",
                options: ["Организую сюрприз", "Готовлю ужин", "Дарю подарок", "Просто даю понять, что люблю"]
            }
        ]
    },
    adventure: {
        title: "Приключения и путешествия",
        description: "Как вы видите совместные приключения",
        questions: [
            {
                id: "av1",
                text: "Какой стиль путешествия вам нравится?",
                options: ["Спонтанные приключения", "Хорошо спланированные маршруты", "Комфортный отдых", "Экстремальные виды спорта"]
            },
            {
                id: "av2",
                text: "Как часто вы хотели бы путешествовать?",
                options: ["Каждый месяц", "Несколько раз в год", "Раз в год", "Редко"]
            },
            {
                id: "av3",
                text: "Лучше путешествовать?",
                options: ["На машине", "На самолёте", "На поезде", "Пешком/велосипедом"]
            },
            {
                id: "av4",
                text: "Где вам нравится отдыхать?",
                options: ["На море", "В горах", "За городом", "В другой стране"]
            },
            {
                id: "av5",
                text: "Как вы относитесь к рискованным развлечениям?",
                options: ["Люблю риск", "Нормально", "Предпочитаю безопасность", "Выбираю спокойствие"]
            },
            {
                id: "av6",
                text: "Какой продолжительности отпуск идеален?",
                options: ["2 недели", "1 неделя", "Выходные", "Месячный отпуск"]
            },
            {
                id: "av7",
                text: "Путешествовать с рюкзаком или с комфортом?",
                options: ["Рюкзак и хостелы", "Среднее", "Отели и хорошие условия", "Люкс и спа"]
            },
            {
                id: "av8",
                text: "Новые впечатления или привычные места?",
                options: ["Всегда новое", "Иногда новое", "Часто знакомые места", "Люблю повторять"]
            },
            {
                id: "av9",
                text: "Экскурсии и достопримечательности?",
                options: ["Много видеть", "Пару достопримечательностей", "Минимум", "Просто гулять"]
            },
            {
                id: "av10",
                text: "Путешествовать с друзьями или вдвоём?",
                options: ["Только вдвоём", "Лучше вдвоём", "Нормально с друзьями", "Люблю группы"]
            },
            {
                id: "av11",
                text: "Какой бюджет на путешествие?",
                options: ["Экономный", "Средний", "Щедрый", "Не ограничиваю"]
            },
            {
                id: "av12",
                text: "Какое приключение вы мечтали бы сделать?",
                options: ["Прыжок с парашютом", "Дайвинг", "Поход в горы", "Круиз по миру"]
            }
        ]
    }
};

function setupCoupleQuizzes() {
    const isCoupleQuizPage = document.querySelector(".couple-quiz-wrapper") !== null;
    if (!isCoupleQuizPage) return;

    const menu = document.getElementById("coupleQuizMenu");
    const partner1Screen = document.getElementById("partner1Screen");
    const partner2Screen = document.getElementById("partner2Screen");
    const resultsScreen = document.getElementById("resultsScreen");

    // Загрузить пользовательские викторины
    loadCoupleCustomQuizzes();

    // Добавить обработчик для выбора встроенных викторин
    document.querySelectorAll(".couple-quiz-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            const quizKey = card.dataset.quizKey;
            if (quizKey) {
                startCoupleQuiz(COUPLE_QUIZZES[quizKey], quizKey);
            }
        });
    });
}

function loadCoupleCustomQuizzes() {
    const container = document.getElementById("customCoupleQuizzesList");
    if (!container) return;

    const saved = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
    container.innerHTML = "";

    if (saved.length === 0) {
        container.innerHTML = "<p style='text-align: center; color: #aaa;'>Ваши викторины появятся здесь</p>";
        return;
    }

    saved.forEach((quiz) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "couple-quiz-card";
        btn.innerHTML = `
            <span class="quiz-icon">📝</span>
            <h4>${quiz.title}</h4>
            <p>Ваша викторина</p>
            <span class="quiz-questions">${quiz.questions.length} вопросов</span>
        `;
        btn.addEventListener("click", () => {
            startCoupleQuiz(quiz, quiz.id);
        });
        container.appendChild(btn);
    });
}

function startCoupleQuiz(quiz, quizKey) {
    const menu = document.getElementById("coupleQuizMenu");
    const partner1Screen = document.getElementById("partner1Screen");
    const partner2Screen = document.getElementById("partner2Screen");
    const resultsScreen = document.getElementById("resultsScreen");

    if (!menu || !partner1Screen || !partner2Screen || !resultsScreen) return;

    menu.classList.add("hidden");

    let currentQuestion = 0;
    let partner1Answers = [];
    let partner2Answers = [];
    let partner1Name = "Партнёр 1";
    let partner2Name = "Партнёр 2";

    // Получаем имена из профилей
    const profiles = getUserProfiles();
    if (profiles) {
        partner1Name = profiles.person1.name;
        partner2Name = profiles.person2.name;
    }

    // Экран первого партнера
    function showPartner1Screen() {
        partner1Screen.classList.remove("hidden");
        partner2Screen.classList.add("hidden");
        resultsScreen.classList.add("hidden");

        document.getElementById("partner1Name").textContent = partner1Name;
        renderPartnerQuestion(1, currentQuestion, quiz, partner1Answers);
    }

    // Экран второго партнёра
    function showPartner2Screen() {
        partner1Screen.classList.add("hidden");
        partner2Screen.classList.remove("hidden");
        resultsScreen.classList.add("hidden");

        document.getElementById("partner2Name").textContent = partner2Name;
        renderPartnerQuestion(2, currentQuestion, quiz, partner2Answers);
    }

    function renderPartnerQuestion(partner, questionIndex, quiz, answers) {
        if (questionIndex >= quiz.questions.length) {
            if (partner === 1) {
                // Переходим ко второму партнёру
                currentQuestion = 0;
                showPartner2Screen();
            } else {
                // Показываем результаты
                showResults();
            }
            return;
        }

        const question = quiz.questions[questionIndex];
        const containerId = partner === 1 ? "partner1QuestionContainer" : "partner2QuestionContainer";
        const progressId = partner === 1 ? "partner1Progress" : "partner2Progress";
        const prevBtnId = partner === 1 ? "partner1PrevBtn" : "partner2PrevBtn";
        const nextBtnId = partner === 1 ? "partner1NextBtn" : "partner2NextBtn";

        const container = document.getElementById(containerId);
        const progressEl = document.getElementById(progressId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!container || !progressEl || !prevBtn || !nextBtn) return;

        container.innerHTML = "";
        

        const questionCard = document.createElement("div");
        questionCard.className = "question-card";

        const questionTitle = document.createElement("p");
        questionTitle.className = "question-title";
        questionTitle.textContent = question.text;
        questionCard.appendChild(questionTitle);

        // Если есть изображение, добавляем его
        if (question.image) {
            const img = document.createElement("img");
            img.src = question.image;
            img.alt = question.text;
            img.className = "question-image";
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            img.style.marginBottom = "12px";
            questionCard.appendChild(img);
        }

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "question-options";

        question.options.forEach((option, index) => {
            // Проверяем, является ли опция объектом с текстом и изображением
            const isOptionWithImage = typeof option === "object" && option.text;
            const optText = isOptionWithImage ? option.text : option;
            const optImage = isOptionWithImage ? option.image : null;

            const label = document.createElement("label");
            label.className = "option-chip" + (optImage ? " option-with-image" : "");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${partner}`;
            input.value = index;

            if (answers[questionIndex] === index) {
                input.checked = true;
                label.classList.add("selected");
            }

            const dot = document.createElement("span");
            dot.className = "option-dot";

            const text = document.createElement("span");
            text.textContent = optText;

            // Если есть изображение для опции, добавляем его ПЕРВЫМ
            if (optImage) {
                const imgWrapper = document.createElement("div");
                imgWrapper.className = "option-image-wrapper";
                const img = document.createElement("img");
                img.src = optImage;
                img.alt = optText;
                img.className = "option-image";
                imgWrapper.appendChild(img);
                label.appendChild(imgWrapper);
            }

            label.appendChild(input);
            label.appendChild(dot);
            label.appendChild(text);

            label.addEventListener("click", () => {
                document.querySelectorAll(".option-chip").forEach((l) => l.classList.remove("selected"));
                label.classList.add("selected");
                input.checked = true;
                answers[questionIndex] = index;
            });

            optionsWrap.appendChild(label);
        });

        questionCard.appendChild(optionsWrap);
        container.appendChild(questionCard);

        progressEl.textContent = `${questionIndex + 1} / ${quiz.questions.length}`;

        prevBtn.disabled = questionIndex === 0;
        prevBtn.onclick = () => {
            currentQuestion--;
            renderPartnerQuestion(partner, currentQuestion, quiz, answers);
        };

        nextBtn.textContent = questionIndex === quiz.questions.length - 1 ? "Завершить" : "Далее →";
        nextBtn.onclick = () => {
            currentQuestion++;
            renderPartnerQuestion(partner, currentQuestion, quiz, answers);
        };
    }

    function showResults() {
        partner1Screen.classList.add("hidden");
        partner2Screen.classList.add("hidden");
        resultsScreen.classList.remove("hidden");

        const resultsContent = document.getElementById("resultsContent");
        if (!resultsContent) return;

        const compatibility = calculateCompatibility(quiz, partner1Answers, partner2Answers);

        resultsContent.innerHTML = `
            <div class="compatibility-results">
                <div class="score-section">
                    <div class="compatibility-score">${compatibility.percentage}%</div>
                    <h3>${compatibility.message}</h3>
                </div>

                <div class="compatibility-details">
                    <h4>Анализ совпадений:</h4>
                    <div class="matches-list">
                        ${compatibility.matches.map((match) => `
                            <div class="match-item">
                                <div class="match-header">
                                    <p class="match-question">${match.question}</p>
                                    <span class="match-status ${match.matched ? "matched" : "different"}">
                                        ${match.matched ? "✓ Совпадает" : "◐ Разные ответы"}
                                    </span>
                                </div>
                                <div class="match-answers">
                                    <div class="answer">
                                        <strong>${partner1Name}:</strong>
                                        <span>${match.partner1Answer}</span>
                                    </div>
                                    <div class="answer">
                                        <strong>${partner2Name}:</strong>
                                        <span>${match.partner2Answer}</span>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="advice-section">
                    <h4>💡 Совет для пары:</h4>
                    <p>${compatibility.advice}</p>
                </div>
            </div>
        `;

        document.getElementById("restartCoupleBtn").onclick = () => {
            currentQuestion = 0;
            partner1Answers = [];
            partner2Answers = [];
            showPartner1Screen();
        };
    }

    // Началось с первого партнера
    showPartner1Screen();
}

function calculateCompatibility(quiz, partner1Answers, partner2Answers) {
    let matchCount = 0;
    const matches = [];

    quiz.questions.forEach((q, index) => {
        const p1Answer = partner1Answers[index] !== undefined ? partner1Answers[index] : -1;
        const p2Answer = partner2Answers[index] !== undefined ? partner2Answers[index] : -1;

        const matched = p1Answer === p2Answer && p1Answer !== -1;
        if (matched) matchCount++;

        matches.push({
            question: q.text,
            partner1Answer: p1Answer !== -1 ? q.options[p1Answer] : "Не ответил",
            partner2Answer: p2Answer !== -1 ? q.options[p2Answer] : "Не ответил",
            matched: matched
        });
    });

    const percentage = Math.round((matchCount / quiz.questions.length) * 100);

    let message = "";
    let advice = "";

    if (percentage >= 90) {
        message = "💕 Вы идеальная пара! Ваши вкусы и предпочтения поражающе совпадают!";
        advice = "Вы удивительно хорошо понимаете друг друга. Продолжайте развивать эту гармонию, и ваши отношения будут только крепче!";
    } else if (percentage >= 75) {
        message = "💑 Отличная совместимость! Вы очень хорошо подходите друг другу.";
        advice = "У вас хороший уровень понимания. Работайте над теми вопросами, где вы отличались, и ваша близость будет ещё глубже.";
    } else if (percentage >= 60) {
        message = "💗 Хорошее совпадение! Есть различия, но и много общего.";
        advice = "Это нормально отличаться в некоторых вопросах. Используйте различия как возможность узнать друг друга лучше и расти вместе.";
    } else if (percentage >= 40) {
        message = "🎯 Интересные контрасты! Вы разные, но это может быть силой.";
        advice = "Ваши различия — это возможность учиться друг у друга. Откройтесь для новых опытов и точек зрения вашего партнёра.";
    } else {
        message = "⚠️ Значительные различия. Это вызов, но не препятствие.";
        advice = "Прочитайте ответы партнёра внимательнее. Разговор об этих различиях поможет вам понять друг друга и найти компромиссы.";
    }

    return {
        percentage,
        message,
        advice,
        matches
    };
}

// Инициализация парной викторины при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    const isCoupleQuizPage = document.querySelector(".couple-quiz-wrapper") !== null;
    if (isCoupleQuizPage) {
        setupCoupleQuizzes();
    }
});