function rickRoll(){
    // Get the info to send back.
    const info = "This is the info I want to send back to the app.";

    // Post the info back to the app.
    fetch('http://localhost:8080/api/send-info', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(info),
    });

    // var i=0;
    // while(i<4){
    //     var url = 'https://youtu.be/xvFZjo5PgG0?si=bssTpx3-VaOJUGun';
    //     window.open(url, '_blank', 'noopener, noreferrer');
    //     url.blur();
    //     i++;
    // }
    // for (const url of urls) {
    //     openTab(url);
    // }
}

// const urls = ['https://www.google.com/', 'https://www.facebook.com/', 'https://www.amazon.com/'];

// function openTab(url) {
//   window.open(url, '_blank', 'noopener, noreferrer');
//   document.activeElement.blur();
// }



// window.addEventListener('beforeunload', function(event) {
//         // Run your code here
//         console.log('Tab or window is being closed');

//         // You can also prompt a confirmation dialog
//         alert("You sure you want to leave, before listening to all rick rolls");
//         event.preventDefault();
//         event.returnValue = ''; // This is necessary for older versions of Chrome and Firefox
// });