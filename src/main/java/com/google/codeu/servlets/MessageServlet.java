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

package com.google.codeu.servlets;

import com.github.rjeschke.txtmark.Processor;
import com.google.appengine.api.blobstore.*;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.cloud.vision.v1.*;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.google.protobuf.ByteString;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.kefirsf.bb.BBProcessorFactory;
import org.kefirsf.bb.TextProcessor;

import static com.google.codeu.servlets.BlobstoreUploadUrlServlet.getUploadedFileUrl;

/**
 * Handles fetching and saving {@link Message} instances.
 */
@WebServlet("/messages")
public class MessageServlet extends HttpServlet {

    private Datastore datastore;
    static final int PAGE_SIZE = 5;

    @Override
    public void init() {
        datastore = new Datastore();
    }


    /**
     * Returns the BlobKey that points to the file uploaded by the user, or null if the user didn't upload a file.
     */

    private BlobKey getBlobKey(HttpServletRequest request, String formInputElementName) {

        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
        List<BlobKey> blobKeys = blobs.get("image");


        // User submitted form without selecting a file, so we can't get a BlobKey. (devserver)
        if (blobKeys == null || blobKeys.isEmpty()) {
            return null;
        }


        // Our form only contains a single file input, so get the first index.
        BlobKey blobKey = blobKeys.get(0);


        // User submitted form without selecting a file, so the BlobKey is empty. (live server)

        BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);

        if (blobInfo.getSize() == 0) {

            blobstoreService.delete(blobKey);

            return null;

        }


        return blobKey;

    }


    /**
     * Blobstore stores files as binary data. This function retrieves the
     * <p>
     * binary data stored at the BlobKey parameter.
     */

    private byte[] getBlobBytes(BlobKey blobKey) throws IOException {

        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        ByteArrayOutputStream outputBytes = new ByteArrayOutputStream();


        int fetchSize = BlobstoreService.MAX_BLOB_FETCH_SIZE;
        long currentByteIndex = 0;
        boolean continueReading = true;

        while (continueReading) {
            // end index is inclusive, so we have to subtract 1 to get fetchSize bytes
            byte[] b = blobstoreService.fetchData(blobKey, currentByteIndex, currentByteIndex + fetchSize - 1);
            outputBytes.write(b);

            // if we read fewer bytes than we requested, then we reached the end
            if (b.length < fetchSize) {
                continueReading = false;
            }

            currentByteIndex += fetchSize;
        }

        return outputBytes.toByteArray();

    }


    /**
     * Uses the Google Cloud Vision API to generate a list of labels that apply to the image
     * <p>
     * represented by the binary data stored in imgBytes.
     */

    private List<EntityAnnotation> getImageLabels(byte[] imgBytes) throws IOException {
        ByteString byteString = ByteString.copyFrom(imgBytes);
        Image image = Image.newBuilder().setContent(byteString).build();

        Feature feature = Feature.newBuilder().setType(Feature.Type.LABEL_DETECTION).build();
        AnnotateImageRequest request =
                AnnotateImageRequest.newBuilder().addFeatures(feature).setImage(image).build();

        List<AnnotateImageRequest> requests = new ArrayList<>();
        requests.add(request);

        ImageAnnotatorClient client = ImageAnnotatorClient.create();
        BatchAnnotateImagesResponse batchResponse = client.batchAnnotateImages(requests);
        client.close();

        List<AnnotateImageResponse> imageResponses = batchResponse.getResponsesList();
        AnnotateImageResponse imageResponse = imageResponses.get(0);

        if (imageResponse.hasError()) {
            System.err.println("Error getting image labels: " + imageResponse.getError().getMessage());
            return null;
        }

        return imageResponse.getLabelAnnotationsList();
    }


    /**
     * Returns a URL that points to the uploaded file.
     */

    private String getUploadedUrlForBlobKey(BlobKey blobKey) {
        ImagesService imagesService = ImagesServiceFactory.getImagesService();
        ServingUrlOptions options = ServingUrlOptions.Builder.withBlobKey(blobKey);
        return imagesService.getServingUrl(options);
    }

    /**
     * Responds with a JSON representation of {@link Message} data for a specific user. Responds with
     * an empty array if the user is not provided.
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("application/json");

        String user = request.getParameter("user");

        if (user == null || user.equals("")) {
            // Request is invalid, return empty array
            response.getWriter().println("[]");
            return;
        }

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
            PreparedQuery pq = datastore.getMessagesForTagsPagnition(user,tag);
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
        }else {
            response.setContentType("application/json");
            FetchOptions fetchOptions = FetchOptions.Builder.withLimit(PAGE_SIZE);

            // If this servlet is passed a cursor parameter, let's use it.
            String startCursor = request.getParameter("cursor");
            if (startCursor != null) {
                fetchOptions.startCursor(Cursor.fromWebSafeString(startCursor));
            }

            QueryResultList<Entity> results;
            PreparedQuery pq = datastore.getMessagesPagnition(user);
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

    /**
     * Stores a new {@link Message}.
     */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        UserService userService = UserServiceFactory.getUserService();
        if (!userService.isUserLoggedIn()) {
            response.sendRedirect("/index.html");
            return;
        }
        //Code commented for images part 1
        String user = userService.getCurrentUser().getEmail();
        String text = Jsoup.clean(request.getParameter("text"), Whitelist.none());

        //Message message = new Message(user, textWithImagesReplaced);
        // BBCode markup language to HTML
        TextProcessor processor = BBProcessorFactory.getInstance().create();
        text = processor.process(text);

        // Java markdown processor
        text = Processor.process(text);
        //Converting image url to image tag
        String regex = "(https?://\\S+\\.(png|jpg|jpeg|gif))";
        String replacement = "<img src=\"$1\" />";
        text = text.replaceAll(regex, replacement);
        text = text.replaceAll(regex, replacement);
        //Getting the sentiment scores
        Document doc = Document.newBuilder()
                .setContent(text).setType(Document.Type.PLAIN_TEXT).build();
        LanguageServiceClient languageService = LanguageServiceClient.create();
        Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
        double score = sentiment.getScore();
        languageService.close();

        // Get the URL of the image that the user uploaded to Blobstore.
        String imageUrl = getUploadedFileUrl(request, "image");
        Message message = new Message(user, text, score);
        if (imageUrl != null) {
            // Get the BlobKey that points to the image uploaded by the user.
            BlobKey blobKey = getBlobKey(request, "image");


            // Get the URL of the image that the user uploaded.
            String image_Url = getUploadedUrlForBlobKey(blobKey);
            List<String> str_imageLabels = new ArrayList<>();

            // Get the labels of the image that the user uploaded.
            byte[] blobBytes = getBlobBytes(blobKey);
            List<EntityAnnotation> imageLabels = getImageLabels(blobBytes);


            for (EntityAnnotation label : imageLabels) {
                str_imageLabels.add(label.getDescription());
            }

            message.setImageUrl(imageUrl);
            message.setImageLabels(str_imageLabels);
            datastore.storeMessage(message);
        } else {
            datastore.storeMessage(message);
        }

        String path = new URL(""+request.getHeader("referer")).getPath();
        if(path.equals("/feed.html")){
            response.sendRedirect("/feed.html");
        }
        else {
            response.sendRedirect("/user-page.html?user=" + user);
        }



    }


}

