/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Adds a login or logout link to the page, depending on whether the user is
 * already logged in.
 */
function addLoginOrLogoutLinkToNavigation() {
    const navigationElement = document.getElementById('nav-buttons');
    if (!navigationElement) {
        console.warn('Navigation element not found!');
        return;
    }

    fetch('/login-status')
        .then((response) => {
            return response.json();
        })
        .then((loginStatus) => {
            if (loginStatus.isLoggedIn) {
                navigationElement.innerHTML+=createLink(
                    '/user-page.html?user=' + loginStatus.username, 'Your Page');

                navigationElement.innerHTML+=
                    createLink('/logout', 'Logout');
            } else {
                navigationElement.innerHTML+=
                    createLink('/login', 'Login');
            }
        });
}

/**
 * Creates an li element.
 * @param {Element} childElement
 * @return {Element} li element
 */


/**
 * Creates an anchor element.
 * @param {string} url
 * @param {string} text
 * @return {Element} Anchor element
 */
function createLink(url, text) {
    const linkElement = `<a style="margin-right: 4px" class="btn btn-outline-light my-2 my-sm-0" href="` + url + `">` + text + `</a>`;
    return linkElement;
}

function loadNavigation() {
    loadContent();
    addLoginOrLogoutLinkToNavigation();

}

function loadContent() {
    var url = window.location.href;     // Returns full URL (https://example.com/path/example.html) #0c233b
    var origin = window.location.origin;
    var path = url.replace(origin);

    const navigationbar = document.getElementById('navigation-bar');
    const content = ` <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color:rgba(0, 23, 70, 0.8);">
        <div class="container">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
           <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navigation">
            <ul class="navbar-nav mr-auto" >
                <li  class="nav-item">
                    <a id="nav-li-home" class="nav-link" href="/">HOME</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/feed.html">PUBLIC FEED</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/community.html">COMMUNITY</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/find-your-travel-place.html">EXPLORE</a>
                </li>
                <li class="nav-item">
                      <a class="nav-link" href="/charts.html">ANALYTICS</a>
                </li>
                <li class="nav-item">
                      <a class="nav-link" href="/team.html">TEAM</a>
                </li>            
            </ul>
            <form class="form-inline" id="nav-buttons">
            </form>
        </div>
        </div>
    </nav>`;
    navigationbar.innerHTML += content;
    setNavigation();

}

function setNavigation() {
    // Get current path and find target link
    var url = window.location.href;
    var origin = window.location.origin;
    var path = url.replace(origin, '');

    if (path == "/") {
        $("ul.navbar-nav a").on("click", function () {
            $(this).addClass('active');
            $("#nav-li-home").removeClass('active');
        });
    }
    var target = $('nav a[href="' + path + '"]');
    // Add active class to target link
    target.addClass('active');


}

