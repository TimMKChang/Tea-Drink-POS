// Constructor Function ES2015
class TeaDrinkPos {
  constructor() { };
  // display menu item
  displayMenuItem(category) {
    let htmlContent = "";
    Object.keys(itemProvide[category]).forEach(key => {
      htmlContent += `
      <div class="menu-item">
        <div class="menu-item-img">
          <div class="item-price">
            <div class="title">$</div>
            <div class="value">${itemProvide[category][key]}</div>
          </div>
          <div class="item-name">${key}</div>
        </div>
      </div>
    `;
    });
    document.querySelector(".menu-list").innerHTML = htmlContent;
    // background image
    document.querySelectorAll(".menu-item-img").forEach(function (menuItemImg) {
      const categoryBackgroundImgURL = {
        "Fresh Tea": "/icon/Fresh_Tea_icon.png",
        "Milk Tea": "/icon/Milk_Tea_icon.png",
        "Fresh Juice": "/icon/Fresh_Juice_icon.png",
        "Hot Drinks": "/icon/Hot_Drinks_icon.png",
      };
      menuItemImg.style.backgroundImage = `url("${categoryBackgroundImgURL[category]}")`;
    });
  };
  // switch nav item active
  switchNavItemActive(navItemActive) {
    const navItems = document.querySelectorAll(".navbar-nav .nav-item");
    navItems.forEach(navItem => {
      navItem.classList.remove("active");
    });
    navItemActive.classList.add("active");
  };
  addOrderItem(orderCount) {
    let htmlContent = `
      <div class="order-item" draggable="true" data-order-count="${orderCount}" data-toggle="modal" data-target="#drinkSpecial">
        <div class="item-content">
          <div class="item-name">${orderListObject[orderCount].name}</div>
          <div class="item-special"></div>
        </div>
        <div class="quantity-price-container">
          <div class="item-quantity">1</div>
          <div class="item-price">
            <div class="title">$</div>
            <div class="value">${orderListObject[orderCount].price}</div>
          </div>
        </div>
      </div>
    `;
    document.querySelector(".order-list").insertAdjacentHTML("afterbegin", htmlContent);
  };
  displayDrinkSpecialModal(orderCount) {
    const drinkspecial = document.querySelector("#drinkSpecial");
    drinkspecial.dataset.orderCount = orderCount;
    const modalTitle = document.querySelector("#drinkSpecial .modal-title");
    modalTitle.innerHTML = orderListObject[orderCount].name;

    // some special prohibit
    // ice
    this.iceOptionProhibit(orderListObject[orderCount].name);
    // sugar
    this.sugarOptionProhibit(orderListObject[orderCount].name);

    // loading save
    document.querySelectorAll("#drinkSpecial .ice input").forEach(function (option) {
      if (option.value === orderListObject[orderCount].ice) {
        option.checked = "checked";
        option.parentElement.classList.add("active");
      } else {
        option.parentElement.classList.remove("active");
      }
    });
    document.querySelectorAll("#drinkSpecial .sugar input").forEach(function (option) {
      if (option.value === orderListObject[orderCount].sugar) {
        option.checked = "checked";
        option.parentElement.classList.add("active");
      } else {
        option.parentElement.classList.remove("active");
      }
    });
    document.querySelectorAll("#drinkSpecial .extra input").forEach(function (option) {
      if (orderListObject[orderCount].extra.includes(option.value)) {
        option.parentElement.classList.add("active");
      } else {
        option.parentElement.classList.remove("active");
      }
    });
    document.querySelector("#drinkSpecial .quantity .value").innerHTML = orderListObject[orderCount].quantity;
    // reset isFirstClick false
    document.querySelector(".quantity").dataset.isFirstClick = "true";
  };
  saveDrinkSpecial(orderCount) {
    // clear first
    orderListObject[orderCount].extra.splice(0, orderListObject[orderCount].extra.length);

    document.querySelectorAll("#drinkSpecial .ice input").forEach(function (option) {
      if (option.checked) {
        orderListObject[orderCount].ice = option.value;
      }
    });
    document.querySelectorAll("#drinkSpecial .sugar input").forEach(function (option) {
      if (option.checked) {
        orderListObject[orderCount].sugar = option.value;
      }
    });
    document.querySelectorAll("#drinkSpecial .extra input").forEach(function (option) {
      if (option.parentElement.matches(".active")) {
        orderListObject[orderCount].extra.push(option.value);
      }
    });
    if (Number(document.querySelector("#drinkSpecial .quantity .value").innerHTML) !== 0) {
      orderListObject[orderCount].quantity = document.querySelector("#drinkSpecial .quantity .value").innerHTML;
    } else {
      orderListObject[orderCount].quantity = 1;
    }
  };
  displayDrinkSpecialOrderItem(orderCount) {
    const htmlcontent = [];
    if (orderListObject[orderCount].ice !== "Regular Ice") {
      htmlcontent.push(orderListObject[orderCount].ice);
    }
    if (orderListObject[orderCount].sugar !== "Regular Sugar") {
      htmlcontent.push(orderListObject[orderCount].sugar);
    }
    if (orderListObject[orderCount].extra.length !== 0) {
      htmlcontent.push(...orderListObject[orderCount].extra);
    }
    document.querySelectorAll(".order-item").forEach(function (item) {
      if (item.dataset.orderCount === orderCount.toString()) {
        item.querySelector(".item-special").innerHTML = htmlcontent.join(", ");
        // extra cost
        item.querySelector(".value").innerHTML = Number(orderListObject[orderCount].price) + orderListObject[orderCount].extra.length * 5;
        item.querySelector(".item-quantity").innerHTML = orderListObject[orderCount].quantity;
      }
    });
  };
  calculateTotal() {
    let total = 0;
    document.querySelectorAll(".order-item").forEach(function (item) {
      const quantity = Number(item.querySelector(".item-quantity").innerHTML);
      const price = Number(item.querySelector(".value").innerHTML);
      total += quantity * price;
    });
    document.querySelector(".total-amount .value").innerHTML = total;
  };
  deleteOrderItem(draggedItem) {
    delete orderListObject[draggedItem.dataset.orderCount];
    draggedItem.remove();
    teaDrinkPos.calculateTotal();
  };
  clearData() {
    Object.keys(orderListObject).forEach(function (key) {
      delete orderListObject[key];
    });
    document.querySelector(".order-list").innerHTML = "";
    teaDrinkPos.calculateTotal();
  };
  displayTableNumberModal() {
    document.querySelector("#table-number-modal .value").innerHTML = document.querySelector(".table-number .btn").innerHTML;
  };
  resetTableNumber() {
    document.querySelector(".table-number .btn").innerHTML = "A1";
  };


