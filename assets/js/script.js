var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// $(".list-group") tells jQuery to find all existing .list-group elements and on the click of the child element fo the function
// the event listeners on all p elements are delegated to the parent(.list-group); which is why there is an extra argument in the on method
$(".list-group").on("click", "p", function() {

  // 'this' is js native and will print the current element; w/ the $ character 'this' can be converted to a jQuery object 
  // the text() method will get the inner content of the currrent element
  // many jQuery methods can be chained together
  var text = $(this)
    .text()
    .trim();

  // jQuery can also create dynamic elements; $("<textarea>") creates a new element
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

    // to swap out the existing <p> element with the <textarea> element
  $(this).replaceWith(textInput);

  // to highlight the input box for the user; a highlighted element is considered in focus, an event that can be trigger programatically
  textInput.trigger("focus");
});

// the blur event will trigger as soon as the user interacts with anything other than the <textarea> element
$(".list-group").on("blur", "textarea", function() {

  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    // .replace() is a js operator to find and replace text in a string; 
    // jQuery and js operators can be chained together; .replace() is being chained to attr to remove "list-" from the text
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this) 
  .closest(".list-group-item")
  // index points out that child elements are zero indexed
  .index();

  // tasks is an object, tasks[status] returns an array, tasks[status][index] returns the object at the given index in the array
  // the following returns the text property of the object at the given index
  tasks[status][index].text = text;
  // updating the task was necessary for localStorage so save tasks
  saveTasks();

  // convert the <textarea> back into a <p> element
  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);
  // replace textarea with p element
  $(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    // with one argument .attr gets an attribute; with 2 arguments it sets an attribute
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function() {

  // get current text
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and resave to localStorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    // .addClass can add one or multiple class names at a time
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});

// the jQuery UI method .sortable() turned every element w/ the class list-group into sortable list
$(".card .list-group").sortable({

  // the connectwith property then linked the sortable lists with any other lists with the same class
  connectWith: $(".card .list-group"),

  // the scroll option, if set to true, the page scrolls when coming to an edge
  scroll: false,

  // the tolerance option specifies which mode to use for testing whether the item being moved is hovering over another item
  // possible values: intersect-the item overlaps the other item by at least 50% or pointer-the mouse pointer overlaps the other item
  tolerance: "pointer",

  // the helper option allows for a helper element to be used for draggind display
  // multiple types supported: string-if set to clone the element will be cloned and the clone will be dragged
  // or function-that will return a DOMElement to use while dragging; the function receives the event and the element being sorted
  helper: "clone",
  // the activate event is triggered when using connected lists, every connected list on drag start receives it
  activate: function(event) {
    // console.log("activate", this);
  },
  // the deactivate event is triggers when sorting has stopped, is propogated to all possible connected lists
  deactivate: function(event) {
    // console.log("deactivate", this);
  },
  // the over event is triggered when a sortable item is moved into a sortable list
  over: function(event) {
    // console.log("over", event.target);
  },
  // the out event is triggered when a sortable item is moved away from a sortable list
  out: function(event) {
    // console.log("out", event.target);
  },
  // the update event is triggered when the user stopped sorting and the DOM position has changed
  update: function(event) {
    
    // array to store the task data in
    var tempArr = [];

    // loop over current set of children in sortable list to retrieve the text and date from tasks
    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

      // add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });
    // trim down list's id to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // update array on tasjs object and save
    tasks[arrName] = tempArr;
    saveTasks();
  }
});

$("#trash").droppable({

  // the accept option controls which elements are accepted by the droppable
  accept: ".card .list-group-item",

  // tolerance option specifies which mode to use for testing whether a draggable is hovering over a droppable
  // 4 possible values: fit(draggable overlaps droppable completely), intersect(draggable overlaps the droppable at least 50% in both directions)
  // pointer(mouse pointer overlaps droppable) or touch(draggable overlaps the droppable any amount)
  tolerance: "touch",
  
  // drop event is triggered when an accepted draggable is dropped on the droppable
  drop: function(event, ui) {
    // remove method works like JS and will remove the element from the DOM entirely
    ui.draggable.remove();
    // console.log("drop");
  },

  // triggered when an accepted draggable is dragged over the droppable
  over: function(event, ui) {
    // console.log("over");
  },

  // triggered when an accepted draggable is dragged out of the droppable
  out: function(event, ui) {
    // console.log("out");
  }
});




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


