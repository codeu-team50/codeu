/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.codeu.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;

import java.util.*;

/**
 * Provides access to the data stored in Datastore.
 */
public class Datastore {

    private DatastoreService datastore;

    public Datastore() {
        datastore = DatastoreServiceFactory.getDatastoreService();
    }

    /**
     * Stores the Message in Datastore.
     */
    public void storeMessage(Message message){
        Entity messageEntity = new Entity("Message", message.getId().toString());
        messageEntity.setProperty("id", message.getId().toString());
        messageEntity.setProperty("user", message.getUser());
        messageEntity.setProperty("text", message.getText());
        messageEntity.setProperty("imageUrl", message.getImageUrl());
        messageEntity.setProperty("timestamp", message.getTimestamp());
        messageEntity.setProperty("score", message.getScore());
        messageEntity.setProperty("imageLabels", message.getImageLabels());
        datastore.put(messageEntity);
    }

    /**
     * Gets messages posted by a specific user.
     *
     * @return a list of messages posted by the user, or empty list if user has never posted a
     * message. List is sorted by time descending.
     */
    public List<Message> getMessages(String user) {
        Query query =
                new Query("Message")
                        .setFilter(new Query.FilterPredicate("user", FilterOperator.EQUAL, user))
                        .addSort("timestamp", SortDirection.DESCENDING);
        return getMessagesForQuery(query);
    }

    /**
     * Gets messages posted by a specific user.
     *
     * @return a list of messages posted by the user, or empty list if user has never posted a
     * message. List is sorted by time descending.
     */
    public List<Message> getMessagesForTags(String user, String tag) {

        Filter imageLabelsFilter =
                new FilterPredicate("imageLabels", FilterOperator.EQUAL, tag);
        Query.Filter userFilter =
                new FilterPredicate("user", FilterOperator.EQUAL, user);
        Query.Filter compositeFilter =
                CompositeFilterOperator.and(imageLabelsFilter, userFilter);
        Query query =
                new Query("Message")
                        .setFilter(compositeFilter)
                        .addSort("timestamp", SortDirection.DESCENDING);
        return getMessagesForQuery(query);
    }


    /**
     * Returns the total number of messages for all users.
     */
    public int getTotalMessageCount() {
        Query query = new Query("Message");
        PreparedQuery results = datastore.prepare(query);
        return results.countEntities(FetchOptions.Builder.withLimit(1000));
    }

    public Set<String> getUsers() {
        Set<String> users = new HashSet<>();
        Query query = new Query("Message");
        PreparedQuery results = datastore.prepare(query);
        for (Entity entity : results.asIterable()) {
            users.add((String) entity.getProperty("user"));
        }
        return users;
    }


    /**
     * Stores the User in Datastore.
     */
    public void storeUser(User user) {
        Entity userEntity = new Entity("User", user.getEmail());
        userEntity.setProperty("email", user.getEmail());
        userEntity.setProperty("aboutMe", user.getAboutMe());
        userEntity.setProperty("imageUrl", user.getImageUrl());
        userEntity.setProperty("nickName", user.getNickName());
        datastore.put(userEntity);
    }

    /**
     * Returns the User owned by the email address, or
     * null if no matching User was found.
     */
    public User getUser(String email) {
        Query query = new Query("User")
                .setFilter(new Query.FilterPredicate("email", FilterOperator.EQUAL, email));
        PreparedQuery results = datastore.prepare(query);
        Entity userEntity = results.asSingleEntity();

        if (userEntity == null) {
            return new User(email, null);
        }

        String aboutMe = (String) userEntity.getProperty("aboutMe");
        String nickName = (String) userEntity.getProperty("nickName");
        User user =new User(email, aboutMe);
        user.setNickName(nickName);
        
        if (userEntity.hasProperty("imageUrl")){
            String imageUrl = (String) userEntity.getProperty("imageUrl");
            user.setImageUrl(imageUrl);
        }
        return user;
    }

    /* Fetch all messages*/
    public List<Message> getAllMessages() {
        Query query = new Query("Message")
                .addSort("timestamp", SortDirection.DESCENDING);
        return getMessagesForQuery(query);
    }

    /* Fetch all messages*/
    public List<Message> getAllMessagesForTag(String tag) {
        Query query = new Query("Message")
                .setFilter(new Query.FilterPredicate("imageLabels", FilterOperator.EQUAL, tag))
                .addSort("timestamp", SortDirection.DESCENDING);
        return getMessagesForQuery(query);
    }


