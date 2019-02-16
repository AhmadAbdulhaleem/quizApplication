/**********************
 * Quiz Controller
 **********************/

var quizController = (function() {
  /**** Question Constructor ****/
  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  var questionLocalStorage = {
    setQuestionCollection: function(newCollection) {
      localStorage.setItem('questionCollection', JSON.stringify(newCollection));
    },
    getQuestionCollection: function() {
      return JSON.parse(localStorage.getItem('questionCollection'));
    },
    removeQuestionCollection: function() {
      localStorage.removeItem('questionCollection');
    },
  };
  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  var quizProgress = {
    questionIndex: 0,
  };

  /********* PERSON CONSTRUCTOR **********/
  function Person(id, firstname, lastname, score) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.score = score;
  }

  let currentPersonData = {
    fullname: [],
    score: 0,
  };

  let adminFullName = ['A', 'Abdelhaleem'];

  let personLocalStorage = {
    setPersonData: newPersonData => {
      localStorage.setItem('personData', JSON.stringify(newPersonData));
    },
    getPersonData: () => {
      return JSON.parse(localStorage.getItem('personData'));
    },
    removePersonData: () => {
      localStorage.removeItem('personData');
    },
  };

  if (personLocalStorage.getPersonData() === null) {
    personLocalStorage.setPersonData([]);
  }

  return {
    getQuizProgress: quizProgress,
    getQuestionLocalStorage: questionLocalStorage,
    addQuestionOnLocalStorage: function(newQuestionText, opts) {
      var optionsArray, corrAns, questionId, newQuestion, getStoredQuestions, isChecked;

      optionsArray = [];

      isChecked = false;

      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value !== '') {
          optionsArray.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
          corrAns = opts[i].value;
          isChecked = true;
        }
      }

      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }
      if (newQuestionText.value !== '') {
        if (optionsArray.length > 1) {
          if (isChecked) {
            newQuestion = new Question(questionId, newQuestionText.value, optionsArray, corrAns);

            getStoredQuestions = questionLocalStorage.getQuestionCollection();
            getStoredQuestions.push(newQuestion);
            questionLocalStorage.setQuestionCollection(getStoredQuestions);

            newQuestionText.value = '';
            for (var x = 0; x < opts.length; x++) {
              opts[x].value = '';
              opts[x].previousElementSibling.checked = false;
            }

            console.log(questionLocalStorage.getQuestionCollection());
            return true;
          } else {
            alert('You missed to check correct answer, or you checked answer without value');
            return false;
          }
        } else {
          alert('You must insert at least 2 options');
          return false;
        }
      } else {
        alert('Please insert a question');
        return false;
      }
    },

    checkAnswer: answer => {
      if (
        questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer ===
        answer.textContent
      ) {
        currentPersonData.score++;
        return true;
      } else {
        return false;
      }
    },

    isFinished: () => {
      return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
    },

    addPerson: () => {
      let newPerson, personId, personData;

      if (personLocalStorage.getPersonData().length > 0) {
        personId =
          personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
      } else {
        personId = 0;
      }

      newPerson = new Person(
        personId,
        currentPersonData.fullname[0],
        currentPersonData.fullname[1],
        currentPersonData.score
      );
      personData = personLocalStorage.getPersonData();
      personData.push(newPerson);
      personLocalStorage.setPersonData(personData);
      console.log(newPerson);
    },

    getCurrPersonData: currentPersonData,
    getAdminFullName: adminFullName,
    getPersonLocalStorage: personLocalStorage,
  };
})();

/**********************
 * UI Controller
 **********************/

