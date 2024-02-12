let level =localStorage.getItem("level");
let first,second,count=0,turn=1,count1=0,count2=0
let player=1,playername;
let arrCards=[];//
let images=[]
let arrPlayer1=[],arrPlayer2=[];//שמירה לכל שחקן את הכרטיסים שמצא
let temp1,temp2,countwin=0;
let timeVar,data;
let monim=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let arrImages=["images/1.png","images/2.png","images/3.png","images/4.png","images/5.png","images/6.png"
,"images/7.png","images/8.png","images/9.png","images/10.png","images/11.png","images/12.png"];
//הכנת כרטיסי המשחק
for (let i = 0; i < level; i++) {
     first=Math.floor(Math.random()*level*2);
     
     while(monim[first]!=0){
        first=Math.floor(Math.random()*level*2);
     }
     monim[first]++;
     second=Math.floor(Math.random()*level*2);
     while(monim[second]!=0){
        second=Math.floor(Math.random()*level*2);
     }
     monim[second]++;
     arrCards[first]=i;
     arrCards[second]=i;
}
//הדפסת כרטיסי המשחק על המסך
for (let i = 0; i <level*2; i++) {
   
   var img=document.createElement("img");
   img.src="images/card.png"
   img.setAttribute("id","c"+i+arrImages[arrCards[i]])//  של התמונה שהוא מחביא src של כל כרטיס נמצא  id ב 
   img.setAttribute("class","card")
   img.addEventListener("click",oppsite);
   document.getElementById("play").appendChild(img);
}

function oppsite(){
   const audio=document.getElementById("click");
   audio.play();
   //הדפסת נתוני המצב הנוכחי
   document.getElementById("turn").innerHTML="player "+ player+" turn "+turn;
   //הפיכת הכרטיס
   temp1=event.target.id;
   //נוציא מה id את ה src של התמונה
   let t=temp1.indexOf('i');
   temp1=temp1.substring(t);
   event.target.src=temp1;
   if(turn==1){
      //אם זה הפיכת הכרטיס הראשון 
      turn=2;
      //לא ניתן אפשרות ללחוץ עליו שוב  בתור הנוכחי
      event.target.removeEventListener("click",oppsite)
      //נשמור את התמונה שלו לבדיקה בהפיכת הכרטיס השני
      temp2=temp1;
   }
   else{
      //אם זה הפיכת הכרטיס השני
      turn=1;
      
      images = document.querySelectorAll("img");
      
      if(check()==1)
      {
         //אם 2 הכרטיסים הם זוג
         const audio=document.getElementById("couple");
         audio.play();
         countwin++;
         //נשמור לשחקן זה את כרטיס
         (player==1)? arrPlayer1.push(temp1):arrPlayer2.push(temp1)
         //  לאחר שניה זוג זה כבר לא יופיע על המסך ולא יהיה ניתן עד לסיום המשחק ללחץ עליו שוב
         for (let i = 0; i < images.length; i++) {
            let str=images[i].src;
            let s=str.indexOf("images");
             str=str.substring(s);
             if(str==temp1){
               setTimeout(() => {
                  images[i].src="images/null.png"
                  images[i].removeEventListener("click",oppsite)
               }, 1000);
                
             }
         }
        
         if(countwin==level){          
            win();
         }
        
      }
       else{
         //אם זה לא זוג 
         // למשך שניה+ נציג את הכרטיסים הללו ולא יהיה ניתן בזמן זה ללחץ על אף כרטיס נוסף
         for (let i = 0; i < images.length; i++) {
              images[i].removeEventListener("click",oppsite);
         }
         //זוג זה יתהפך ועכשיו השחקן הבא יוכל ללחץ על כל הכרטיסים ההפוכים
         timeVar = setTimeout("turnBack()", 1200)
         
       }
       //נעבור לשחקן השני 
       if(player==1){
         count1++;//נגדיל את מספר הניסיונות שלו
         player=2;
       }
       else{
         count2++;
         player=1;
       }
     }
   
 }
  
function check(){
      return(temp1==temp2)? 1:0
}

function turnBack(){
   let images = document.querySelectorAll("img");
   
   for (let i = 0; i < images.length; i++) {
   
      let str=images[i].src;
      let s=str.indexOf("images");
      str=str.substring(s);
       //הפיכת הכרטיסים הגלויים
       if(str==temp1||str==temp2)
          images[i].src="images/card.png";
          //נוכל בתור הבא ללחץ על כל הכרטיסים ההפוכים
       if(str!="images/null.png")
         images[i].addEventListener("click",oppsite);
      
   }
 
}

function win(){
   const audio=document.getElementById("win");
   audio.play();
   //שמירת שיא ב localstorage
   let data_str = localStorage.getItem("high_score");
   let data;
   let count,len;
   (player==1)?count=count1:count=count2;
   (player==1)?len=arrPlayer1.length+1:len=arrPlayer2.length+1;
    if (!data_str)
        data = [];
    else
      data = JSON.parse(data_str);
    let user_data_index = data.findIndex(obj => obj.name == player);
      if (user_data_index > -1)
      {
          let old_user_data = data[user_data_index];
          // נבדוק האם השיא הנוכחי גדול מהקיים
          if ((len==old_user_data.couples&&count < old_user_data.tries)||len>old_user_data.couples)
          {
           
            old_user_data.couples =len;
            old_user_data.tries=count;                                                                                       
            data[user_data_index] = old_user_data;
          }
          
      }
      else
      {
          const obj = {
              couples: len,
              tries: count,
              name:player
  
          };
         data.push(obj);
      }
      //שמירת הנתונים המעודכנים ב localStorage
      data_str = JSON.stringify(data);
      localStorage.setItem("high_score", data_str);

      document.getElementById("ourGame").innerHTML=" ";

   //אם השחקן הראשון ניצח נדפיס את הקלפים שלו ןאחרי כמה ניסיונות היגיע לניצחון
   if(arrPlayer1.length>arrPlayer2.length){
     
      printWin(1);

   }
   else if(arrPlayer1.length<arrPlayer2.length){
      
      printWin(2);
   }
   else {
      p=document.createElement("p");
      let txt=document.createTextNode("teko!!!!!!!!!!!!!")
      p.appendChild(txt);
      document.getElementById("ourGame").appendChild(p)
      printWin(1);
      printWin(2);
   }
 
  }
 function printWin(num){
      //הדפסת הכרטיסים של השחקן המנצח
      let arrtemp,counttemp;
      if(num==1){
         arrtemp=arrPlayer1;
         counttemp=count1++;
      }
      else{
         arrtemp=arrPlayer2;
         counttemp=count2++;
      }
     
      p=document.createElement("p");
   
      let txt=document.createTextNode("player "+num+" win  after "+counttemp+" tries")
      p.appendChild(txt);
      document.getElementById("ourGame").appendChild(p)
      for (let i = 0; i < arrtemp.length; i++) {
          var img=document.createElement("img");
          img.setAttribute("class","card")
          img.src=arrtemp[i];
          document.getElementById("ourGame").appendChild(img);
      }
  
}
