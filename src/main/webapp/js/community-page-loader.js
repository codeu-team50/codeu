/** Fetches users and adds them to the page. */
function fetchUserList(){
  const url = '/user-list';
  fetch(url).then((response) => {
    return response.json();
  }).then((users) => {
    const list = document.getElementById('list');
    list.innerHTML = '';
    users.forEach((user) => {
     const userListItem = createlikedUserTemplate(user);
     list.appendChild(userListItem);
    });
  });
}

/**
 * Builds a list element that contains a link to a user page, e.g.
 * <li><a href="/user-page.html?user=test@example.com">test@example.com</a></li>
 */
function buildUserListItem(user){
  const userLink = document.createElement('a');
  userLink.setAttribute('href', '/user-page.html?user=' + user);
  userLink.appendChild(document.createTextNode(user));
  const userListItem = document.createElement('li');
  userListItem.appendChild(userLink);
  return userListItem;
}



function createlikedUserTemplate(user) {
  var userDiv = document.createElement('div');
  userDiv.className += "col-lg-3 col-md-4 col-sm-6 col-12";
  var htmlString=`
            <div class="company_profile_info">
              <div class="company-up-info">
                <img id="user-imageUrl" src="" alt="">
                <h3 id="user-nickname">John Doe</h3>
                <h4 id="user-email">Graphic Designer</h4>
              </div>
              <a id="user-link" href="#" title="" class="view-more-pro">View Profile</a>
            </div>`;
  userDiv.innerHTML+= htmlString.trim();
  var message_nickname=userDiv.querySelector("#user-nickname");
  var message_email=userDiv.querySelector("#user-email");
  var message_link=userDiv.querySelector("#user-link");
  var user_imageUrl=userDiv.querySelector("#user-imageUrl");
  message_link.href="/user-page.html?user="+user.email;
  if (user.nickName == undefined) {
    message_nickname.innerHTML=`<a style="font-size: 16px;" href="`+"/user-page.html?user="+user.email +`">`+"User"+`</a>`;
    message_email.innerHTML=user.email;
  }
  else {
    message_nickname.innerHTML=`<a style="font-size: 16px;" href="`+"/user-page.html?user="+user.email +`">`+user.nickName+`</a>`;
    message_email.innerHTML=user.email;
  }
  //Sample Image url if the image is not there.
  var imageUrl=user.imageUrl;
  if (imageUrl == undefined) {
    imageUrl = 'https://www.iei.unach.mx/images/imagenes/profile.png';
  }
  user_imageUrl.src=imageUrl;
  return userDiv;
}


/** Fetches data and populates the UI of the page. */
function buildUI(){
  loadNavigation();
  fetchUserList();
}
