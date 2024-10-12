// I M P O R T

import './style.css'
import { Questions } from "./questions";

// V A R I A B L E S

const app = document.querySelector("#app");
const startButton = document.querySelector("#start");
const TIMEOUT = 4000;

// E V E N T

startButton.addEventListener("click", startQuiz);

// F O N C T I O N S

function startQuiz(event) {
    let currentQuestion = 0;
    let score = 0;

    displayQuestion(currentQuestion);

    function clean (){
        while (app.firstElementChild) {
            app.firstElementChild.remove();
        }
        const progress = getProgressBar(Questions.length, currentQuestion);
        app.appendChild(progress);
    }

    function displayQuestion(index) {
        clean();
        const question = Questions[index];

        if (!question) {
            displayFinishMEssage();
            return;
        }

        const title = getTitleElement(question.question);
        app.appendChild(title);
        const answersDiv = createAnswers(question.answers);
        app.appendChild(answersDiv);

        const submitButton = getSubmitButton();

        submitButton.addEventListener("click", submit);

        app.appendChild(submitButton);
    }

    function displayFinishMEssage(){
        const h1 = document.createElement("h1");
        h1.innerText = "C'est terminé!";
        const p = document.createElement("p");
        p.innerText = `Tu as eu ${score} sur ${Questions.length} !`;

        app.appendChild(h1);
        app.appendChild(p);
    }

    function submit(){
        const selectedAnswer = app.querySelector(`input[name='answer']:checked`);
        disableAllAnswers ();
        const value = selectedAnswer.value;
        const question = Questions[currentQuestion];
        const isCorrect = question.correct === value;

        if (isCorrect){
            score ++;
        }

        showFeedBack(isCorrect, question.correct, value);
        displayNextQuestionButton(()=>{
            currentQuestion++;
            displayQuestion(currentQuestion);
        })
        const feedBack = getFeedBackMessage(isCorrect, question.correct);
        app.appendChild(feedBack);
    }

    function createAnswers(answers) {
        const answersDiv = document.createElement("div");
        answersDiv.classList.add("answers");

        for (const answer of answers) {
            const label = getAnswerElement(answer);
            answersDiv.appendChild(label);
        }
        return answersDiv;
    }
}

function formatId(text){
    return text.replaceAll(" ", "-").toLowerCase();
}

function getTitleElement(text){
    const title = document.createElement("h3");
    title.innerText = text;
    return title;
}

function getAnswerElement(text){
    const label = document.createElement("label");
    label.innerText = text;
    const input = document.createElement("input");
    const id = formatId(text);
    input.id = id;
    label.htmlFor = id;
    input.setAttribute("type", "radio");
    input.setAttribute("name", "answer");
    input.setAttribute("value", text);

    label.appendChild(input);
    return label;
}

function getSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    return submitButton;
}

function showFeedBack (isCorrect, correct, answer) {
    const correctAnswerId = formatId(correct);
    const correctElement = document.querySelector(`label[for='${correctAnswerId}']`)

    const selectedAnswerId = formatId(answer);
    const selectedElement = document.querySelector(`label[for='${selectedAnswerId}']`)

    correctElement.classList.add("correct");
    selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function getFeedBackMessage (isCorrect, correct){
    const paragraph = document.createElement("p");
    paragraph.innerText = isCorrect ? `Bravo !` : `Pfouah trop nul! C'était ${correct}`;

    return paragraph;
}

function getProgressBar(max, value){
    const progress = document.createElement("progress");
    progress.setAttribute("max", max);
    progress.setAttribute("value", value);
    return progress;
}

function displayNextQuestionButton(callback){
    let remainingTimeout = TIMEOUT;

    app.querySelector("button").remove();

    const getNextButton = () => `Next (${remainingTimeout/1000}s)`;

    const nextButton = document.createElement("button");
    nextButton.innerText = getNextButton();

    app.appendChild(nextButton);

    const interval = setInterval(()=>{
        remainingTimeout -= 1000;
        nextButton.innerText = getNextButton();
    }, 1000);
    
    const timeout = setTimeout(() => {
        handleNextQuestion();
    }, TIMEOUT)

    const handleNextQuestion = () => {
        clearInterval(interval);
        clearTimeout(timeout);

        callback();
    }


    nextButton.addEventListener("click", () => {
        handleNextQuestion();
    })
}

function disableAllAnswers() {
    document.querySelectorAll('input[type="radio"]');
    for (const radio of radioInputs){
    radio.disabled = true;
    }
} 