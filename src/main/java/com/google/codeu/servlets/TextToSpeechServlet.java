/** Takes requests that contain text and responds with an MP3 file speaking that text. */
@WebServlet("/texttospeech")
public class TextToSpeech extends HttpServlet {

 private TextToSpeechClient ttsClient;

 @Override
 public void init() {
   ttsClient = TextToSpeechClient.create();
 }

 /** Responds with an MP3 bytestream from the Google Cloud Text-to-Speech API */
 @Override
 public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {


   String text = Jsoup.clean(request.getParameter("text"), Whitelist.none());

   // Text to Speech API
   SynthesisInput input = SynthesisInput.newBuilder()
           .setText(text)
           .build();
   // Build the voice request, select the language code ("en-US") and the ssml voice gender
    VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
         .setLanguageCode("en-US")
         // Try experimenting with the different voices
         .setSsmlGender(SsmlVoiceGender.NEUTRAL)
         .build();

     // Select the type of audio file you want returned
    AudioConfig audioConfig = AudioConfig.newBuilder()
         .setAudioEncoding(AudioEncoding.MP3)
         .build();

     // Perform the text-to-speech request on the text input with the selected voice parameters and
     // audio file type
    SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice,
         audioConfig);

    response.setContentType("audio/mpeg"); 

   try (
     ServletOutputStream output = response.getOutputStream();
     InputStream input = getServletContext().getResourceAsStream(responseFromAPI); // Placeholder!
   ){ 
     byte[] buffer = new byte[2048];
     int bytesRead;    
     while ((bytesRead = input.read(buffer)) != -1) {
        output.write(buffer, 0, bytesRead);
     }
   }
 }
}
