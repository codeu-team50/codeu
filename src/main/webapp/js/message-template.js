function buildMessageDiv(message) {
    var messageDiv = document.createElement('div');
    messageDiv.className += "card gedf-card";

    const htmlString = ` <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mr-2">
                                <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                            </div>
                            <div class="ml-2">
                                <div class="h5 m-0" id="message-username">@LeeCross</div>
                                <div class="h7 text-muted" id="message-nickname">Miracles Lee Cross</div>
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
                        <span class="badge badge-primary">JavaScript</span>
                        <span class="badge badge-primary">Android</span>
                        <span class="badge badge-primary">PHP</span>
                        <span class="badge badge-primary">Node.js</span>
                        <span class="badge badge-primary">Ruby</span>
                        <span class="badge badge-primary">Python</span>
                    </div>
                </div>

                <div class="card-footer">
                    <a style="color:#E91E63" href="#" class="card-link"><i style="color:#E91E63" class="fab fa-gratipay"></i> Like</a>
                    <a id="message-score" style="color:#1c7430" href="#" class="fab fa-smile"></a>
                </div>`;


    messageDiv.innerHTML+= htmlString.trim();

    message_text= messageDiv.querySelector("#message-text");
    message_text.innerHTML= message.text;

    message_username=messageDiv.querySelector("#message-username");
    message_username.innerHTML=message.user;

    message_nickname=messageDiv.querySelector("#message-nickname");
    message_nickname.innerHTML=message.user;

    message_time=messageDiv.querySelector("#message-time");
    message_time.innerHTML=new Date(message.timestamp);

    message_score= messageDiv.querySelector("#message-score");
    message_score.innerHTML=message.score.toFixed(2);

    if(message.imageUrl!=null){
        message_imageUrl=messageDiv.querySelector("#message-imageUrl");
        message_imageUrl.src=message.imageUrl;
        message_imageUrl.classList.remove('hidden');
    }

    return messageDiv;
}