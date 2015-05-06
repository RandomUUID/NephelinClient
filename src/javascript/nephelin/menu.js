/**
 * Created by tobias on 06.05.15.
 */

var menuLabel = document.querySelector('.menu-title');
var menu = document.querySelector('.dropdown');
var menuItem = document.querySelectorAll('.menuItem');
var menuItemArray = Array.prototype.slice.call(menuItem,0);

//Todo: Überprüfen ob die ID schon vergeben ist
module.exports.addMenuItem = function addMenuItem(name, link){
    var li = document.createElement("li");
    var a = document.createElement("a");
    var node = document.createTextNode(name);

    a.setAttribute("href", link);
    a.id = name;
    a.classList.add('menuItem');

    menuItemArray.push(a);

    a.appendChild(node);
    li.appendChild(a);
    menu.appendChild(li);

    console.log(a.id + " created")

};

//TODO Bug <li> is not removed
module.exports.removeMenuItem = function removeMenuItem(name){
    try{
        var a = document.getElementById(name);
        a.parentNode.removeChild(a);
        menuItemArray.splice(menuItemArray.indexOf(a),1);
        console.log(a.id+" removed")
    } catch(e) {
        console.log("item "+name+" not found")
        console.log(e)
    }
};

module.exports.changeMenuLabel = function changeMenuLabel(name){
    menuLabel.innerHTML = name;
};

module.exports.changeMenuItemLabel = function changeMenuItemLabel(itemNr, name){
    menuItemArray[itemNr].innerHTML = name;
};

module.exports.getAllMenuItems = function getAllMenuItems(){
    return menuItemArray;
};


