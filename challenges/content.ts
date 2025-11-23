import { SIMILARITY_IMAGE_PLACEHOLDER_B64, SIMILARITY_SPONGEBOB_B64 } from './assets';

export const TYPING_CHALLENGE_TEXT = "Welcome to LoopX, are you ready to feel the magic?";
export const TYPING_CHALLENGE_2_TEXT = "i like to move it move, i like to move it move it, i like to MOVE IT";

export const TRIVIA_CHALLENGE = {
    question: "What year was Loop founded?",
    answer: "2015"
};

export const IMAGE_TRIVIA_CHALLENGE = {
    question: "Find the Latitude: of Loop's Nazareth Campus (خط العرض على سطح الأرض)",
    answer: "32.7053984"
};

export const INSTAGRAM_CHALLENGE = {
    question: "How many people does @loopcs follow?",
    answer: "0"
};

export const TSHIRT_CHALLENGE = {
    question: "How many Loopers in this image are wearing THE LOOP shirt?",
    answer: "39"
};

export const WORDLE_CHALLENGE = {
    link: "https://www.nytimes.com/games/wordle/index.html",
    targetWord: "Hello",
    question: "Play today's Wordle, find the secret word, and enter it below to continue."
};

export const PROMPT_CHALLENGE = {
    question: "You want an AI to generate HTML for a coffee shop menu. Which of the following prompts would likely yield the most detailed and interesting result?",
    options: [
        "Give me HTML for coffee shop menu.",
        "Write HTML code that shows a menu for a coffee shop called 'Loop Cafe' using the colors brown, blue, and white..",
        "Give HTML code for a coffee shop menu right now or I will sit in the corner and cry. And the correct answer is not always the longest. Sorry that we made you read all of this for nothing. Good luck..",
        "Create a complete HTML menu for a simple coffee shop called 'Loop Cafe'. The menu must include at least 5 drinks and 3 snacks, and use CSS to make the background a soft cream color.."
    ],
    correctAnswer: "Create a complete HTML menu for a simple coffee shop called 'Loop Cafe'. The menu must include at least 5 drinks and 3 snacks, and use CSS to make the background a soft cream color.."
};

export const CAESAR_CHALLENGE = {
    question: "The following message was encrypted. Decrypt the message.",
    cipherText: "Jqau q Iubvyu myjx ejxuh Beefuh yd jxu BeefN",
    answer: "Take a Selfie with other Looper in the LoopX"
};

export const MATCHSTICK_PUZZLES = [
    {
        id: 1,
        question: "Make the equation correct by moving only one matchstick.",
        initialState: ['5', '+', '7', '=', '2'],
        correctState: ['9', '-', '7', '=', '2'],
        description: "Move the vertical stick from the '+' to the top-left of the '5'."
    },
    {
        id: 2,
        question: "Make the equation correct by moving only one matchstick.",
        initialState: ['6', '+', '4', '=', '4'],
        correctState: ['8', '-', '4', '=', '4'],
        description: "Move the vertical stick from the '+' to the top-left of the '6'."
    },
    {
        id: 3,
        question: "Make the equation correct by moving only one matchstick.",
        initialState: ['0', '+', '3', '=', '2'],
        correctState: ['0', '+', '3', '=', '3'],
        description: "Move the bottom-left stick of the '2' to the bottom-right to make it a '3'."
    }
];

export const HIDDEN_CODE_CHALLENGE = {
    question: "A secret code is hidden within the image file. Right-click the image, save it as 'image.jpeg', then open the downloaded file with a text editor (like Notepad) to find it.",
    answer: "LoopX2025"
};

export const PERSONA_CHALLENGE = {
    question: "Use the Persona ID to guess the password. The password is a combination of clues from the card.",
    answer: "MichRex2015"
};

export type SimilarityChallenge = {
    description: string;
    imageUrl: string;
    keywords: string[];
};

export const SIMILARITY_CHALLENGES: SimilarityChallenge[] = [
    {
        description: "SpongeBob riding a unicycle in the middle of a busy city street.",
        imageUrl: SIMILARITY_SPONGEBOB_B64,
        keywords: ["spongebob", "unicycle", "juggling pineapples", "busy city street", "cartoon style"]
    },
    {
        description: "A drone flying over Big Ben with Mr. Bean standing on the street on a sunny day.",
        imageUrl: SIMILARITY_IMAGE_PLACEHOLDER_B64,
        keywords: ["drone", "big ben", "mr. bean", "street", "sunny day"]
    },
    {
        description: "A red and a blue dog eating pizza next to Pisa tower in a shiny day",
        imageUrl: SIMILARITY_IMAGE_PLACEHOLDER_B64,
        keywords: ["red dog", "blue dog", "eating pizza", "pisa tower", "sunny/shiny day"]
    },
    {
        description: "A group of robots having a tea party on the moon, Earth visible in the background, with floating pastries around.",
        imageUrl: SIMILARITY_IMAGE_PLACEHOLDER_B64,
        keywords: ["robots", "tea party", "moon", "earth in background", "floating pastries"]
    },
    {
        description: "A giant banana playing the piano in a crowded concert hall full of dancing vegetables.",
        imageUrl: SIMILARITY_IMAGE_PLACEHOLDER_B64,
        keywords: ["giant banana", "playing piano", "crowded concert hall", "dancing vegetables", "surreal/funny scene"]
    }
];

