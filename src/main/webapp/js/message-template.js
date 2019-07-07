function buildMessageDiv(message,user,loginStatusGlobal) {
    var messageDiv = document.createElement('div');
    messageDiv.className += "card gedf-card";

    const htmlString = ` <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mr-2">
                                <img class="rounded-circle" width="45" id="message-dp" src="https://picsum.photos/50/50" alt="">
                            </div>
                            <div class="ml-2">
                                <div class="h5 m-0" id="message-nickname">Miracles Lee Cross</div>
                                <div class="h7 text-muted" id="message-username">@LeeCross</div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>

                </div>
                <div class="card-body">
                    <div class="text-muted h7 mb-2" id="message-time"><i class="fa fa-clock-o"></i> 10 min ago</div>
                    <p class="card-text" id="message-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam omnis nihil, aliquam est,
                        voluptates officiis iure soluta
                        alias vel odit, placeat reiciendis ut libero! Quas aliquid natus cumque quae repellendus. Lorem
                        ipsum dolor sit amet consectetur adipisicing elit. Ipsa, excepturi. Doloremque, reprehenderit!
                        Quos in maiores, soluta doloremque molestiae reiciendis libero expedita assumenda fuga quae.
                        Consectetur id molestias itaque facere? Hic!
                    </p>
                    <div>
                    <img src="" id="message-imageUrl" class="hidden">
                    </div>
                    <div id="message-hashtags">
                   
                    </div>
                </div>

                <div class="card-footer">
                    <button id="message-like_btn" href=""  onClick="likeMessage(this.id)" style="color:#78909C;font-size:125%;"  class="btn btn-light card-link"><i style="color:#78909C" class="fab fa-gratipay"></i><b  id="likes-count" style="color:#78909C">23</b></button>
                    <a style="color:#FFA726;font-size:125%;"   class="card-link"> <i class="fab fa-discord"></i> <b  style="color:#FFA726" id="message-score"></b></a>
                    <button id="text-to-speech"  class="btn btn-info btn-sm fas fa-volume-up float-right"></button>
                </div>`;



    messageDiv.innerHTML+= htmlString.trim();

    if(message.imageLabels!=null){
        message_hashtags= messageDiv.querySelector("#message-hashtags");
        var hashtagsStr='';
        for (var label in message.imageLabels) {
            hashtagsStr+=`<span class="badge badge-primary" style="margin-left: 5px">`+message.imageLabels[label]+`</span>`;
        }
        message_hashtags.innerHTML=hashtagsStr; }

    message_text= messageDiv.querySelector("#message-text");
    message_text.innerHTML= message.text;

    message_username=messageDiv.querySelector("#message-username");

    message_time=messageDiv.querySelector("#message-time");
    message_time.innerHTML=new Date(message.timestamp);

    message_score= messageDiv.querySelector("#message-score");
    message_score.innerHTML=message.score.toFixed(2);

    speech_generator= messageDiv.querySelector("#text-to-speech");
    speech_generator.addEventListener('click', () => {
        playAudio(message.text);
    });

    message_dp= messageDiv.querySelector("#message-dp");
    user_imageUrl=user.imageUrl;


    message_like_btn= messageDiv.querySelector("#message-like_btn");
    message_like_btn.id= message.id;

    message_nickname=messageDiv.querySelector("#message-nickname");

    if (user.nickName == undefined) {
        message_nickname.innerHTML=`<a href="`+"/user-page.html?user="+message.user +`">`+message.user+`</a>`;
        message_username.innerHTML=" ";
    }
    else {
        message_nickname.innerHTML=`<a href="`+"/user-page.html?user="+message.user +`">`+user.nickName+`</a>`;
        message_username.innerHTML=message.user;
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


    if(message.likes==null){
        message_like_btn.style.color='rgb(120, 144, 156)';
        message_like_btn.getElementsByTagName('i')[0].style.color='rgb(120, 144, 156)';
        message_like_btn.getElementsByTagName('b')[0].style.color='rgb(120, 144, 156)';
        message_like_btn.getElementsByTagName('b')[0].innerText=0;
    }
    else {
        if( message.likes.indexOf(loginStatusGlobal.username) > -1){
            message_like_btn.style.color='rgb(233, 30, 99)';
            message_like_btn.getElementsByTagName('i')[0].style.color='rgb(233, 30, 99)';
            message_like_btn.getElementsByTagName('b')[0].style.color='rgb(233, 30, 99)';
            message_like_btn.getElementsByTagName('b')[0].innerText=message.likes.length;
        }
        else {
            message_like_btn.style.color='rgb(120, 144, 156)';
            message_like_btn.getElementsByTagName('i')[0].style.color='rgb(120, 144, 156)';
            message_like_btn.getElementsByTagName('b')[0].style.color='rgb(120, 144, 156)';
            message_like_btn.getElementsByTagName('b')[0].innerText=message.likes.length;
        }
    }
    if (!loginStatusGlobal.isLoggedIn){
        message_like_btn.disabled = true;
    }
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