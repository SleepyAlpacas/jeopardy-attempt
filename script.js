var questions = [];
var answers = [];
let row = 5;
let col = 5;
var currentQuestionRow = 999;
var currentQuestionCol = 99;
var currentQuestionMoney = 0;

for (let i = 0; i < row; i++){
    questions[i] = [];
    answers[i] = [];
    for (let i2 = 0; i2 < col; i2++){
        questions[i][i2] = i + "-" + i2;
        answers[i][i2] = "ans " + questions[i][i2];
    }
}

$(document).ready(function(){
    $("#question-screen").click(function(){
        showAnswer();
    });
    $('#answer-screen').click(function(){
        showBoard();
    });
});

//when you select a question,
function showQuestion(row, col){
    loadQuestion(row, col);
    document.getElementById('board').style.display = 'none';
    document.getElementById('question-screen').style.display = 'flex';
    let x = document.getElementsByClassName('buttons');
    for (let i = 0; i < x.length; i++){
        x[i].style.display = "block";
    }
}

function loadQuestion(row, col){
    currentQuestionRow = row;
    currentQuestionCol = col;
    currentQuestionMoney = (currentQuestionRow + 1) * 100;
    document.getElementById('question-text').innerHTML = questions[row][col];
    document.getElementById('answer-text').innerHTML = answers[row][col];
}

function showAnswer(){
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'flex';
    let x = document.getElementsByClassName('buttons');
    for (let i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }
}

function showBoard(){
    greyOutQuestion();
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('board').style.display = 'block';
}

function greyOutQuestion(){
    let query = ".board-questions .board-row:nth-child(" + (currentQuestionRow + 1) +") .board-cell:nth-child(" + (currentQuestionCol + 1) + ")";
    let text = $(query).html();
    $(query).replaceWith("<div class='board-cell'>" + text + "</div>");
}

function correctAnswer(player){
    let x = document.getElementsByClassName('money')
    let currentMoney = parseInt(x[player].innerHTML);
    x[player].innerHTML = currentMoney + currentQuestionMoney + "$";
    showAnswer();
}

function incorrectAnswer(player){
    let x = document.getElementsByClassName('money')
    let currentMoney = parseFloat(x[player].innerHTML);
    x[player].innerHTML = currentMoney - currentQuestionMoney + "$";
}