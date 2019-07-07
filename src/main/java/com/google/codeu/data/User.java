package com.google.codeu.data;

public class User {

    private String email;
    private String aboutMe;
    private String nickName;
    private String imageUrl;


    // constructor to handle when only email, aboutMe
    public User(String email, String aboutMe) {
        this.email = email;
        this.aboutMe = aboutMe;
    }

    //Getters

    public String getEmail(){
        return email;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public String getImageUrl() { 
        return imageUrl; 
    }

    public String getNickName() { 
        return nickName; 
    }


    //Setters
    public void setNickName(String nickName) { this.nickName = nickName; }

    public void setImageUrl(String imageUrl) {  this.imageUrl = imageUrl; }

}