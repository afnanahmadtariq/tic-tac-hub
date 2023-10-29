import java.awt.Desktop;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class app {
    static String variableValue;
    public static void main(String args[]) throws IOException, InterruptedException, ExecutionException{
          // Create a thread to handle the POST request.
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        Future<String> future = executorService.submit(() -> {
            // Open the link in a new tab.
            Desktop.getDesktop().browse(URI.create("file:///C:/Users/afnan/OneDrive/Documents/GitHub/Tic-Tac-Web/punishment.html/"));

            // Post the info back to the app.
            URL url = new URL("http://localhost:8080/api/send-info");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Return the info from the POST request.
            return connection.getHeaderField("info");
        });

        // Wait for the thread to finish before exiting the program.
        String info = future.get();

        // Do something with the info from the POST request.
        variableValue = info;
        System.out.println(variableValue);

        // Shut down the executor service.
        executorService.shutdown();
    }
}
