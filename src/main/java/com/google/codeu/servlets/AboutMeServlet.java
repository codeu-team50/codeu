package com.google.codeu.servlets;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.github.rjeschke.txtmark.Processor;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.User;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.kefirsf.bb.BBProcessorFactory;
import org.kefirsf.bb.TextProcessor;

import static com.google.codeu.servlets.BlobstoreUploadUrlServlet.getUploadedFileUrl;

/**
 * Handles fetching and saving user data.
 */
@WebServlet("/about")
public class AboutMeServlet extends HttpServlet {

    private Datastore datastore;

    @Override
    public void init() {
        datastore = new Datastore();
    }

    /**
     * Responds with the "about me" section for a particular user.
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("text/html");

        String user = request.getParameter("user");

        if (user == null || user.equals("")) {
            // Request is invalid, return empty response
            return ;
        }

        User userData = datastore.getUser(user);

        //Load the user details and send it as the json
        Gson gson = new Gson();
        String json = gson.toJson(userData);
        response.getOutputStream().println(json);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        UserService userService = UserServiceFactory.getUserService();
        if (!userService.isUserLoggedIn()) {
            response.sendRedirect("/index.html");
            return;
        }

        String userEmail = userService.getCurrentUser().getEmail();
        String aboutMe = Jsoup.clean(request.getParameter("aboutMe"), Whitelist.none());
        String nickName = Jsoup.clean(request.getParameter("nickName"), Whitelist.none());

        // BBCode markup language to HTML
        TextProcessor processor = BBProcessorFactory.getInstance().create();
        aboutMe = processor.process(aboutMe);

        // Java markdown processor
        aboutMe = Processor.process(aboutMe);

        // Get the URL of the image that the user uploaded to Blobstore.
        String imageUrl = getUploadedFileUrl(request, "image");
        User user = new User(userEmail, aboutMe);
        user.setNickName(nickName);


        if (imageUrl != null) {
           user.setImageUrl(imageUrl);
            datastore.storeUser(user);
        } else {
            if (datastore.getUser(userEmail).getImageUrl()!=null){
                user.setImageUrl(datastore.getUser(userEmail).getImageUrl());
                datastore.storeUser(user);
            }
            else{
                datastore.storeUser(user);
            }
        }

        response.sendRedirect("/user-page.html?user=" + userEmail);
    }

}