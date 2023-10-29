window.addEventListener('DOMContentLoaded', function(){
        var loadscreen = sessionStorage.getItem('loadscreen');
        if(!(loadscreen)){
                var intro = document.getElementById('intro');
                intro.style.display = 'flex'
                sessionStorage.setItem('loadscreen', true)
        }
        //rule book
        var referenceDiv = document.getElementsByClassName('navbar');
        var referenceDiv = referenceDiv[0];
        var targetDiv = document.getElementById('rule-book');
        if(targetDiv){
                var referenceHeight = referenceDiv.offsetHeight;
                referenceHeight += 1;
                targetDiv.style.top = referenceHeight + "px";
        }
});

function index(){
        sessionStorage.clear();
        window.location.href = 'index.html';
}
function download(Url) {
        var link = document.createElement('a');
        link.href = Url;
        link.setAttribute('download', '');
        link.click();
}
function scrollToElement(elementId) {
        var element = document.getElementById(elementId);
        var offset = element.getBoundingClientRect().top;
      
        window.scrollTo(0, offset - 120);
}


//Scroll bar width

// window.addEventListener('DOMContentLoaded', function() {
//         // Create a dummy element to calculate the width of the scrollbar
//         var flag = this.sessionStorage.getItem('nav-end');
//         if(!flag){
//                 var dummy = document.createElement('div');
//                 dummy.style.width = '100px';
//                 dummy.style.height = '100px';
//                 dummy.style.overflow = 'scroll';
//                 dummy.style.visibility = 'hidden';
//                 document.body.appendChild(dummy);
//                 var scrollbarWidth = dummy.offsetWidth - dummy.clientWidth;
//                 document.body.removeChild(dummy);
        
//                 // Set the custom CSS variable with the scrollbar width
//                 document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
//                 this.sessionStorage.setItem('nav-end', true);
//         }
// });

// (css)
// width: calc(100% - var(--scrollbar-width));