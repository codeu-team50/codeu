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

import java.util.List;
import java.util.UUID;

/**
 * A single message posted by a user.
 */
public class Message {

    private UUID id;
    private String user;
    private String text;
    private String imageUrl;
    private long timestamp;
    private double score;
    private List<String> likes;
    private List<String> imageLabels;



    public Message(UUID id, String user, String text, double score) {
        this.id=id;
        this.user = user;
        this.text = text;
        this.timestamp = System.currentTimeMillis();
        this.score=score;
    }

    public Message(String user, String text, double score) {
        this.id=UUID.randomUUID();
        this.user = user;
        this.text = text;
        this.timestamp = System.currentTimeMillis();
        this.score=score;
    }


    public void setText(String text) {
        this.text = text;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public void setLikes(List<String> likes) { this.likes = likes; }

    public UUID getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public String getText() {
        return text;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public double getScore(){
        return score;
    }

    public List<String> getLikes() { return likes; }

    public List<String> getImageLabels() {
        return imageLabels; }

    public void setImageLabels(List<String> imageLabels) {
        this.imageLabels = imageLabels; }
}
