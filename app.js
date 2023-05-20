(() => {
  const mainContainer = document.getElementsByTagName("main")[0];
  const addBtn = document.getElementById("add-btn");
  const droppables = document.querySelectorAll(".droppable");
  const toDoItemsContainer = document.getElementById("to-do-items");
  const doneItemsContainer = document.getElementById("done-items");
  let count = 0;

  /**
   * Create to-do list items
   * 1. drag icon
   * 2. textarea
   * 3. cancel icon
   */
  addBtn.addEventListener("click", function () {
    const newItem = document.createElement("li");
    newItem.dataset.item = ++count;
    newItem.draggable = true;
    newItem.classList.add("draggable");

    //adding dragging class when dragging item
    newItem.addEventListener("dragstart", () => {
      newItem.classList.add("dragging");
    });

    //remove dragging class when dragging is done
    newItem.addEventListener("dragend", () => {
      newItem.classList.remove("dragging");
    });

    const dragIcon = document.createElement("span");
    dragIcon.classList.add("material-symbols-outlined");
    dragIcon.classList.add("drag-icon");
    dragIcon.innerText = "drag_indicator";

    const checkboxInputEl = document.createElement("input");
    checkboxInputEl.setAttribute("type", "checkbox");

    const inpEl = document.createElement("textarea");
    inpEl.dataset.inputItem = count;

    const spanEl = document.createElement("span");
    spanEl.innerText = inpEl.value;

    const cancelIcon = document.createElement("span");
    cancelIcon.classList.add("material-symbols-outlined");
    cancelIcon.innerText = "close";

    newItem.appendChild(dragIcon);
    newItem.appendChild(checkboxInputEl);
    newItem.appendChild(inpEl);
    newItem.appendChild(cancelIcon);

    toDoItemsContainer.appendChild(newItem);
    inpEl.focus();
  });

  /**
   * Dynamic height change for any textarea in main
   * This enables multi-line to do list values
   */
  mainContainer.addEventListener("input", function (event) {
    const { target } = event;
    if (target.dataset.inputItem) {
      target.style.height = "0";
      target.style.height = target.scrollHeight + "px";
    }
  });

  /**
   * 1. marking items as done in the to do container
   * 2. removing items
   */
  toDoItemsContainer.addEventListener("click", function (event) {
    const { target } = event;
    //user marks this item from to-do to done so move it to bottom section
    if (target.type === "checkbox") {
      const item = getItem(target);
      target.nextElementSibling.classList.add("strike-through");
      toDoItemsContainer.removeChild(item);
      //done items should not be draggable anymore

      doneItemsContainer.appendChild(item);
    }
    //delete item
    if (target.textContent === "close") {
      deleteItem(target, toDoItemsContainer);
    }
  });

  /**
   * 1. marking items as to-do in the done container
   * 2. deleting items
   */
  doneItemsContainer.addEventListener("click", function (event) {
    const { target } = event;
    //user marks this item from done to to-do so move it to the top section
    if (target.type === "checkbox") {
      const item = getItem(target);
      target.nextElementSibling.classList.remove("strike-through");
      doneItemsContainer.removeChild(item);
      //to-do items should be draggable

      toDoItemsContainer.appendChild(item);
    }
    //delete item
    if (target.textContent === "close") {
      deleteItem(target, doneItemsContainer);
    }
  });

  function getItem(target) {
    const itemId = target.parentNode.dataset.item;
    return document.querySelector(`[data-item="${itemId}"]`);
  }

  function deleteItem(target, containerType) {
    const item = getItem(target);
    containerType.removeChild(item);
  }

  /**
   * Handling drag and drop functionality
   */
  droppables.forEach((container) => {
    container.addEventListener("dragover", (evt) => {
      evt.preventDefault();
      const afterElement = getDragAfterElement(container, evt.clientY);
      const draggableEl = document.querySelector(".dragging");
      const draggableParentNodeId = draggableEl.parentNode.id;
      //when moving items between to-do and done sections
      if (draggableParentNodeId !== container.id) {
        if (draggableParentNodeId === "to-do-items") {
          markItemAsDone(draggableEl);
        } else {
          markItemAsToDo(draggableEl);
        }
      }
      if (afterElement === null) {
        container.appendChild(draggableEl);
      } else {
        container.insertBefore(draggableEl, afterElement);
      }
    });
  });

  // ***** STAR of the show *****
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closestEl, draggableEl) => {
        const elBox = draggableEl.getBoundingClientRect();
        const offset = y - (elBox.top + elBox.height / 2);
        if (offset < 0 && offset > closestEl.offset) {
          return {
            offset,
            element: draggableEl,
          };
        } else {
          return closestEl;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
      }
    ).element;
  }

  function markItemAsToDo(item) {
    const children = item.childNodes;
    children[1].checked = false;
    children[2].classList.remove("strike-through");
  }

  function markItemAsDone(item) {
    const children = item.childNodes;
    children[1].checked = true;
    children[2].classList.add("strike-through");
  }
})();
