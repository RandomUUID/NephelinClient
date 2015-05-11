/**
 * Created by tobias on 06.05.15.
 */
var menu = document.querySelector('.dropdown');
var menuArray = Array.prototype.slice.call(menu,0);
var menuItem = document.querySelectorAll('.menuItem');
var menuItemArray = Array.prototype.slice.call(menuItem,0);
var menuLabel = document.querySelector('.menu-title');
var menuLabelArray = Array.prototype.slice.call(menuLabel,0);

//Todo: Überprüfen ob die ID schon vergeben ist
module.exports.addMenuItem = function addMenuItem(name, action, menuName){
    var li = document.createElement("li");
    var a = document.createElement("a");
    var node = document.createTextNode(name);

    a.setAttribute("href", action);
    a.id = name;
    a.classList.add('menuItem');

    menuItemArray.push(a);

    a.appendChild(node);
    li.appendChild(a);

    try{
        m = document.getElementById(menuName);
        console.log(m.childElementCount)
    } catch(e) {
        console.log(menu+" not found")
    }

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


module.exports.changeMenuLabel = function changeMenuLabel(newLabel, menuid){
    try{
       var m = document.getElementById(menuid);
        m.innerHTML = newLabel
    } catch(e) {
        console.log(menuid+" not found")
        console.log(e.message)
    }
};

module.exports.changeMenuItemLabel = function changeMenuItemLabel(itemNr, name){
    menuItemArray[itemNr].innerHTML = name;
};

module.exports.getAllMenuItems = function getAllMenuItems(){
    return menuItemArray;
};


