function buildMessageDiv(message,user,loginStatusGlobal) {
    var messageDiv = document.createElement('div');
    messageDiv.className += "post-bar";

    // const htmlString = ` <div class="card-header">
    //                 <div class="d-flex justify-content-between align-items-center">
    //                     <div class="d-flex justify-content-between align-items-center">
    //                         <div class="mr-2">
    //                             <img class="rounded-circle" width="45" id="message-dp" src="https://picsum.photos/50/50" alt="">
    //                         </div>
    //                         <div class="ml-2">
    //                             <div class="h5 m-0" id="message-nickname">Miracles Lee Cross</div>
    //                             <div class="h7 text-muted" id="message-time"> 10 min ago</div>
    //                         </div>
    //                     </div>
    //                     <div>
    //                     </div>
    //                     <div>
    //                         <div class="dropdown">
    //                             <button class="btn btn-link dropdown-toggle" type="button" id="d`+message.id+`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    //                                 <i class="fas fa-ellipsis-h"></i>
    //                             </button>
    //                             <div class="dropdown-menu dropdown-menu-right" aria-labelledby="d`+message.id+`">
    //                                 <a class="dropdown-item" href="#">Edit</a>
    //                                 <a class="dropdown-item" href="#">Delete</a>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //
    //             </div>
    //             <div class="card-body">
    //                  <div>
    //                 <p class="card-text" id="message-text">
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam omnis nihil, aliquam est,
    //                     voluptates officiis iure soluta
    //                     alias vel odit, placeat reiciendis ut libero! Quas aliquid natus cumque quae repellendus. Lorem
    //                     ipsum dolor sit amet consectetur adipisicing elit. Ipsa, excepturi. Doloremque, reprehenderit!
    //                     Quos in maiores, soluta doloremque molestiae reiciendis libero expedita assumenda fuga quae.
    //                     Consectetur id molestias itaque facere? Hic!
    //                 </p>
    //                 </div>
    //                 <div>
    //                 <img src="" class="post-img" id="message-dp" class="card-img-top hidden">
    //                 </div>
    //                 <div id="message-hashtags" class="card-body"></div>
    //             </div>
    //
    //             <div class="card-footer">
    //                 <a class="card-link __web-inspector-hide-shortcut__"><i class="fab fa-gratipay"></i> Like</a>
    //                 <button id="message-like_btn" href=""  onClick="likeMessage(this.id)" style="color:#78909C;font-size:125%;"  class="btn btn-light card-link"><i style="color:#78909C" class="fab fa-gratipay"></i><b  id="likes-count" style="color:#78909C">23</b></button>
    //                 <a style="color:#FFA726;font-size:125%;"   class="card-link"> <i class="fab fa-discord"></i> <b  style="color:#FFA726" id="message-score"></b></a>
    //                 <button id="text-to-speech"  class="btn btn-info btn-sm fas fa-volume-up float-right"></button>
    //             </div>`;



    var htmlString=` <div class="card mb-4">
                    <div class="post_topbar">
                        <div class="usy-dt">
                            <img src="img/us-pic.png" id="message-dp" alt="">
                            <div class="usy-name">
                                <h3 id="message-nickname" >John Doe</h3>
                                <span id="message-time"><img src="img/clock.png" alt="" style="width: 13px;" >3 min ago</span>
                            </div>
                        </div>
                        <div id="message-dropdown" class="ed-opts">
                            <div class="dropdown">
                                <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                                    <a id="message-delete"  onClick="return openModalViewforDelete(this.href);"  class="dropdown-item" href="#">Delete</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="job_descp">
                        <ul class="job-dt">
                            <li id="message-score"></li>
                        </ul>
                        <p id="message-text" >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam luctus hendrerit metus, ut ullamcorper quam finibus at. Etiam id magna sit amet</p>
                        <div class="card mb-4" id="image-card">
                        <img class="card-img-top" id="message-imageUrl" src="">
                        </div>
                        <div id="message-hashtags">
                        </div>
                    </div>
                    <div class="job-status-bar">
                        <ul class="like-com">
                            <li id="message-like-li">
                                <a style="cursor: pointer;" id="message-like-btn"  onClick="return likeMessage(this.id);" ><i class="fa fa-heart"></i> Like</a>
                                <img  class="hidden" src="img/liked-img.png" id="likes-img" alt="">
                                <span class="hidden likescount" id="likes-count">25</span>
                            </li>
                        </ul>
                        <a id="text-to-speech"><i class="fa fa-volume-up"></i></a>
                    </div>
                </div>`;


    messageDiv.innerHTML+= htmlString.trim();

    if(message.imageLabels!=null){
        message_hashtags= messageDiv.querySelector("#message-hashtags");
        var hashtagsStr='';
        for (var label in message.imageLabels) {
            url=''
            if (typeof parameterUsername == 'undefined'){
                url=url+'/feed.html?tag='+message.imageLabels[label];
            }
            else {
                url=url+'/user-page.html?user='+parameterUsername+'&tag='+message.imageLabels[label];
            }
            hashtagsStr+=`<a href="`+url+`" class="btn btn-outline-dark btn-sm" style="margin-left: 5px">#`+message.imageLabels[label]+`</a>`;
        }
        message_hashtags.innerHTML=hashtagsStr; }

    var message_text= messageDiv.querySelector("#message-text");
    message_text.innerHTML= message.text;

    var message_time=messageDiv.querySelector("#message-time");
    message_time.innerText=jQuery.timeago(new Date((message.timestamp)));                                                                                                                                                                                                                                                                                                                                                                                                                                                             ;

    var message_score = messageDiv.querySelector("#message-score");
    message_score_icon= messageDiv.querySelector("#message-score-icon");

    if(message.score<0){
        message_score.innerHTML=`<a disabled href="" style="background-color:#e25454;" title=""><i class="fa fa-frown"></i>   Negative (`+message.score.toFixed(2)+`)</a>`;
    }else if(message.score==0){
        message_score.innerHTML=`<a disabled href="" style="background-color:#ccbb4a;"  title=""><i class="fa fa-meh"></i>   Neutral (`+message.score.toFixed(2)+`)</a>`;
    }else{
        message_score.innerHTML=`<a disabled href="" style="background-color:#53d690;" title=""><i class="fa fa-smile-beam"></i>   Positive (`+message.score.toFixed(2)+`)</a>`;
    }


    var speech_generator= messageDiv.querySelector("#text-to-speech");
    speech_generator.addEventListener('click', () => {
        playAudio(message.text);
    });

    var message_dp= messageDiv.querySelector("#message-dp");
    user_imageUrl=user.imageUrl;

    var message_nickname=messageDiv.querySelector("#message-nickname");

    if (user.nickName == undefined) {
        message_nickname.innerHTML=`<a href="`+"/user-page.html?user="+message.user +`">`+message.user+`</a>`;
    }
    else {
        message_nickname.innerHTML=`<a href="`+"/user-page.html?user="+message.user +`">`+user.nickName+`</a>`;
    }



    //Sample Image url if the image is not there.
    if (user_imageUrl == undefined) {
        user_imageUrl = 'https://www.iei.unach.mx/images/imagenes/profile.png';
    }

    message_dp.src=user_imageUrl;

    if(message.imageUrl!=null){
        message_imageUrl=messageDiv.querySelector("#message-imageUrl");
        message_imageUrl.src=message.imageUrl;
        message_imageUrl.classList.remove('hidden');
    }
    else {
        var image_card= messageDiv.querySelector("#image-card");
        image_card.remove();
    }

    var message_like_btn= messageDiv.querySelector("#message-like-btn");
    var message_like_li= message_like_btn.parentNode;
    var message_likes_count= message_like_li.querySelector("#likes-count");
    var message_likes_img= message_like_li.querySelector("#likes-img");
    message_like_btn.id= message.id;

    if(message.likes==null){
        message_likes_count.innerText=0;
    }
    else {
        message_likes_count.classList.remove('hidden');
        message_likes_img.classList.remove('hidden');
        if( message.likes.indexOf(loginStatusGlobal.username) > -1){
            message_like_btn.classList.add("active");
            message_likes_count.innerText=message.likes.length;
        }
        else {
            message_likes_count.innerText=message.likes.length;
        }
    }
    if (!loginStatusGlobal.isLoggedIn){
        message_like_btn.style.pointerEvents="none";
    }else {
        if(loginStatusGlobal.username==message.user) {
            var message_delete = messageDiv.querySelector("#message-delete");
            message_delete.href="/feed/delete?id="+message.id;
        }
        else {
            var message_dropdown = messageDiv.querySelector("#message-dropdown");
            message_dropdown.classList.add('hidden');
        }
    }
    console.log("message");
    return messageDiv;
}


