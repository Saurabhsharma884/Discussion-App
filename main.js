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

var upVoteBtn = document.getElementById("upvoteBtn");
var downVoteBtn = document.getElementById("downvoteBtn");

var questionSearchNode = document.getElementById("questionSearch");

questionSubmitBtn.addEventListener("click", submitQuestion);

loadquestions();

questionSearchNode.addEventListener("keyup", function (e) {
  // console.log(e);
  getSearchResults(e.target.value);
});

function getSearchResults(query) {
  var allQuestions = getAllQuestion();

  if (query) {
    clearQuestionList();
    var filteredQues = allQuestions.filter(function (q) {
      if (q.title.includes(query)) {
        return true;
      }
    });

    if (filteredQues.length) {
      filteredQues.forEach(function (q) {
        addQuestionToUI(q);
      });
    } else {
      questionList.innerHTML = `<h3 style="text-align:center"> No Match Found </h3>`;
    }
  } else {
    clearQuestionList();

    allQuestions.forEach(function (q) {
      addQuestionToUI(q);
    });
  }
}

function clearQuestionList() {
  questionList.innerHTML = "";
}
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
    upVotes: 0,
    downVotes: 0,
    createdAt: Date.now()
  };

  questionTitle.value = "";
  questionDesc.value = "";
  return question;
}

function makeQuestionUI(question) {
  var quesBlock = document.createElement("div");
  quesBlock.setAttribute("class", "quesBlock");

  var quesTitle = document.createElement("div");
  quesTitle.setAttribute("id", "quesTitle");
  quesTitle.innerHTML = question.title;

  var quesDesc = document.createElement("div");
  quesDesc.setAttribute("id", "quesDesc");
  quesDesc.innerHTML = question.description;

  var upvoteDiv = document.createElement("div");
  upvoteDiv.setAttribute("id", "upvoteDiv");
  upvoteDiv.innerHTML = question.upVotes;

  var downvoteDiv = document.createElement("div");
  downvoteDiv.setAttribute("id", "downvoteDiv");
  downvoteDiv.innerHTML = question.downVotes;

  var likeIcon = document.createElement("div");
  likeIcon.setAttribute("class", "fa fa-thumbs-up");

  var dislikeIcon = document.createElement("div");
  dislikeIcon.setAttribute("class", "fa fa-thumbs-down");

  upvoteDiv.prepend(likeIcon);
  downvoteDiv.prepend(dislikeIcon);

  var dateDiv = document.createElement('div')
  dateDiv.setAttribute('class','dateStyle')
  dateDiv.innerHTML=new Date(question.createdAt).toLocaleString();

  quesBlock.appendChild(quesTitle);
  quesDesc.appendChild(dateDiv);

  quesBlock.appendChild(quesDesc);
  quesDesc.appendChild(downvoteDiv);
  quesDesc.appendChild(upvoteDiv);

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
    clearResponsePanel();
    getQuestionResponsesToUI(question);

    // console.log(question)

    submitResponseBtn.onclick = collectResponse(question);
    // console.log(question)
    upVoteBtn.onclick = upVoteQuestion(question);

    downVoteBtn.onclick = downVoteQuestion(question);
  };
}

function hideQuesForm() {
  questionForm.style.display = "none";
}

function displayExpandedQues() {
  questionExpanded.style.display = "block";
}

function clearResponsePanel() {
  resList.innerHTML = "";
}

function collectResponse(question) {
  return function () {
    var response = {
      name: resName.value,
      res: resDesc.value,
    };
    clearResponseForm();
    saveResponseToStorage(question, response);
    addResponseToUI(response);
  };
}
function clearResponseForm() {
  resName.value = "";
  resDesc.value = "";
}

function upVoteQuestion(question) {
  return function () {
    question.upVotes += 1;
    updateQuestionInStorage(question);
    sortQuestions()
    clearQuestionList()
    loadquestions()
    updateQuestionUI(question);
  };
}
function downVoteQuestion(question) {
  return function () {
    question.downVotes += 1;
    updateQuestionInStorage(question);
    updateQuestionUI(question);
  };
}

function sortQuestions() {
  var allQuestion = getAllQuestion();
  allQuestion.sort(function(a,b){
    return a.upVotes-b.upVotes;
  })
  localStorage.setItem('questions',JSON.stringify(allQuestion))
}

function updateQuestionInStorage(updatedQuestion) {
  var allQuestion = getAllQuestion();
  console.log(updatedQuestion);
  var revisedQuestions = allQuestion.map(function (q) {
    if (updatedQuestion.title === q.title) {
      return updatedQuestion;
    }
    return q;
  });
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function updateQuestionUI(question) {
  var questionNodes = questionList.childNodes;
  questionNodes.forEach(function (q) {
    if (q.firstChild.innerHTML == question.title) {
      q.children[1].children[2].innerHTML = `<div class="fa fa-thumbs-up"></div>`+question.upVotes;
      q.children[1].children[1].innerHTML = `<div class="fa fa-thumbs-down"></div>`+question.downVotes;
    }
  });
}

function saveResponseToStorage(question, newRes) {
  var allQuestion = getAllQuestion();
  var revisedQuestions = allQuestion.map(function (q) {
    if (question.title === q.title) {
      q.responses.push(newRes);
      question.responses.push(newRes);
      // console.log(question);
    }
    return q;
  });

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function getQuestionResponsesToUI(question) {
  var allQuestion = getAllQuestion();
  allQuestion.forEach(function (q) {
    if (q.title === question.title) {
      q.responses.forEach(function (res) {
        addResponseToUI(res);
      });
    }
  });
}

function addResponseToUI(response) {
  var responseBlock = document.createElement("div");
  responseBlock.setAttribute("class", "responseBlockDiv");

  var nameBlock = document.createElement("h5");
  nameBlock.innerHTML = response.name;

  var resBlock = document.createElement("h4");
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
