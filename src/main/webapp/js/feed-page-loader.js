var cursorCurrent;
var flagfetch=true;
var fetchproceed=true;


function showMessageFormIfViewingSelf() {

    fetch('/login-status')
        .then((response) => {
            return response.json();
        })
        .then((loginStatus) => {
            if (loginStatus.isLoggedIn) {
                const messageForm = document.getElementById('message-form');
                messageForm.classList.remove('hidden');

            }
        });
}


// Fetch messages and add them to the page.
function fetchMessages(cursor) {
    var url = '/feed';
    if (cursor) {
        url = `${url}?cursor=${cursor}`;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    if (tag!=null){
        if (cursor) {
            url=url+"&tag="+tag;
        }
        else {
            url=url+"?tag="+tag;
        }
    }
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
        if (messages.length==1){
            flagfetch=false;
        }
        cursorCurrent=messages[messages.length-1];
        var dict = {};
        messages.forEach((message,value) => {
            if (value==messages.length-1){
                return;
            }
            const url = '/about?user=' + message.user;
            if (dict[message.user]==undefined){
                userPromises.push(fetch(url)
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        dict[message.user]=res;
                    }));
            }
        });

        Promise.all(userPromises).then(values => {
            messages.forEach((message,index) => {
                if (index==messages.length-1){
                    return;
                }
                //setting the variables to html elements.
                const messageDiv = buildMessageDiv(message,  dict[message.user],loginStatusGlobal);
                messageContainer.appendChild(messageDiv);
            });
        }).then(res=>{
            fetchproceed=true;
            addModalViewforlikes();
        });
    });

}

/** Fetches BlobstoreUrl for the Message Form. */
function fetchBlobstoreUrlAndShowMessageForm() {
    fetch('/blobstore-upload-url?type=message')
        .then((response) => {
            return response.text();
        })
        .then((imageUploadUrl) => {
            const messageForm = document.getElementById('msg-form');
            messageForm.action = imageUploadUrl;
            messageForm.classList.remove('hidden');
        });
}



var loadMore = function() {
    if (flagfetch==true && fetchproceed==true){
        fetchproceed=false;
        fetchMessages(cursorCurrent);
    }
}

function addListnerForInfiniteScroll() {
    // Detect when scrolled to bottom.
    window.addEventListener('scroll', function() {

        // Fetch variables
        var scrollTop = $(document).scrollTop();
        var windowHeight = $(window).height();
        var bodyHeight = $(document).height() - windowHeight;
        var scrollPercentage = (scrollTop / bodyHeight);

        // if the scroll is more than 90% from the top, load more content.
        if(scrollPercentage > 0.8) {
            if (cursorCurrent!=undefined && flagfetch==true && fetchproceed==true){
                fetchproceed==false;
                loadMore();
            }
        }

    });
}
// Fetch data and populate the UI of the page.
function buildUI() {
    fetchBlobstoreUrlAndShowMessageForm();
    showMessageFormIfViewingSelf();
    loadNavigation();
    fetchMessages("");
    addListnerForInfiniteScroll();
    addModalViewforlikes();
    addButtonEventForDelete();

}