function likeMessage(clicked_id)
{
    var message_like_btn= document.getElementById(clicked_id);
    var message_like_li=message_like_btn.parentNode;
    var message_likes_count= message_like_li.querySelector('#likes-count');
    var message_likes_img= message_like_li.querySelector('#likes-img');
    var count= parseInt(message_likes_count.innerText);


    if (message_like_btn.classList.contains("active")){
        postLike(clicked_id,false);
        message_like_btn.classList.remove("active");
        message_likes_count.innerText=count-1;

        if(count-1==0){
            message_likes_count.classList.add('hidden');
            message_likes_img.classList.add('hidden');
        }
    }
    else {
        if(count==0){
            message_likes_count.classList.remove('hidden');
            message_likes_img.classList.remove('hidden');
        }
        postLike(clicked_id,true);
        message_like_btn.classList.add("active");
        message_likes_count.innerText=count+1;
    }
}


function playAudio(text) {
    const params = new URLSearchParams();
    params.append('text', text);
    fetch("/tts", {
        method: 'POST',
        body: params
    })
        .then(response => response.blob())
        .then((audioBlob) => {
            const audioUrl = window.URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play()
                .catch((error) => {
                    throw error.message;
                });
        });
}

/** Sends a Likes to backend for saving. */
function postLike(clicked_id,is_liked) {
    const params = new URLSearchParams();
    params.append('id', clicked_id);
    params.append('is_liked', is_liked);
    fetch('/like', {
        method: 'POST',
        body: params
    });
}


