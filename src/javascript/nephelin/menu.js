"use strict";
/**
 * Created by tobias on 06.05.15.
 */

var menu;
var menuItem;
var dropDown;
var dropDownItem;

function getMenu() {
    return $(".menu");
}

function getMenuItems() {
    return $(".menuItem");
}

function getMenuItem(name) {
    try {
        var menuItems = getMenuItems();
        for (var i = 0; i < menuItems.length; i += 1) {
            if (menuItems[i].innerText === name) {
                return menuItems[i];
            }
        }
    } catch (e) {
        console.log("menuItem not found: " + name);
    }

}

module.exports.addMenuItem = function addMenuItem(name) {
    var item = document.createElement("li");
    var drop = document.createElement("ul");
    item.innerHTML = name;
    item.classList.add('menuItem');
    drop.classList.add(name);
    drop.classList.add('dropDown');
    item.appendChild(drop);
    getMenu().append(item);
};

module.exports.removeMenuItem = function removeMenuItem(name) {
    try {
        getMenuItem(name).remove();
    } catch (e) {
        console.log("Cannot remove " + name);
    }
};

module.exports.addDropDownItem = function addDropDownItem(menuItem, name, f) {
    try {
        var drop = $("." + menuItem);
        var li = document.createElement("li");
        li.classList.add("dropDownItem");
        li.innerHTML = name;
        li.onclick = f;
        drop.append(li);
    } catch (e) {
        console.log("Cannot find " + menuItem);
    }
};

module.exports.removeDropDownItem = function removeDropDownItem(menuItem, name) {
    try {
        var drop = $("." + menuItem + " li");
        console.log(drop);
        for (var i = 0; i < drop.length; i += 1) {
            console.log(drop[i]);
            if (drop[i].innerText === name) {
                drop[i].remove();
            }
        }
    } catch (e) {
        console.log(e.message);
    }
};


/*

 var menuLabel = document.querySelector('.menu-title');
 var menu = document.querySelector('.menu');
 var menuItem = document.querySelectorAll('.menuItem');
 var menuItemArray = Array.prototype.slice.call(menuItem,0);

 //Todo: Überprüfen ob die ID schon vergeben ist
 module.exports.addMenuItem = function addMenuItem(name){
 var li = document.createElement("li");
 var d = document.createElement("a");
 var node = document.createTextNode(name);

 $(".menuItem").click(function(){ console.log("workin"); return false; });

 d.id = name;
 d.classList.add('menuItem');

 menuItemArray.push(d);

 console.log(d);
 d.appendChild(node);
 li.appendChild(d);
 menu.appendChild(li);

 console.log(d.id + " created");

 };

 //TODO Bug <li> is not removed
 module.exports.removeMenuItem = function removeMenuItem(name){
 try{
 var a = document.getElementById(name);
 a.parentNode.removeChild(a);
 menuItemArray.splice(menuItemArray.indexOf(a),1);
 console.log(a.id+" removed");
 } catch(e) {
 console.log("item "+name+" not found");
 console.log(e);
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
 */

