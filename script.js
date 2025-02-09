import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let questions = [];
let currentQuestionIndex = 0;

async function fetchQuestions() {
    document.getElementById('question').innerText = "Please wait, loading questions...";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = "Generate a set of 10 multiple-choice questions that incorporate current Gen Z slang terms, including 'sigma,' 'skibidi,' 'cooked,' 'locked in,' and 'rizz.' Each question should be humorously exaggerated and intentionally cringeworthy, reflecting the playful and ironic tone characteristic of Gen Z culture. Ensure that each question has one correct answer and three humorous, incorrect options. The content should be appropriate for a general audience";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const questionsText = await response.text();
        console.log("Questions Text:", questionsText);

        // Parse the questions and options
        questions = parseQuestions(questionsText);
        console.log("Parsed Questions:", questions);
        displayQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
        document.getElementById('question').innerText = "Failed to load questions.";
    }
}

function parseQuestions(questionsText) {
    // This function should parse the questionsText into an array of question objects
    // Each object should have a question and an array of options
    // For simplicity, let's assume the questionsText is already in a JSON format
    return JSON.parse(questionsText);
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById('question').innerText = "Quiz completed!";
        document.getElementById('options').innerHTML = "";
        document.getElementById('nextButton').disabled = true;
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = "";
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => submitAnswer(option);
        optionsContainer.appendChild(button);
    });

    document.getElementById('nextButton').disabled = true;
}

async function submitAnswer(answer) {
    let feedback = document.getElementById("feedback");

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Is the answer to this quiz question correct: '${answer}'? Reply with 'Correct' or 'Incorrect'.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const evaluation = await response.text().trim().toLowerCase();

        if (evaluation.includes("correct")) {
            feedback.innerText = "Correct!";
            feedback.style.color = "green";
        } else {
            feedback.innerText = "Wrong!";
            feedback.style.color = "red";
        }
    } catch (error) {
        console.error("Error evaluating answer:", error);
        feedback.innerText = "Error checking answer.";
    }

    document.getElementById('nextButton').disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

fetchQuestions();