var UIController = (function() {
  var domItems = {
    /****** Admin Panel Elements ******/
    adminPanelSection: document.querySelector('.admin-panel-container'),
    questInsertBtn: document.getElementById('question-insert-btn'),
    newQuestionText: document.getElementById('new-question-text'),
    adminOptions: document.querySelectorAll('.admin-option'),
    adminOptionsContainer: document.querySelector('.admin-options-container'),
    insertedQuestionWrapper: document.querySelector('.inserted-questions-wrapper'),
    questUpdateBtn: document.getElementById('question-update-btn'),
    questDeleteBtn: document.getElementById('question-delete-btn'),
    questClearBtn: document.getElementById('questions-clear-btn'),
    resultsListWrapper: document.querySelector('.results-list-wrapper'),
    clearResultsBtn: document.getElementById('results-clear-btn'),
    /******* Quiz Section ***********/
    quizSection: document.querySelector('.quiz-container'),
    askQuestText: document.getElementById('asked-question-text'),
    quizOptionWrapper: document.querySelector('.quiz-options-wrapper'),
    progressBar: document.querySelector('progress'),
    progressPar: document.getElementById('progress'),
    instAnsContainer: document.querySelector('.instant-answer-container'),
    instAnswerText: document.getElementById('instant-answer-text'),
    instAnsDiv: document.getElementById('instant-answer-wrapper'),
    emotionIcon: document.getElementById('emotion'),
    nextQuestBtn: document.getElementById('next-question-btn'),
    /********* Landing Page Elements *********/
    landingPageSection: document.querySelector('.landing-page-container'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    firstNameInput: document.getElementById('firstname'),
    lastNameInput: document.getElementById('lastname'),
    /****** Final Result Section Elements *******/
    finalResultSection: document.querySelector('.final-result-container'),
    finalScoreText: document.getElementById('final-score-text'),
  };

  return {
    getDomItems: domItems,
    addInputsDynamically: function() {
      var addInput = function() {
        var inputHTML, z;

        z = document.querySelectorAll('.admin-option').length;

        inputHTML = `
        <div class="admin-option-wrapper">
          <input type="radio" class="admin-option-${z}" name="answer" value="1">
          <input type="text" class="admin-option admin-option-${z}" value="">
        </div>
        `;

        domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          'focus',
          addInput
        );

        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          'focus',
          addInput
        );
      };
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        'focus',
        addInput
      );
    },

    createQuestionList: function(getQuestions) {
      // console.log(getQuestions.getQuestionCollection());

      var questHTMl, numberingArr;

      numberingArr = [];

      domItems.insertedQuestionWrapper.innerHTML = '';

      for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
        numberingArr.push(i + 1);
        questHTMl = `
            <p><span>${numberingArr[i]}. ${
          getQuestions.getQuestionCollection()[i].questionText
        }</span><button id="question-${
          getQuestions.getQuestionCollection()[i].id
        }">Edit</button></p>
        `;

        domItems.insertedQuestionWrapper.insertAdjacentHTML('afterbegin', questHTMl);
      }
    },

    editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn) {
      var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

      if ('question-'.indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split('-')[1]);
        getStorageQuestList = storageQuestList.getQuestionCollection();
        getStorageQuestList.forEach((el, index) => {
          if (el.id === getId) {
            foundItem = el;
            placeInArr = index;
          }
        });
        domItems.newQuestionText.value = foundItem.questionText;
        domItems.adminOptionsContainer.innerHTML = '';

        optionHTML = '';

        for (let x = 0; x < foundItem.options.length; x++) {
          optionHTML += `
          <div class="admin-option-wrapper">
            <input type="radio" class="admin-option-${x}" name="answer" value="${x}">
            <input type="text" class="admin-option admin-option-${x}" value="${
            foundItem.options[x]
          }">
          </div>
          `;

          domItems.adminOptionsContainer.innerHTML = optionHTML;

          domItems.questUpdateBtn.style.visibility = 'visible';
          domItems.questDeleteBtn.style.visibility = 'visible';
          domItems.questInsertBtn.style.visibility = 'hidden';
          domItems.questClearBtn.style.pointerEvents = 'none';

          addInpsDynFn();

          var backDefaultView = function() {
            var updatedOptions;
            domItems.newQuestionText.value = '';
            updatedOptions = document.querySelectorAll('.admin-option');

            updatedOptions.forEach(option => {
              option.value = '';
              option.previousElementSibling.checked = false;
            });

            domItems.questUpdateBtn.style.visibility = 'hidden';
            domItems.questDeleteBtn.style.visibility = 'hidden';
            domItems.questInsertBtn.style.visibility = 'visible';
            domItems.questClearBtn.style.pointerEvents = '';

            updateQuestListFn(storageQuestList);
          };

          let updateQuestion = function() {
            let newOptions, optionEls;

            newOptions = [];

            optionEls = document.querySelectorAll('.admin-option');

            foundItem.questionText = domItems.newQuestionText.value;
            foundItem.correctAnswer = '';

            optionEls.forEach((el, i) => {
              if (el.value !== '') {
                newOptions.push(el.value);
                if (el.previousElementSibling.checked) {
                  foundItem.correctAnswer = el.value;
                }
              }
            });
            foundItem.options = newOptions;

            if (foundItem.questionText !== '') {
              if (foundItem.options.length > 1) {
                if (foundItem.correctAnswer !== '') {
                  getStorageQuestList.splice(placeInArr, 1, foundItem);
                  storageQuestList.setQuestionCollection(getStorageQuestList);
                  backDefaultView();
                } else {
                  alert('You missed to check correct answer, or you checked answer without value');
                }
              } else {
                alert('You must insert at least 2 options');
              }
            } else {
              alert('Please, Insert Question!');
            }
          };

          domItems.questUpdateBtn.onclick = updateQuestion;

          // Delete Event
          var deleteQuestion = function() {
            getStorageQuestList.splice(placeInArr, 1);
            storageQuestList.setQuestionCollection(getStorageQuestList);
            backDefaultView();
          };
          domItems.questDeleteBtn.onclick = deleteQuestion;
        }
      }
    },

    clearQuestList: function(storageQuestList) {
      if (storageQuestList.getQuestionCollection() !== null) {
        if (storageQuestList.getQuestionCollection().length > 0) {
          let conf = confirm('Warning! you will lose entire question list');
          if (conf) {
            storageQuestList.removeQuestionCollection();
            domItems.insertedQuestionWrapper.innerHTML = '';
          }
        }
      }
    },

    displayQuestion: function(storageQuestList, progress) {
      let newOptionHTML, characterArr;

      characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

      if (storageQuestList.getQuestionCollection().length > 0) {
        domItems.askQuestText.textContent = storageQuestList.getQuestionCollection()[
          progress.questionIndex
        ].questionText;

        domItems.quizOptionWrapper.innerHTML = '';
        newOptionHTML = '';
        storageQuestList
          .getQuestionCollection()
          [progress.questionIndex].options.forEach((opt, i) => {
            newOptionHTML += `
            <div class="choice-${i}"><span class="choice-${i}">${
              characterArr[i]
            }</span><p class="choice-${i}">${opt}</p></div>
          `;
          });
        domItems.quizOptionWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
      }
    },

    displayProgress: (storageQuestList, progress) => {
      domItems.progressBar.max = storageQuestList.getQuestionCollection().length;

      domItems.progressBar.value = progress.questionIndex + 1;
      domItems.progressPar.textContent =
        progress.questionIndex + 1 + '/' + storageQuestList.getQuestionCollection().length;
    },

    newDesign: (answerRes, selectedAnswer) => {
      let twoOptions, index;

      index = 0;

      if (answerRes) {
        index = 1;
      }

      twoOptions = {
        instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
        instAnswerClass: ['red', 'green'],
        emotionType: ['images/sad.png', 'images/happy.png'],
        optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)'],
      };

      domItems.quizOptionWrapper.style.cssText = 'opacity: 0.6; pointer-events: none;';
      domItems.instAnsContainer.style.opacity = '1';

      domItems.instAnswerText.textContent = twoOptions.instAnswerText[index];
      domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
      domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);

      selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
    },

    resetDesign: () => {
      domItems.quizOptionWrapper.style.cssText = '';
      domItems.instAnsContainer.style.opacity = '0';
    },

    getFullName: (currPersonData, storageQuestList, admin) => {
      if (domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {
        if (
          !(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])
        ) {
          if (storageQuestList.getQuestionCollection().length > 0) {
            currPersonData.fullname.push(domItems.firstNameInput.value);
            currPersonData.fullname.push(domItems.lastNameInput.value);

            domItems.landingPageSection.style.display = 'none';
            domItems.quizSection.style.display = 'block';

            // console.log(currPersonData);
          } else {
            alert('Quiz is not ready, please contact to administrator');
          }
        } else {
          domItems.landingPageSection.style.display = 'none';
          domItems.adminPanelSection.style.display = 'block';
        }
      } else {
        alert('Please enter your fist name and last name');
      }
    },

    finalResult: currPersonData => {
      domItems.finalScoreText.textContent = `${currPersonData.fullname[0]} ${
        currPersonData.fullname[1]
      } your final score is ${currPersonData.score}`;
      domItems.quizSection.style.display = 'none';
      domItems.finalResultSection.style.display = 'block';
    },

    addResultOnPanel: userData => {
      let resultHTMl;
      domItems.resultsListWrapper.innerHTML = '';

      resultHTMl = '';
      userData.getPersonData().forEach((data, i) => {
        resultHTMl += `
          <p class="person person-${i}">
            <span class="person-${i}">${data.firstname} ${data.lastname} - ${
          data.score
        } Points</span>
            <button id="delete-result-btn_${data.id}" class="delete-result-btn">Delete</button>
          </p> 
        `;
      });

      domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTMl);
    },

    deleteResult: (e, userData) => {
      let getId, personsArr;

      personsArr = userData.getPersonData();

      if ('delete-result-btn_'.indexOf(e.target.id)) {
        getId = parseInt(e.target.id.split('_')[1]);
        personsArr.forEach((person, i) => {
          if (person.id === getId) {
            personsArr.splice(i, 1);
            userData.setPersonData(personsArr);
          }
        });
      }
    },

    clearResultsList: userData => {
      let conf;
      if (userData.getPersonData() !== null) {
        if (userData.getPersonData().length > 0) {
          conf = confirm('Warning! You will lose entire result list');

          if (conf) {
            userData.removePersonData();
            domItems.resultsListWrapper.innerHTML = '';
          }
        }
      }
    },
  };
})();

