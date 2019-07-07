package com.google.codeu.servlets;


import java.io.IOException;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;


/**
 * Handles fetching all messages for the public feed.
 */

@WebServlet("/feed")
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

}
