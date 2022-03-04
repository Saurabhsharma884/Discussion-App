// listen for submit button to create question
// save question to the storage
// append question to the left panel
// listen for click on question and display in right pane
// listen for click on submit respone Button
// display response in response section
var questionSubmitBtn = document.getElementById("submitBtn");
var questionTitle = document.getElementById("title");
var questionDesc = document.getElementById("questionDesc");
var questionList = document.getElementById("questionList");
var questionForm = document.getElementById("quesFormDisplay");
var questionExpanded = document.getElementById("quesExpandedDisplay");
var submitResponseBtn = document.getElementById("submitResponse");

var resName = document.getElementById("pickName");
var resDesc = document.getElementById("pickResponse");
var resList = document.getElementById("responseList");
questionSubmitBtn.addEventListener("click", submitQuestion);

loadquestions();

//load existing questions
function loadquestions() {
  var questions = getAllQuestion();
  questions.forEach((q) => {
    addQuestionToUI(q);
  });
}

//make question
function makeQuestion() {
  var question = {
    title: questionTitle.value,
    description: questionDesc.value,
    responses: [],
  };

  questionTitle.value = "";
  questionDesc.value = "";
  return question;
}

function makeQuestionUI(question) {
  var quesBlock = document.createElement("div");
  quesBlock.setAttribute("id", "quesBlock");

  var quesTitle = document.createElement("div");
  quesTitle.setAttribute("id", "quesTitle");
  quesTitle.innerHTML = question.title;

  var quesDesc = document.createElement("div");
  quesDesc.setAttribute("id", "quesDesc");
  quesDesc.innerHTML = question.description;

  quesBlock.appendChild(quesTitle);
  quesBlock.appendChild(quesDesc);

  quesBlock.addEventListener("click", expandQuestion(question));

  return quesBlock;
}

//submit question
function submitQuestion() {
  var question = makeQuestion();

  saveQuestionToStorage(question);
  addQuestionToUI(question);
}
//save the question to local storage
function saveQuestionToStorage(question) {
  var questions = getAllQuestion();
  questions.push(question);
  localStorage.setItem("questions", JSON.stringify(questions));
}

//add question to list on right
function addQuestionToUI(question) {
  questionList.prepend(makeQuestionUI(question));
}

//expand question handler
function expandQuestion(question) {
  return function () {
    hideQuesForm();
    displayExpandedQues();
    makeExpandedDisplay(question);
    submitResponseBtn.onclick = collectResponse(question);
  };
}

function hideQuesForm() {
  questionForm.style.display = "none";
}

function displayExpandedQues() {
  questionExpanded.style.display = "block";
}

function collectResponse(question) {
  return function () {
    var response = {
      name: resName.value,
      res: resDesc.value,
    };

    saveResponseToStorage(question, response);
    addResponseToUI(response);
  };
}

function saveResponseToStorage(question, newRes) {
  var allQuestion = getAllQuestion();

  var revisedQuestions = allQuestion.map(function (q) {
    if (question.title === q.title) q.responses.push(newRes);

    return q;
  });

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function addResponseToUI(response) {
  var responseBlock = document.createElement("div");
  responseBlock.setAttribute("id", "responseBlockDiv");

  var nameBlock = document.createElement("h3");
  nameBlock.innerHTML = response.name;

  var resBlock = document.createElement("h1");
  resBlock.innerHTML = response.res;

  responseBlock.appendChild(nameBlock);
  responseBlock.appendChild(resBlock);

  resList.appendChild(responseBlock);
}

function makeExpandedDisplay(question) {
  var title = document.createElement("div");
  title.innerHTML = question.title;

  var desc = document.createElement("div");
  desc.innerHTML = question.description;

  questionExpanded.children[1].innerHTML = "";
  questionExpanded.children[1].appendChild(title);
  questionExpanded.children[1].appendChild(desc);
}

//return all questions in the storage
function getAllQuestion() {
  var questions = localStorage.getItem("questions");
  if (questions) questions = JSON.parse(questions);
  else questions = [];

  return questions;
}
