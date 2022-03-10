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
var resolveBtn = document.getElementById("resolveBtn");

var resName = document.getElementById("pickName");
var resDesc = document.getElementById("pickResponse");
var resList = document.getElementById("responseList");

var upVoteBtn = document.getElementById("upvoteBtn");
var downVoteBtn = document.getElementById("downvoteBtn");

var questionSearchNode = document.getElementById("questionSearch");
var newQuestion = document.getElementById("newQuestionForm");

newQuestion.addEventListener("click", openNewQuestionForm);

function openNewQuestionForm() {
  hideExpandedDisplay();
  showQuesForm();
}

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
  clearQuestionList()
  var questions = getAllQuestion();
  var favQuestions = getAllFavQuestion();
  favQuestions.forEach((q)=>{
    addQuestionToUI(q)
  })
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
    createdAt: Date.now(),
    isFavourite: false,
  };

  questionTitle.value = "";
  questionDesc.value = "";
  return question;
}

function makeQuestionUI(question) {
  var favIcon = document.createElement("div");
  if (question.isFavourite)
    favIcon.innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i><br>`;
  else
    favIcon.innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i><br>`;

  favIcon.style.float = "right";
  favIcon.style.marginRight = "5px";
  favIcon.style.fontSize = "18px";
  favIcon.style.cursor = "pointer";

  favIcon.addEventListener("click", makeFavourite(question));

  var quesBlock = document.createElement("div");
  quesBlock.setAttribute("class", "quesBlock");

  var quesTitle = document.createElement("div");
  quesTitle.setAttribute("id", "quesTitle");
  quesTitle.innerHTML = question.title;

  var quesDesc = document.createElement("div");
  quesDesc.setAttribute("id", "quesDesc");
  quesDesc.innerHTML = question.description;

  var upvoteDiv = document.createElement("div");
  upvoteDiv.setAttribute("class", "upvoteDiv");
  upvoteDiv.innerHTML = question.upVotes;

  var downvoteDiv = document.createElement("div");
  downvoteDiv.setAttribute("class", "downvoteDiv");
  downvoteDiv.innerHTML = question.downVotes;

  var likeIcon = document.createElement("div");
  likeIcon.setAttribute("class", "fa fa-thumbs-up");

  var dislikeIcon = document.createElement("div");
  dislikeIcon.setAttribute("class", "fa fa-thumbs-down");

  upvoteDiv.prepend(likeIcon);
  downvoteDiv.prepend(dislikeIcon);

  var dateDiv = document.createElement("div");
  dateDiv.setAttribute("class", "dateStyle");
  dateDiv.innerHTML = new Date(question.createdAt).toLocaleString();

  quesBlock.appendChild(quesTitle);
  quesDesc.appendChild(dateDiv);

  quesBlock.appendChild(quesDesc);
  quesDesc.appendChild(downvoteDiv);
  quesDesc.appendChild(upvoteDiv);
  quesDesc.appendChild(favIcon);

  quesTitle.addEventListener("click", expandQuestion(question));

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
  questionList.append(makeQuestionUI(question));
}

//favourite question handler
function makeFavourite(question) {
  return function (e) {
    question.isFavourite = !question.isFavourite;
    if (question.isFavourite) e.target.className = "fa fa-heart";
    else {
      e.target.className = "fa fa-heart-o";
    }
    // console.log(e.target.className);
    updateFavQuestionStorage(question);
    sortQuestions()
    loadquestions()
  };
}

function updateFavQuestionStorage(question) {
  var allQuestion = getAllQuestion();
  var favQuestions = getAllFavQuestion();
  if (question.isFavourite) {
    allQuestion.forEach(function (q) {
      if (question.createdAt === q.createdAt) {
        q.isFavourite = true;
        favQuestions.push(q);
        allQuestion.splice(allQuestion.indexOf(q), 1);
      }
    });
  } else {
    favQuestions.forEach(function (q) {
      if (question.createdAt === q.createdAt) {
        q.isFavourite = false;
        allQuestion.push(q);
        favQuestions.splice(favQuestions.indexOf(q), 1);
      }
    });
  }
  sortQuestions();
  localStorage.setItem("questions", JSON.stringify(allQuestion));
  localStorage.setItem("favQuestions", JSON.stringify(favQuestions));
  loadquestions()
}