  iceOptionProhibit(itemName) {
    // Hot Drinks
    if (Object.keys(itemProvide["Hot Drinks"]).includes(itemName)) {
      document.querySelector(".ice .prohibit-cover").classList.add("prohibit-cover-on");
    } else {
      document.querySelector(".ice .prohibit-cover").classList.remove("prohibit-cover-on");
    }
  };
  sugarOptionProhibit(itemName) {
    // Fresh Juice
    if (Object.keys(itemProvide["Fresh Juice"]).includes(itemName)) {
      document.querySelector(".sugar .prohibit-cover").classList.add("prohibit-cover-on");
    } else {
      document.querySelector(".sugar .prohibit-cover").classList.remove("prohibit-cover-on");
    }
  };
}

class Drink {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.quantity = 1;
    this.ice = "Regular Ice";
    this.sugar = "Regular Sugar";
    this.extra = [];
  };
}
// new Instance
const teaDrinkPos = new TeaDrinkPos();

// drink item and price
const itemProvide = {
  "Fresh Tea": {
    "Green Tea": 25,
    "Black Tea": 25,
    "Oolong Tea": 25,
    "Mountain Tea": 35,
    "Puer Tea": 35,
    "Lemon Green Tea": 35,
    "Yogurt Green Tea": 40,
    "Premium Oolong Tea": 35,
    "Ceylon Black Tea": 30,
  },
  "Milk Tea": {
    "Milk Tea": 35,
    "Milk Green Tea": 35,
    "Milk Oolong Tea": 35,
    "Bubble Milk Tea": 40,
    "Ice Cream Milk Tea": 45,
  },
  "Fresh Juice": {
    "Lemon Juice": 45,
    "Grapefruit Juice": 45,
    "Plum Lemon Juice": 45,
  },
  "Hot Drinks": {
    "Longan Tea": 55,
    "Ginger Tea": 55,
  },
};

// switch between types of drinks
document.querySelector(".navbar-nav").addEventListener("click", function (event) {
  if (event.target.matches("a")) {
    teaDrinkPos.switchNavItemActive(event.target.closest(".nav-item"));
    teaDrinkPos.displayMenuItem(event.target.innerHTML);
  }
});
// initial display type
teaDrinkPos.displayMenuItem("Fresh Tea");

// order item
const orderListObject = {
  // 1: Drink,
};
let orderCount = 0;

