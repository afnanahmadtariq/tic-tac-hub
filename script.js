window.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video');
    video.addEventListener('ended', function() {
      // Scroll the page down smoothly after the video ends
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    });
    video.play();
  });