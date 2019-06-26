// Fetch messages and add them to the page.
function fetchMessages() {
    const url = '/feed';
    var loginStatusGlobal;
    fetch('/login-status')
        .then((response) => {
            return response.json();
        }).then((loginStatus) => {
        // do stuff with `data`, call second `fetch`
        loginStatusGlobal = loginStatus;
        return fetch(url);
    }).then((response) => {
        return response.json();
    }).then(async (messages) => {
        const messageContainer = document.getElementById('message-container');
        if (messages.length == 0) {
            messageContainer.innerHTML += '<p>There are no posts yet.</p>';
        } else {
            messageContainer.innerHTML += '';
        }

        var userPromises = [];


        messages.forEach((message) => {
            const url = '/about?user=' + message.user;
            userPromises.push(fetch(url)
                .then(res => {return res.json(); }));
        });


        Promise.all(userPromises).then(values => {
            values.forEach((userPromise, index) => {
                //setting the variables to html elements.
                const messageDiv = buildMessageDiv(messages[index], userPromise,loginStatusGlobal);
                messageContainer.appendChild(messageDiv);
            });
        });
    });

}


// Fetch data and populate the UI of the page.

function buildUI() {
    loadNavigation();
    fetchMessages();
}
