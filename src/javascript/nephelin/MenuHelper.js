'use strict';
/**
 * Created by sirmonkey on 5/26/15.
 */

function getMenu() {
    return $(".menu");
}
module.exports.getMenu = getMenu;

function getMenuItems() {
    return $(".menuItem");
}
module.exports.getMenuItems = getMenuItems;

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
module.exports.getMenuItem = getMenuItem;