/**********************
 * Controller
 **********************/
var controller = (function(quizCtrl, UICtrl) {
  var selectedDomItems = UICtrl.getDomItems;
  UICtrl.addInputsDynamically();

  UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

  selectedDomItems.questInsertBtn.addEventListener('click', function() {
    var adminOptions = document.querySelectorAll('.admin-option');
    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );
    if (checkBoolean) {
      UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
  });

  selectedDomItems.insertedQuestionWrapper.addEventListener('click', function(e) {
    UICtrl.editQuestList(
      e,
      quizCtrl.getQuestionLocalStorage,
      UICtrl.addInputsDynamically,
      UICtrl.createQuestionList
    );
  });

  // To clear all question list after clicking clear all button
  selectedDomItems.questClearBtn.addEventListener('click', function() {
    UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
  });

  // To display all questions
  UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);

  // Work on progress bar
  UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

  // to check the quiz answer
  selectedDomItems.quizOptionWrapper.addEventListener('click', e => {
    let updatedOptionsDiv = selectedDomItems.quizOptionWrapper.querySelectorAll('div');
    updatedOptionsDiv.forEach((divEl, i) => {
      if (e.target.className === `choice-${i}`) {
        let answer = document.querySelector(`.quiz-options-wrapper div p.${e.target.className}`);
        let answerResult = quizCtrl.checkAnswer(answer);

        UICtrl.newDesign(answerResult, answer);

        if (quizCtrl.isFinished()) {
          selectedDomItems.nextQuestBtn.textContent = 'Finish';
        }

        let nextQuestion = (questData, progress) => {
          if (quizCtrl.isFinished()) {
            // Finish quiz
            quizCtrl.addPerson();
            UICtrl.finalResult(quizCtrl.getCurrPersonData);
          } else {
            UICtrl.resetDesign();
            progress.questionIndex++;
            UICtrl.displayQuestion(questData, progress);
            UICtrl.displayProgress(questData, progress);
          }
        };

        selectedDomItems.nextQuestBtn.onclick = () => {
          nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
        };
      }
    });
  });

  // Start quiz method
  selectedDomItems.startQuizBtn.addEventListener('click', () => {
    UICtrl.getFullName(
      quizCtrl.getCurrPersonData,
      quizCtrl.getQuestionLocalStorage,
      quizCtrl.getAdminFullName
    );
  });

  // Insert data on click enter btn
  selectedDomItems.lastNameInput.addEventListener('focus', () => {
    selectedDomItems.lastNameInput.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        UICtrl.getFullName(
          quizCtrl.getCurrPersonData,
          quizCtrl.getQuestionLocalStorage,
          quizCtrl.getAdminFullName
        );
      }
    });
  });

  UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

  // Delete one result from admin page
  selectedDomItems.resultsListWrapper.addEventListener('click', e => {
    UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
  });

  // Clear all results from admin area
  selectedDomItems.clearResultsBtn.addEventListener('click', e => {
    UICtrl.clearResultsList(quizCtrl.getPersonLocalStorage);
  });
})(quizController, UIController);
