package com.google.codeu.data;

import java.util.UUID;

public class MyMarker {
    private UUID id;
    private String user;
    private double lat;
    private double lng;
    private String hobby;

    public MyMarker(String user, double lat, double lng, String hobby) {
        this.id = UUID.randomUUID();
        this.user = user;
        this.lat = lat;
        this.lng = lng;
        this.hobby = hobby;
    }

    public MyMarker(UUID id, String user, double lat, double lng, String hobby) {
        this.id = id;
        this.user = user;
        this.lat = lat;
        this.lng = lng;
        this.hobby = hobby;
    }

    public UUID getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public double getLat() {
        return lat;
    }

    public double getLng() {
        return lng;
    }

    public String getHobby() {
        return hobby;
    }
}