//expand question handler
function expandQuestion(question) {
  return function () {
    hideQuesForm();
    displayExpandedQues();
    makeExpandedDisplay(question);
    clearResponsePanel();
    getQuestionResponsesToUI(question);

    resolveBtn.onclick = resolveQuestion(question);
    // console.log(question)

    submitResponseBtn.onclick = collectResponse(question);
    // console.log(question)
    upVoteBtn.onclick = upVoteQuestion(question);

    downVoteBtn.onclick = downVoteQuestion(question);
  };
}

function resolveQuestion(question) {
  return function () {
    var allQuestion = getAllQuestion();
    allQuestion.forEach(function (q) {
      if (q.createdAt === question.createdAt) {
        allQuestion.splice(allQuestion.indexOf(q), 1);
      }
    });
    localStorage.setItem("questions", JSON.stringify(allQuestion));

    clearQuestionList();
    loadquestions();
    showQuesForm();
    hideExpandedDisplay();
  };
}
function showQuesForm() {
  questionForm.style.display = "block";
}

function hideExpandedDisplay() {
  questionExpanded.style.display = "none";
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
      createrAt: Date.now()
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
    sortQuestions();
    clearQuestionList();
    loadquestions();
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
  var favQuestions = getAllFavQuestion();

  allQuestion.sort(function (a, b) {
    return b.upVotes - a.upVotes;
  });

  favQuestions.sort(function (a, b) {
    return b.upVotes - a.upVotes;
  });
  localStorage.setItem("questions", JSON.stringify(allQuestion));
  localStorage.setItem("favQuestions", JSON.stringify(favQuestions));
}

function updateQuestionInStorage(updatedQuestion) {
  var questionList;
  console.log(updatedQuestion.isFavourite);
  if(updatedQuestion.isFavourite)
  questionList = getAllFavQuestion();
  else
  questionList = getAllQuestion();

  // console.log(updatedQuestion);
  var revisedQuestions = questionList.map(function (q) {
    if (updatedQuestion.title === q.title) {
      return updatedQuestion;
    }
    return q;
  });
  if(updatedQuestion.isFavourite)
  localStorage.setItem("favQuestions", JSON.stringify(revisedQuestions));
  else
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function updateQuestionUI(question) {
  var questionNodes = questionList.childNodes;
  questionNodes.forEach(function (q) {
    if (q.firstChild.innerHTML == question.title) {
      q.children[1].children[2].innerHTML =
        `<div class="fa fa-thumbs-up"></div>` + question.upVotes;
      q.children[1].children[1].innerHTML =
        `<div class="fa fa-thumbs-down"></div>` + question.downVotes;
    }
  });
}

function saveResponseToStorage(question, newRes) {

  var allQuestion ;
  if(question.isFavourite)
  allQuestion= getAllFavQuestion();
  else
  allQuestion = getAllQuestion()

  var revisedQuestions = allQuestion.map(function (q) {
    if (question.title === q.title) {
      q.responses.push(newRes);
      question.responses.push(newRes);
      // console.log(question);
    }
    return q;
  });
 if(question.isFavourite)
 localStorage.setItem("favQuestions", JSON.stringify(revisedQuestions));
 else
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));

}

function getQuestionResponsesToUI(question) {
  var allQuestion;
  if(question.isFavourite)
  allQuestion = getAllFavQuestion();
  else
  allQuestion = getAllQuestion();

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

  var timeElapsed = document.createElement('p')
  timeElapsed.innerHTML = 'created '+getElapsedTime(timeElapsed)(response.createdAt)+' Ago'

  responseBlock.appendChild(nameBlock);
  responseBlock.appendChild(resBlock);

  resList.appendChild(responseBlock);
}

function makeExpandedDisplay(question) {
  var title = document.createElement("div");
  title.style.backgroundColor = "rgb(255, 102, 0)";
  title.style.padding = "10px";
  title.style.fontWeight = "bolder";
  title.style.borderTopLeftRadius = "10px";
  title.style.borderTopRightRadius = "10px";
  title.style.fontSize = "32px";
  title.style.color = "white";
  title.innerHTML = question.title;

  var desc = document.createElement("div");
  desc.style.padding = "10px";
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

//return all favourite questions
function getAllFavQuestion() {
  var favQuestions = localStorage.getItem("favQuestions");
  if (favQuestions) favQuestions = JSON.parse(favQuestions);
  else favQuestions = [];

  return favQuestions;
}
