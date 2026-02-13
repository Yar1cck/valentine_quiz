document.addEventListener("DOMContentLoaded", () => {
    // Проверяем, на какой странице мы находимся
    const isQuizPage = document.getElementById("quiz-movie") !== null;
    const isValentinePage = document.querySelector(".valentine-page-wrapper") !== null;

    if (isQuizPage) {
        setupQuizTabs();
        setupMovieQuiz();
        setupConstructor();
        loadSavedQuizzes();
    }
    
    if (isValentinePage) {
        setupValentineQuizzes();
    }
});

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
                options: ["Брэд Питт и Анджелина Джоли", "Пол Ньюман и Джоан Вудворд", "Ричард Бёртон и Элизабет Тейлор", "Хамфри Богарт и Лорен Бэколл"],
                correctIndex: 1,
            },
            {
                id: "gc2",
                text: "Эта историческая пара правили Египтом. Их любовь стала легендой. Кто они?",
                options: ["Клеопатра и Марк Антоний", "Нефертити и Эхнатон", "Рамзес II и Нефертари", "Тутанхамон и Анхесенамон"],
                correctIndex: 0,
            },
            {
                id: "gc3",
                text: "Эта пара из мира музыки поженилась в 2011 году. Он — рэпер, она — певица. О ком идёт речь?",
                options: ["Jay-Z и Бейонсе", "Канье Уэст и Ким Кардашьян", "Джастин Тимберлейк и Джессика Бил", "Адам Левин и Бехати Принслу"],
                correctIndex: 0,
            },
            {
                id: "gc4",
                text: "Эта литературная пара стала символом вечной любви. Их имена начинаются на Р и Д.",
                options: ["Ромео и Джульетта", "Ричард и Джулия", "Роберт и Джулия", "Роджер и Дженни"],
                correctIndex: 0,
            },
            {
                id: "gc5",
                text: "Эта пара из мира науки. Они вместе работали над исследованиями и получили Нобелевскую премию.",
                options: ["Пьер и Мария Кюри", "Альберт Эйнштейн и Милева Марич", "Нильс Бор и Маргарет Норлунд", "Эрнест Резерфорд и Мэри Ньютон"],
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
                options: ["Титаник", "Хороший доктор", "Как я встретил вашу маму", "Ла-Ла Ленд"],
                correctIndex: 1,
            },
            {
                id: "mq2",
                text: "Из какого фильма цитата: 'Любовь означает никогда не просить прощения'?",
                options: ["История любви", "Виноваты звёзды", "Дневник памяти", "Ромео и Джульетта"],
                correctIndex: 0,
            },
            {
                id: "mq3",
                text: "Из какого фильма цитата: 'Я хочу, чтобы ты знала, что ты лучшая вещь, которая когда-либо случалась со мной'?",
                options: ["До встречи с тобой", "Виноваты звёзды", "Дневник памяти", "Титаник"],
                correctIndex: 0,
            },
            {
                id: "mq4",
                text: "Из какого фильма цитата: 'Я никогда не хотел никого так сильно, как хочу тебя'?",
                options: ["Сумерки", "50 оттенков серого", "Дневник Бриджит Джонс", "Дневник памяти"],
                correctIndex: 3,
            },
            {
                id: "mq5",
                text: "Из какого фильма цитата: 'Ты заставляешь меня хотеть быть хорошим человеком'?",
                options: ["Хороший доктор", "Дневник памяти", "Ла-Ла Ленд", "Виноваты звёзды"],
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
                            ${q.options.map((opt, idx) => `
                                <label class="option-chip">
                                    <input type="radio" name="answer" value="${idx}" required />
                                    <span class="option-dot"></span>
                                    <span>${opt}</span>
                                </label>
                            `).join("")}
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

    if (!form || !addQuestionBtn || !questionsContainer) return;

    addQuestionBtn.addEventListener("click", () => {
        questionCounter++;
        const questionDiv = createQuestionEditor(questionCounter);
        questionsContainer.appendChild(questionDiv);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const title = formData.get("title")?.trim();
        if (!title) {
            alert("Введите название викторины");
            return;
        }

        const questions = [];
        const questionDivs = questionsContainer.querySelectorAll(".question-editor");
        questionDivs.forEach((div) => {
            const qText = div.querySelector(".question-text-input")?.value?.trim();
            const options = [];
            div.querySelectorAll(".option-input").forEach((input) => {
                const opt = input.value?.trim();
                if (opt) options.push(opt);
            });

            if (qText && options.length >= 2) {
                questions.push({
                    id: `q${div.dataset.questionId}`,
                    text: qText,
                    options: options,
                });
            }
        });

        if (questions.length === 0) {
            alert("Добавьте хотя бы один вопрос с минимум 2 вариантами ответа");
            return;
        }

        const quiz = {
            id: Date.now().toString(),
            title: title,
            questions: questions,
            createdAt: new Date().toISOString(),
        };

        saveQuiz(quiz);
        form.reset();
        questionsContainer.innerHTML = "";
        questionCounter = 0;
        loadSavedQuizzes();
        alert("Викторина сохранена! Теперь вы можете пройти её в разделе 'Мои викторины'.");
    });

    // Добавить первый вопрос по умолчанию
    addQuestionBtn.click();
}

function createQuestionEditor(id) {
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

    const addOptionBtn = div.querySelector(".btn-add-option");
    const optionsList = div.querySelector(".options-list");
    let optionCounter = 0;

    function addOption() {
        optionCounter++;
        const optionDiv = document.createElement("div");
        optionDiv.className = "option-editor-row";
        optionDiv.innerHTML = `
            <input type="text" class="option-input" placeholder="Вариант ответа" required />
            <button type="button" class="btn-remove-option">✕</button>
        `;
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

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "question-options";

        q.options.forEach((opt, index) => {
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
            text.textContent = opt;

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
            answers[q.id] = value;
        }
    });
    return answers;
}
