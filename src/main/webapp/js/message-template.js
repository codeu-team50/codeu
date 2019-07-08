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



    const htmlString=` <div class="card mb-4">
                    <div class="post_topbar">
                        <div class="usy-dt">
                            <img src="img/us-pic.png" id="message-dp" alt="">
                            <div class="usy-name">
                                <h3 id="message-nickname" >John Doe</h3>
                                <span><img src="img/clock.png" alt="" style="width: 13px;" id="message-time" >3 min ago</span>
                            </div>
                        </div>
                        <div class="ed-opts">
                            <div class="dropdown">
                                <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                                    <div class="h6 dropdown-header">Configuration</div>
                                    <a class="dropdown-item" href="#">Save</a>
                                    <a class="dropdown-item" href="#">Hide</a>
                                    <a class="dropdown-item" href="#">Report</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="job_descp">
                        <ul class="job-dt">
                            <li><a href="#"  id="message-score" title=""><i id="message-score-icon" class="fa fa-smile-beam"></i> Neutral</a></li>
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
                            <li>
                                <a href="#"><i class="fa fa-heart"></i> Like</a>
                                <img src="img/liked-img.png" alt="">
                                <span id="likes-count">25</span>
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

    message_text= messageDiv.querySelector("#message-text");
    message_text.innerHTML= message.text;

    message_username=messageDiv.querySelector("#message-username");

    message_time=messageDiv.querySelector("#message-time");
    message_time.innerHTML=jQuery.timeago(new Date((message.timestamp)));                                                                                                                                                                                                                                                                                                                                                                                                                                                             ;

    message_score= messageDiv.querySelector("#message-score");
    message_score_icon= messageDiv.querySelector("#message-score-icon");

    if(message.score<0){
        message_score.innerHTML=`<i class="fa fa-frown"></i>   Negative (`+message.score.toFixed(2)+`)`;
    }else if(message.score==0){
        message_score.innerHTML=`<i class="fa fa-meh"></i>   Neutral (`+message.score.toFixed(2)+`)`;
    }else{
        message_score.innerHTML=`<i class="fa fa-smile-beam"></i>   Positive (`+message.score.toFixed(2)+`)`;
    }


    speech_generator= messageDiv.querySelector("#text-to-speech");
    speech_generator.addEventListener('click', () => {
        playAudio(message.text);
    });

    message_dp= messageDiv.querySelector("#message-dp");
    user_imageUrl=user.imageUrl;


    // message_like_btn= messageDiv.querySelector("#message-like_btn");
    // message_like_btn.id= message.id;

    message_nickname=messageDiv.querySelector("#message-nickname");

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


    //
    //
    // if(message.likes==null){
    //     message_like_btn.style.color='rgb(120, 144, 156)';
    //     message_like_btn.getElementsByTagName('i')[0].style.color='rgb(120, 144, 156)';
    //     message_like_btn.getElementsByTagName('b')[0].style.color='rgb(120, 144, 156)';
    //     message_like_btn.getElementsByTagName('b')[0].innerText=0;
    // }
    // else {
    //     if( message.likes.indexOf(loginStatusGlobal.username) > -1){
    //         message_like_btn.style.color='rgb(233, 30, 99)';
    //         message_like_btn.getElementsByTagName('i')[0].style.color='rgb(233, 30, 99)';
    //         message_like_btn.getElementsByTagName('b')[0].style.color='rgb(233, 30, 99)';
    //         message_like_btn.getElementsByTagName('b')[0].innerText=message.likes.length;
    //     }
    //     else {
    //         message_like_btn.style.color='rgb(120, 144, 156)';
    //         message_like_btn.getElementsByTagName('i')[0].style.color='rgb(120, 144, 156)';
    //         message_like_btn.getElementsByTagName('b')[0].style.color='rgb(120, 144, 156)';
    //         message_like_btn.getElementsByTagName('b')[0].innerText=message.likes.length;
    //     }
    // }
    // if (!loginStatusGlobal.isLoggedIn){
    //     message_like_btn.disabled = true;
    // }
    return messageDiv;
}


function likeMessage(clicked_id)
{
    var like_btn=document.getElementById(clicked_id);
    var color =like_btn.style.color;
    var count= parseInt(like_btn.getElementsByTagName('b')[0].innerText);

    if (color=="rgb(120, 144, 156)"){
        postLike(clicked_id,true);
        like_btn.style.color='rgb(233, 30, 99)';
        like_btn.getElementsByTagName('i')[0].style.color='rgb(233, 30, 99)';
        like_btn.getElementsByTagName('b')[0].style.color='rgb(233, 30, 99)';
        like_btn.getElementsByTagName('b')[0].innerText=count+1;
    }
    else {
        postLike(clicked_id,false);
        like_btn.style.color='rgb(120, 144, 156)';
        like_btn.getElementsByTagName('i')[0].style.color='rgb(120, 144, 156)';
        like_btn.getElementsByTagName('b')[0].style.color='rgb(120, 144, 156)';
        like_btn.getElementsByTagName('b')[0].innerText=count-1;
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