document.querySelector(".menu-list").addEventListener("click", function (event) {
  const menuItem = event.target.closest(".menu-item-img");
  if (menuItem) {
    const name = menuItem.querySelector(".item-name").innerHTML;
    const price = menuItem.querySelector(".value").innerHTML;
    orderListObject[++orderCount] = new Drink(name, price);
    teaDrinkPos.addOrderItem(orderCount);
    teaDrinkPos.calculateTotal();
  }
});

// add drink special
document.querySelector(".order-list").addEventListener("click", function (event) {
  const orderItem = event.target.closest(".order-item");
  if (orderItem) {
    teaDrinkPos.displayDrinkSpecialModal(orderItem.dataset.orderCount);
  }
});

// save drink special
document.querySelector("#drinkSpecial .save-btn").addEventListener("click", function (event) {
  teaDrinkPos.saveDrinkSpecial(document.querySelector("#drinkSpecial").dataset.orderCount);
  teaDrinkPos.displayDrinkSpecialOrderItem(document.querySelector("#drinkSpecial").dataset.orderCount);
  teaDrinkPos.calculateTotal();
});

// change quantity
document.querySelector(".quantity").addEventListener("click", function (event) {
  if (event.target.value !== undefined) {
    if (event.target.value === "C") {
      document.querySelector("#drinkSpecial .quantity .value").innerHTML = 0;
      return;
    }
    if (document.querySelector(".quantity").dataset.isFirstClick === "true") {
      document.querySelector("#drinkSpecial .quantity .value").innerHTML = event.target.value;
    } else {
      const nowQuantity = Number(document.querySelector("#drinkSpecial .quantity .value").innerHTML);
      document.querySelector("#drinkSpecial .quantity .value").innerHTML = nowQuantity * 10 + Number(event.target.value);
    }
    // set isFirstClick false
    document.querySelector(".quantity").dataset.isFirstClick = "false";
  }
});

// checkout
document.querySelector(".checkout .btn").addEventListener("click", function (event) {
  event.stopImmediatePropagation();
  if (Number(document.querySelector(".total-amount .value").innerHTML) === 0) {
    swal("Order something now!", "", "error");
    return;
  }
  swal(`Total amount is $ ${document.querySelector(".total-amount .value").innerHTML}`, "", "success");
  document.querySelector(".swal-button").addEventListener("click", function (event) {
    teaDrinkPos.clearData();
    teaDrinkPos.resetTableNumber();
  }, { once: true });
});

// ----------------------------------------------------------------------------
// display table number on modal
document.querySelector(".table-number .btn").addEventListener("click", function (event) {
  teaDrinkPos.displayTableNumberModal();
});

// change table number
document.querySelector("#table-number-modal").addEventListener("click", function (event) {
  if (event.target.closest(".table-number-area") && event.target.value !== undefined) {
    document.querySelector("#table-number-modal .value").innerHTML = event.target.value;
  } else if (event.target.closest(".table-number-number") && event.target.value !== undefined) {
    if (event.target.value === "C") {
      document.querySelector("#table-number-modal .value").innerHTML = "";
      return;
    }
    document.querySelector("#table-number-modal .value").innerHTML += event.target.value;
  }
});

// save table number
document.querySelector("#table-number-modal .save-btn").addEventListener("click", function (event) {
  if (document.querySelector("#table-number-modal .value").innerHTML === "") {
    teaDrinkPos.resetTableNumber();
    return;
  }
  document.querySelector(".table-number .btn").innerHTML = document.querySelector("#table-number-modal .value").innerHTML;
});




// delete order item
// drag and drop
let draggedItem;

document.addEventListener("dragstart", function (event) {
  event.target.style.opacity = "0.3";
  // console.log("start");
  draggedItem = event.target;
});

document.addEventListener("dragend", function (event) {
  event.target.style.opacity = "1";
  // console.log("end");
});
// dragover一定要event.preventDefault();才能使用drop
document.addEventListener("dragover", function (event) {
  // prevent default to allow drop
  event.preventDefault();
});

document.addEventListener("dragenter", function (event) {
  if (event.target.matches(".recycle-bin .fa-trash-alt")) {
    // console.log("enter");
    event.target.style.backgroundColor = "#FF2D2D";
  }
});

document.addEventListener("dragleave", function (event) {
  if (event.target.matches(".recycle-bin .fa-trash-alt")) {
    // console.log("leave");
    event.target.style.backgroundColor = "#FF7575";
  }
});

document.addEventListener("drop", function (event) {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  if (event.target.matches(".recycle-bin .fa-trash-alt")) {
    event.target.style.backgroundColor = "#FF7575";
    // console.log("drop");
    teaDrinkPos.deleteOrderItem(draggedItem);
  }
});





// just kidding
document.querySelector(".just-kidding").addEventListener("click", function (event) {
  swal("I can't return to homepage.", "", "info");
})

