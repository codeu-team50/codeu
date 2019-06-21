/** Takes requests that contain text and responds with an MP3 file speaking that text. */
@WebServlet("/a11y/tts")
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

   // TODO(you): Fill in the gap here!
   // PS: consider the basic example and the Text-to-Speech documentation!

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