function openModalViewforDelete(href) {
    document.getElementById("confirm-delete-btn").href=href;
    $('#confirm-delete').modal('show');
    return false;
}

function addModalViewforlikes() {
    const modal_body = document.getElementById('modal-body');
    $(".likescount").on("click", function(){
        var postid= $(this).siblings("a")[0].id;
        const url='/like?id='+postid
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((users) => {
                modal_body.innerHTML="";
                users.forEach((user) => {
                    modal_body.appendChild(createlikedUserTemplate(user));
                    $('#likesModal').modal('show');
                });
            });
    });
}

function createlikedUserTemplate(user) {
    var userDiv = document.createElement('div');
    userDiv.className += "d-flex justify-content-between align-items-center";
    var htmlString=`
            <div class="mr-2">
                <img class="rounded-circle" width="30" id="message-dp" src="" alt="">
            </div>
            <div class="ml-2">
                <div class="h5 m-0" id="message-nickname">Miracles Lee Cross</div>
            </div><hr>`;
    userDiv.innerHTML+= htmlString.trim();
    var message_nickname=userDiv.querySelector("#message-nickname");

    if (user.nickName == undefined) {
        message_nickname.innerHTML=`<a style="font-size: 16px;" href="`+"/user-page.html?user="+user.email +`">`+user.email+`</a>`;
    }
    else {
        message_nickname.innerHTML=`<a style="font-size: 16px;" href="`+"/user-page.html?user="+user.email +`">`+user.nickName+`</a>`;
    }
    //Sample Image url if the image is not there.
    user_imageUrl=user.imageUrl;
    if (user_imageUrl == undefined) {
        user_imageUrl = 'https://www.iei.unach.mx/images/imagenes/profile.png';
    }
    var message_dp= userDiv.querySelector("#message-dp");
    message_dp.src=user_imageUrl;
    return userDiv;
}

function addButtonEventForDelete() {
    $("#confirm-delete-btn").on("click", function(){
        const url=$(this).href;
        fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((res) => {
                location.reload();
            });
    });
}

function validateForm(form) {
    var text= form["text"].value;
    var image= form["image"].value;
    var message_submit = document.getElementById("message-submit");
    if ( text!= "" ||image != "") {
        message_submit.disabled = false;
    }
    else {
        message_submit.disabled = true;
    }
}

function validatetextarea(input) {
    var inputval= input.value;
    var message_submit = document.getElementById("message-submit");
    if ( inputval!= "") {
        message_submit.disabled = false;
    }else {
        if(document.getElementById("customFile").value == ""){
            message_submit.disabled = true;
        }
        else {
            message_submit.disabled = false;
        }
    }
}
