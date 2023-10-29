window.addEventListener('DOMContentLoaded', function(){
    var count = this.localStorage.getItem('count');
    if(count<=5){
        var url = 'recursive.html';
        window.open(url, '_blank' , 'noopener', 'noreferrer');
        window.open("https://youtu.be/xvFZjo5PgG0?si=V9suskSAE9imGj7d", '_blank' , 'noopener', 'noreferrer');
        this.window.location.href("https://youtu.be/xvFZjo5PgG0?si=V9suskSAE9imGj7d");
        count++;
        this.localStorage.setItem('count', count);
    }
    else{
        this.window.location.href("punishment.html");
    }
});