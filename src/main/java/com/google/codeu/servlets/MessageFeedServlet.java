package com.google.codeu.servlets;


import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.*;
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


@WebServlet(urlPatterns = {"/feed", "/feed/delete","/feed/pagnition"})
public class MessageFeedServlet extends HttpServlet {
    private Datastore datastore;
    static final int PAGE_SIZE = 5;

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
        if(path.equals("/feed")){
            response.setContentType("application/json");
            String tag = request.getParameter("tag");
            if (tag != null && !tag.equals("")) {
                // Request is invalid, return empty array
                response.setContentType("application/json");
                FetchOptions fetchOptions = FetchOptions.Builder.withLimit(PAGE_SIZE);

                // If this servlet is passed a cursor parameter, let's use it.
                String startCursor = request.getParameter("cursor");
                if (startCursor != null) {
                    fetchOptions.startCursor(Cursor.fromWebSafeString(startCursor));
                }

                QueryResultList<Entity> results;
                PreparedQuery pq = datastore.getAllMessagesForTagPagnition(tag);
                try {
                    results = pq.asQueryResultList(fetchOptions);
                } catch (IllegalArgumentException e) {
                    response.sendRedirect("/feed.html");
                    return;
                }
                String cursorString = results.getCursor().toWebSafeString();
                response.setContentType("application/json");
                List<Object> messages =datastore.getMessagesforPreparedQuery(results);
                messages.add(cursorString);
                Gson gson = new Gson();
                String json = gson.toJson(messages);
                response.getOutputStream().println(json);
            }
            else{
                response.setContentType("application/json");
                FetchOptions fetchOptions = FetchOptions.Builder.withLimit(PAGE_SIZE);

                // If this servlet is passed a cursor parameter, let's use it.
                String startCursor = request.getParameter("cursor");
                if (startCursor != null) {
                    fetchOptions.startCursor(Cursor.fromWebSafeString(startCursor));
                }

                QueryResultList<Entity> results;
                PreparedQuery pq = datastore.getAllMessagesPagnition();
                try {
                    results = pq.asQueryResultList(fetchOptions);
                } catch (IllegalArgumentException e) {
                    response.sendRedirect("/feed.html");
                    return;
                }
                String cursorString = results.getCursor().toWebSafeString();
                response.setContentType("application/json");
                List<Object> messages =datastore.getMessagesforPreparedQuery(results);
                messages.add(cursorString);
                Gson gson = new Gson();
                String json = gson.toJson(messages);
                response.getOutputStream().println(json);
            }
        }
        else if(path.equals("/feed/delete")) {
            UserService userService = UserServiceFactory.getUserService();
            if (userService.isUserLoggedIn()) {
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
            return;
        }
    }
}
