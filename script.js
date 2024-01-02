let currentSong =new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function  getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response =await a.text();
    let div = document.createElement("div")
    div.innerHTML=response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playmusic = (track, pause=false)=>{
    currentSong.src="/songs/"+track
    if(!pause){
        currentSong.play()
    }
    // let audio= new Audio("/songs/"+track)
    
    play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function main(){ 
 

let songs= await getSongs() 
 playmusic(songs[0], true)

let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML+ `<li> <img class="" src="music.svg" alt="">
    <div class="info">
      <div> ${song.replaceAll("%20"," ")}</div>
      <div>Kuldeep </div>
    </div>
    <div class="playnow"> <img class="" src="play.svg" alt=""></div></li>`;
}
// 

Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
    e.addEventListener("click",element =>{
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
 })

 // attacg ab eventlistioner to play next or priviouse
play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play()  
      
    }
    else{
        currentSong.pause()
        play.src="play.svg"
    }
})

 // Listen for timeupdate event
 currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})

// add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e =>{
    let parcent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = parcent +"%";
    currentSong.currentTime= ((currentSong.duration)* parcent)/100
})
// menu
document.querySelector(".menu").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="0";
})
//close menu
document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="-180%";
})
}
//volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume = parseInt(e.target.value)/100
})
main()
