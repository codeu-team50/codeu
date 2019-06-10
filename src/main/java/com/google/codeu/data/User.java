package com.google.codeu.data;

public class User {

    private String email;
    private String aboutMe;
    private String nickName;
    private String imageUrl;


    public User(String email, String aboutMe) {
        this.email = email;
        this.aboutMe = aboutMe;
    }

    public User(String email, String aboutMe,String nickName) {
        this.email = email;
        this.aboutMe = aboutMe;
        this.nickName = nickName;
    }

    public User(String email, String aboutMe,String nickName,String imageUrl) {
        this.email = email;
        this.aboutMe = aboutMe;
        this.nickName = nickName;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() { return imageUrl; }

    public String getEmail(){
        return email;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public String getNickName() { return nickName; }
}