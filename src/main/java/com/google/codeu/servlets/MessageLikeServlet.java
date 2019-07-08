package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.MyMarker;
import com.google.codeu.data.User;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@WebServlet("/like")
public class MessageLikeServlet extends HttpServlet {

    private Datastore datastore;

    @Override
    public void init() {
        datastore = new Datastore();
    }

    /** Responds with a JSON array containing marker data. */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String messageId = Jsoup.clean(request.getParameter("id"), Whitelist.none());
        Gson gson = new Gson();
        List<User> users=datastore.getlikedUsers(messageId);
        String json = gson.toJson(users);
        response.getOutputStream().println(json);
    }

    /** Accepts a POST request containing a new marker. */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        if (!userService.isUserLoggedIn()) {
            response.sendRedirect("/index.html");
            return;
        }
        String user = userService.getCurrentUser().getEmail();
        String messageId = Jsoup.clean(request.getParameter("id"), Whitelist.none());
        Boolean isLiked = Boolean.parseBoolean(request.getParameter("is_liked"));
        datastore.likeMessages(user,messageId,isLiked);

    }

}