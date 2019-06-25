package com.google.codeu.servlets;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.MyMarker;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;


@WebServlet("/markers")
public class MyMarkerServlet extends HttpServlet {

    private Datastore datastore;

    @Override
    public void init() {
        datastore = new Datastore();
    }

    /** Responds with a JSON array containing marker data. */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        if (!userService.isUserLoggedIn()) {
            response.sendRedirect("/index.html");
            return;
        }
        String user = userService.getCurrentUser().getEmail();
        response.setContentType("application/json");
        List<MyMarker> markers = datastore.getMyMarkers(user);
        Gson gson = new Gson();
        String json = gson.toJson(markers);
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
        double lat = Double.parseDouble(request.getParameter("lat"));
        double lng = Double.parseDouble(request.getParameter("lng"));
        String placeId = Jsoup.clean(request.getParameter("id"), Whitelist.none());
        String hobby = Jsoup.clean(request.getParameter("hobby"), Whitelist.none());

        MyMarker marker = new MyMarker(placeId,user,lat, lng, hobby);
        datastore.storeMarker(marker);
    }

}