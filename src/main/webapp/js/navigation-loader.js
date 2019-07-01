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
    const navigationElement = document.getElementById('navigation');
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
                navigationElement.appendChild(createListItem(createLink(
                    '/user-page.html?user=' + loginStatus.username, 'Your Page')));

                navigationElement.appendChild(
                    createListItem(createLink('/logout', 'Logout')));
            } else {
                navigationElement.appendChild(
                    createListItem(createLink('/login', 'Login')));
            }
        });
}

/**
 * Creates an li element.
 * @param {Element} childElement
 * @return {Element} li element
 */
function createListItem(childElement) {
    const listItemElement = document.createElement('li');
    listItemElement.appendChild(childElement);
    return listItemElement;
}

/**
 * Creates an anchor element.
 * @param {string} url
 * @param {string} text
 * @return {Element} Anchor element
 */
function createLink(url, text) {
    const linkElement = document.createElement('a');
    linkElement.className += "btn btn-outline-success my-2 my-sm-0";
    linkElement.appendChild(document.createTextNode(text));
    linkElement.href = url;
    return linkElement;
}

function loadNavigation() {
    loadContent();
    addLoginOrLogoutLinkToNavigation();

}

function loadContent() {
    const navigationbar = document.getElementById('navigation-bar');
    const content = ` <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="/">HOME</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navigation">
            <ul class="navbar-nav mr-auto" >
                <li class="nav-item">
                    <a class="nav-link" href="/feed.html">PUBLIC FEED</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/find-your-hobby-place.html">SEARCH PLACES</a>
                </li>
                <li class="nav-item">
                      <a class="nav-link" href="/charts.html">ANALYTICS</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/stats.html">STATS</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/community.html">COMMUNITY</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/aboutus.html">TEAM</a>
                </li>            
            </ul>
        </div>
    </nav>`;
    navigationbar.innerHTML += content;

}