    private  List<Message> getMessagesForQuery(Query query){
        List<Message> messages = new ArrayList<>();
        PreparedQuery results = datastore.prepare(query);

        for (Entity entity : results.asIterable()) {
            try {
                String idString = entity.getKey().getName();
                UUID id = UUID.fromString(idString);

                String user = (String) entity.getProperty("user");
                String text = (String) entity.getProperty("text");
                long timestamp = (long) entity.getProperty("timestamp");
                double score = (double) entity.getProperty("score");

                Message message = new Message(id, user, text, score);
                message.setTimestamp(timestamp);

                if (entity.hasProperty("imageUrl")) {
                    String imageUrl = (String) entity.getProperty("imageUrl");
                    message.setImageUrl(imageUrl);
                }

                if (entity.hasProperty("likes")) {
                    List<String>likes=(List<String>) entity.getProperty("likes");
                    message.setLikes(likes);
                }
                if (entity.hasProperty("imageLabels")) {
                    message.setImageLabels((List<String>) entity.getProperty("imageLabels"));
                }

                messages.add(message);
            } catch (Exception e) {
                System.err.println("Error reading message.");
                System.err.println(entity.toString());
                e.printStackTrace();
            }
        }
        return messages;
    }

    public List<User> getlikedUsers(String messageId) {
        Query query =
                new Query("Message")
                        .setFilter(new Query.FilterPredicate("id", FilterOperator.EQUAL, messageId));
        PreparedQuery results = datastore.prepare(query);
        Entity entity = results.asSingleEntity();
        List<String> likes=(List<String>) entity.getProperty("likes");
        List<User> users=new ArrayList<>();
        for (String email : likes) {
            User user=getUser(email);
            users.add(user);
        }
        return users;
    }

    /** Likes a Message*/
    public void likeMessages(String userLiked,String messageId,Boolean isLiked) {

        Query query =
                new Query("Message")
                        .setFilter(new Query.FilterPredicate("id", FilterOperator.EQUAL, messageId));
        PreparedQuery results = datastore.prepare(query);
        Entity entity =results.asSingleEntity();

        if (entity.hasProperty("likes")){
            List<String> likes=(List<String>) entity.getProperty("likes");
            if (likes==null){
                likes=new ArrayList<>();
            }

            if(isLiked){
                if(!likes.contains(userLiked)){
                    likes.add(userLiked);
                    entity.setProperty("likes", likes);
                    datastore.put(entity);
                }
            }
            else {
                if(likes.contains(userLiked)){
                    likes.remove(userLiked);
                    entity.setProperty("likes", likes);
                    datastore.put(entity);
                }
            }
        }
        else{
            if(isLiked) {
                List<String> likes =new ArrayList<>();
                likes.add(userLiked);
                entity.setProperty("likes", likes);
                datastore.put(entity);
            }
        }
    }

    /** Stores a marker in Datastore. */
    public void storeMarker(MyMarker marker) {

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Query query = new Query("MyMarker")
                .setFilter(new Query.FilterPredicate("user", FilterOperator.EQUAL, marker.getUser()))
                .setFilter(new Query.FilterPredicate("placeId", FilterOperator.EQUAL, marker.getPlaceId()));
        PreparedQuery results = datastore.prepare(query);

        int count = results.countEntities(FetchOptions.Builder.withLimit(1000));

        //Check whether the user saved this place earlier!
        if (count==0){
            Entity markerEntity = new Entity("MyMarker",marker.getId().toString());
            markerEntity.setProperty("placeId", marker.getPlaceId());
            markerEntity.setProperty("lat", marker.getLat());
            markerEntity.setProperty("lng", marker.getLng());
            markerEntity.setProperty("hobby", marker.getHobby());
            markerEntity.setProperty("user", marker.getUser());
            datastore.put(markerEntity);
        }
    }


    /** Fetches markers from Datastore. */
    public List<MyMarker> getMyMarkers(String user) {
        List<MyMarker> markers = new ArrayList<>();

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Query query = new Query("MyMarker")
                .setFilter(new Query.FilterPredicate("user", FilterOperator.EQUAL, user));
        PreparedQuery results = datastore.prepare(query);

        for (Entity entity : results.asIterable()) {
            String idString = entity.getKey().getName();
            UUID id = UUID.fromString(idString);
            double lat = (double) entity.getProperty("lat");
            double lng = (double) entity.getProperty("lng");
            String hobby = (String) entity.getProperty("hobby");
            String placeId = (String) entity.getProperty("placeId");
            MyMarker marker = new MyMarker(id,placeId,user,lat, lng, hobby);
            markers.add(marker);
        }
        return markers;
    }
}
