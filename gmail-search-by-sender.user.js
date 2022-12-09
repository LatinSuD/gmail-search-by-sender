// ==UserScript==
// @name         GMail Search by Sender
// @namespace    https://latinsud.com/
// @version      0.2
// @description  Search by sender, quick read, then mark as read, without the hassle
// @author       LatinSuD
// @match        https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // jQuery on the cheap
    function $(elem) {
        return document.querySelector(elem);
    }
    function $$(elem) {
        return document.querySelectorAll(elem);
    }


    var myDiv=null;
    var myBar;


    // 1. Append first Sender to Search query
    function myfunc1() {
        $('INPUT[name="q"]').value += " from:" + $('DIV[role="main"] SPAN[email]').getAttribute('email');
        // Identify search button by the SVG icon. There should be a better way (I can't rely on a particular language)
        var mySearch = $('PATH[d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"]').parentElement.parentElement;

        mySearch.click()
    }


    // 2. Select All
    function myfunc2() {
        // Select All
        myBar.querySelector('SPAN[role="checkbox"]').click()

        setTimeout(function() {
            var myButtonList = $$('.bAO');
            // Double check we're on the right button. I don't want to mess things up if Gmail changes.
            myButtonList.forEach(function(myButton){
                if (getComputedStyle(myButton).backgroundImage.match(/drafts/)) {
                    var myNode = myButton;
                    // Sometimes there are multiple "mark-as-read" icons, but only one shold be visible
                    while (myNode) {
                        if (myNode.style.display=='none') return;
                        myNode = myNode.parentElement;
                    }

                    myButton.parentElement.parentElement.dispatchEvent(new MouseEvent('mousedown'));
                    myButton.parentElement.parentElement.dispatchEvent(new MouseEvent('mouseup'));
                    setTimeout(function() { history.back(); }, 1);
                }
            })
        }, 1);

    }


    // Setup
    function myInstall() {


        myBar = $("DIV[gh='mtb']");
        if (!myBar) return;

        if ($("DIV[gh='mtb'] BUTTON.my-gmail-search-by-sender")) {
            // already installed
            return;
        }

        //var foundMyBar=false;
        var myCandidate=myDiv;
        var limit = 0;
        while (myCandidate && myCandidate.nodeName != "BODY") {
            /*
            if (myCandidate===myBar) {
                foundMyBar=true;
            }
            */
            myCandidate = myCandidate.parentElement;
        }

        var myRoot = myCandidate;


        // Add buttons

        myDiv=document.createElement('DIV')
        myDiv.innerHTML="<button type='button' class='my-gmail-search-by-sender' style='margin-right: 0.5em; cursor: pointer' onclick=myfunc1>1. Search 1st</button>"
        myDiv.style.zIndex=9999;
        myDiv.addEventListener('click', myfunc1)
        if (myBar) {
            myBar.children[0].children[0].append(myDiv)
        }

        myDiv=document.createElement('DIV')
        myDiv.innerHTML="<button type='button' style='margin-right: 0.5em; cursor: pointer' onclick=myfunc2>2. Mark All Read</button>"
        myDiv.style.zIndex=9999;
        myDiv.addEventListener('click', myfunc2)
        if (myBar) {
            myBar.children[0].children[0].append(myDiv)
        }


    }

    // This is the best I could come up with
    setInterval(myInstall, 100);

})();