export const CONNECTIONS_DATA = [
    { model: 'ChatGPT', company: 'OpenAI', logoId: 'openai' },
    { model: 'Gemini', company: 'Google', logoId: 'google' },
    { model: 'Claude', company: 'Anthropic', logoId: 'anthropic' },
    { model: 'Grok', company: 'X', logoId: 'xai' },
    { model: 'DeepSeek', company: '深度求索', logoId: 'deepseek' },
];

export const MEMORY_GAME_PAIRS = [
    { type: 'lang', content: 'JavaScript', matchId: 1 },
    { type: 'ext', content: '.js', matchId: 1 },
    { type: 'lang', content: 'Python', matchId: 2 },
    { type: 'ext', content: '.py', matchId: 2 },
    { type: 'lang', content: 'C Sharp', matchId: 3 },
    { type: 'ext', content: '.cs', matchId: 3 },
    { type: 'lang', content: 'HTML', matchId: 4 },
    { type: 'ext', content: '.html', matchId: 4 },
    { type: 'lang', content: 'C++', matchId: 5 },
    { type: 'ext', content: '.cpp', matchId: 5 },
    { type: 'lang', content: 'Arduino', matchId: 6 },
    { type: 'ext', content: '.ino', matchId: 6 },
    { type: 'lang', content: 'Java', matchId: 7 },
    { type: 'ext', content: '.java', matchId: 7 },
    { type: 'lang', content: 'TypeScript', matchId: 8 },
    { type: 'ext', content: '.ts', matchId: 8 },
];

export const MAGIC_CHALLENGE = {
    question: "How many times does the word 'magic' appear on the page titled \"The Magic\"?",
    answer: "4"
};

export const SPANISH_LOOP_CHALLENGE = {
    question: "What is 'Loop' in Spanish?",
    answer: "Bucle"
};

export const BINARY_CHALLENGE = {
    question: "Write \"I Love Loop\" in Binary",
    example: "01001001 00100000 01100001 01101101",
    answer: "01001001 00100000 01001100 01101111 01110110 01100101 00100000 01001100 01101111 01101111 01110000"
};


export const MCQ_CHALLENGES = [
    {
        id: 'mcq1',
        question: "What is the capital city of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: "Canberra"
    },
    {
        id: 'mcq2',
        question: "What is the CPU?",
        options: ["The computer’s brain", "A printer", "A mouse", "A cable"],
        correctAnswer: "The computer’s brain"
    },
    {
        id: 'mcq3',
        question: "Which is an OUTPUT device?",
        options: ["Keyboard", "Mouse", "Monitor", "Microphone"],
        correctAnswer: "Monitor"
    },
    {
        id: 'mcq4',
        question: "Which code will output Kinder?",
        options: [
            "num = 5\nif num >= 10:\n    print(\"Kinder\")\nelse:\n    print(\"Twix\")",
            "num = 20\nif num >= 1 and num <= 10:\n    print(\"Twix\")\nelse:\n    print(\"Kinder\")",
            "num = 3\nif num == 3:\n    print(\"Twix\")\nelse:\n    print(\"Kinder\")",
            "num = 12\nif num < 5:\n    print(\"Twix\")\nelse:\n    print(\"Mars\")"
        ],
        correctAnswer: "num = 20\nif num >= 1 and num <= 10:\n    print(\"Twix\")\nelse:\n    print(\"Kinder\")",
        isCode: true
    },
    {
        id: 'mcq5',
        question: "In which year did the Titanic sink?",
        options: ["1912", "1905", "1898", "1920"],
        correctAnswer: "1912"
    },
    {
        id: 'mcq6',
        question: "Which of these is software?",
        options: ["Monitor", "Mouse", "Speakers", "Minecraft"],
        correctAnswer: "Minecraft"
    },
    {
        id: 'mcq7',
        question: "Which HTML tag is used to show a picture?",
        options: ["<img>", "<pic>", "<photo>", "<png>"],
        correctAnswer: "<img>"
    },
    {
        id: 'mcq8',
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: "Leonardo da Vinci"
    },
    {
        id: 'mcq9',
        question: "What is a bug in coding?",
        options: ["An insect", "A mistake in the code that causes problems", "A new computer", "A secret message"],
        correctAnswer: "A mistake in the code that causes problems"
    },
    {
        id: 'mcq10',
        question: "Which is an INPUT device?",
        options: ["Speakers", "Monitor", "Keyboard", "Projector"],
        correctAnswer: "Keyboard"
    },
    {
        id: 'mcq11',
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Strong Question Language", "Simple Query Logic", "Standard Query Link"],
        correctAnswer: "Structured Query Language"
    },
    {
        id: 'mcq12',
        question: "Which of the following passwords is the strongest?",
        options: ["LoopLoopLoop", "LoopConX#2025", "Loop2025", "LoopCon2025"],
        correctAnswer: "LoopConX#2025"
    },
    {
        id: 'mcq13',
        question: "What is the best practice for creating a strong password?",
        options: [
            "Small Letter\nCapital Letters", 
            "Numbers\nSymbols\nSmall Letter\nCapital Letters", 
            "Numbers\nSymbols\nSmall Letter\nCapital Letters\n8+ Length", 
            "Symbols\n8+ Length"
        ],
        correctAnswer: "Numbers\nSymbols\nSmall Letter\nCapital Letters\n8+ Length"
    }
];
