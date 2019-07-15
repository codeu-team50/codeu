package com.google.codeu.servlets;


import java.io.IOException;
import java.net.URL;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;


/**
 * Handles fetching all messages for the public feed.
 */


@WebServlet(urlPatterns = {"/feed", "/feed/delete"})
public class MessageFeedServlet extends HttpServlet {
    private Datastore datastore;


    @Override
    public void init() {
        datastore = new Datastore();
    }

    /**
     * Responds with a JSON representation of Message data for all users.
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String path = new URL(""+(request.getRequestURL())).getPath();
        System.out.println(path);
        if(path.equals("/feed")){
            response.setContentType("application/json");
            String tag = request.getParameter("tag");
            if (tag != null && !tag.equals("")) {
                // Request is invalid, return empty array
                List<Message> messages = datastore.getAllMessagesForTag(tag);
                Gson gson = new Gson();
                String json = gson.toJson(messages);
                response.getWriter().println(json);
                return;
            }
            else{
                List<Message> messages = datastore.getAllMessages();
                Gson gson = new Gson();
                String json = gson.toJson(messages);
                response.getOutputStream().println(json);
            }
        }
        else if(path.equals("/feed/delete")) {
            UserService userService = UserServiceFactory.getUserService();
            if (userService.isUserLoggedIn()) {
                System.out.println("inside");
                String user = userService.getCurrentUser().getEmail();
                try {
                    String messageId = Jsoup.clean(request.getParameter("id"), Whitelist.none());
                    response.getOutputStream().println(datastore.deleteMessages(messageId, user));
                }
                catch (Exception e){
                    response.getOutputStream().println("Message id has not been passed");
                }
            }
            else {

                response.getOutputStream().println("User Not Logged In");
            }
        }
        else{
            System.out.println("else");
            return;
        }
    }
}
