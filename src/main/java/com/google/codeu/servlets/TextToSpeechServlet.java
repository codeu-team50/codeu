package com.google.codeu.servlets;

import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;
import com.google.protobuf.ByteString;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.util.List;
import java.io.InputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.kefirsf.bb.BBProcessorFactory;
import org.kefirsf.bb.TextProcessor;

/** Takes requests that contain text and responds with an MP3 file speaking that text. */
@WebServlet("/tts")
public class TextToSpeechServlet extends HttpServlet {

 private TextToSpeechClient ttsClient;

 @Override
 public void init() {
    try {
      ttsClient = TextToSpeechClient.create();
    } catch (IOException e) {
      System.out.println("Error in creating TextToSpeechClient.");
    }
 }

 /** Responds with an MP3 bytestream from the Google Cloud Text-to-Speech API */
 @Override
 public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {


   String text = Jsoup.clean(request.getParameter("text"), Whitelist.none());

   // Text to Speech API
   SynthesisInput input = SynthesisInput.newBuilder()
           .setText(text)
           .build();

   // Build the voice request, select the language code ("en-US") and the SSML voice gender
    VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
            .setLanguageCode("en-US")
            .setSsmlGender(SsmlVoiceGender.NEUTRAL)
            .build();

     // Select the type of audio file to return
    AudioConfig audioConfig = AudioConfig.newBuilder()
            .setAudioEncoding(AudioEncoding.MP3)
            .build();

      // Perform the text-to-speech request on the text input with the selected voice parameters and
    // audio file type.
    SynthesizeSpeechResponse synthesizeSpeechResponse = ttsClient.synthesizeSpeech(
            input, voice, audioConfig
    );


    // Get audio content from the API response.
    ByteString audioContents = synthesizeSpeechResponse.getAudioContent();

    //set audio content for API Response
   response.setContentType("audio/mpeg");

   try (
     ServletOutputStream output = response.getOutputStream();
     InputStream audioInput = audioContents.newInput(); // Placeholder!
   ){
     byte[] buffer = new byte[2048];
     int bytesRead;
     while ((bytesRead = audioInput.read(buffer)) != -1) {
        output.write(buffer, 0, bytesRead);
     }
   }
 }
}