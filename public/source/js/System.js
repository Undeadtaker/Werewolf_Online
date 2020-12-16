function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
//Cupid, Seer, WW, WhiteWW, Witch, Villager, Hunter,
//ids = list
//names= list
//game= string
function create(ids,names,gameid){
  var ng = new Game(gameid);
  if (ids.length < 12){
    var roles=["WW","WW","Seer","Witch","Hunter","Cupid"];
    for (i = 0; i < (ids.length - 6); i++) {
      roles.push("Villager");
      }
  }else if((ids.length > 11 && ids.length < 18)){
    var roles=["WW","WW","WW","Seer","Witch","Hunter","Cupid"];
    for (i = 0; i < (ids.length - 7); i++) {
      roles.push("Villager");
      }
  }else if((ids.length > 17 )){
    var roles=["WW","WW","WW", "WW","Seer","Witch","Hunter","Cupid"];
    for (i = 0; i < (ids.length - 8); i++) {
      roles.push("Villager");
      }
  }
  shuffled=shuffle(roles);
  for (i = 0; i < (ids.length); i++){
    var np = new GamePlayer(ng, ids[i], names[i], shuffled[i]);
    np.checkwitch();
    console.log("np.id display role ");
    ng.addplayer(np);
    ng.Roles.push(np.role);
    ////////
  }
}

class GamePlayer{
  constructor(game,id, name, role){
    this.game=game;
    this.id=id;
    this.name=name;
    this.role=role;
    this.status=0; //alive=0, selected=1, dead=2;
    this.lovebird=false;
    this.killpotion=false;
    this.savepotion=false;
  }
  checkwitch(){
    if (this.role=="Witch"){
      this.killpotion=true;
      this.savepotion=true;
    }
  }
  seeRole(){
    return this.role;
  }
  killplayer(x){
    x.status=1;
  }
  vote(x){
    this.game.Votes.push(x);
  }
  wwvote(x){
    this.game.wwVotes.push(x);
  }
}
/*
class Player{
  constructor(name,game){
    this.game=game
    this.name=name;
    this.role=null;
    this.status=null; //alive=0, selected=1, dead=2;
    this.lovebird=false;
    this.killpotion=false;
    this.Save_potion=false;
  }
  seeRole(){
    return this.role;
  }
  killplayer(x){
    x.status=1;
  }
  vote(x){
    game.Votes.push(x);
  }
  wwvote(x){
    game.wwVotes.push(x);
  }
}

class Room {
  constructor(id,maxnumber){
    this.id=id;
    this.maxnumber=maxnumber;
    this.Players=[];
  }
  addplayer(playerid,name){
    var nplayer = new Player(playerid,this);
    this.Players.push(nplayer);
  }
}

//------------------------------------------------------------------------------
*/

class Game{
  constructor(name){
    this.Name = name;
    this.Players=[];
    this.Dead=[];
    //this.Status=0; //lobby=0, running=1, ended=2,
    this.Roles=[];
    this.Winners=[];
    this.Losers=[];
    this.Votes=[];
    this.wwVotes=[];
    this.Phases=0; //0=setup, 1=Cupid, 2=seer, 3=WW, 4=WhiteWW, 5=Witch, 6=Day, 61=Hunter, 62=lovers
    this.Nights=0,
  }
  addplayer(player){
    this.Players.push(player);
  }
  deleteplayer(playerid){
    this.Players.pop(playerid);
  }
  killplayer(x){
    x.status=2;
    this.Dead.push(x);
  }
  printnames(){
    console.log(this.Players);
    return this.Players;
  }
  assignroles(){
    shuffled=shuffle(this.Roles);
    for (x in this.Players){
      this.Players[x].Role=shuffled[x];
    }
  }
  checkforwinner(){
    var whiteww=0;
    var ww=0;
    var vil=0;
    var love=0;
    for (x in this.Players){
      if (this.Players[x].Role="ww" or this.Players[x].Role="whiteww"){
        ww+=1;
      }else if (this.Players[x].Role="villager"){
        vil+=1;
      }else if (this.Players[x].Role="whiteww"){
        whiteww+=1;
      }
      if (this.Players[x].love=true){
        love=+1;
      }
    }
    var sumcheck= whiteww + ww + vil;
    if(ww==0 && vil>0){
      return "villagers won";
    }else if (ww>1 && vil==0) {
      return "werewolves won";
    }else if (ww>1 && vil==0 && whiteww=1){
      return "whitewerewolf won";
    }else if (sumcheck==2 && love==2){
      return "lovers won";
    }else{
      return false;
    }
  }
  //0=setup, 1=Cupid, 2=seer, 3=WW, 4=WhiteWW, 5=Witch, 6=Day, 61=Hunter,
  function phases(){
      this.nights+=1;
      if (this.phases==0){//set up phase
          this.assignroles();
      }else if (x==1){ //
        for (x in this.Players){
          if (this.Players[x].Role="Cupid"){
            Cupid();
          }
        }
      }else if (this.phases==2){
          checkforwinner()
          for (x in this.Players){
            if (this.Players[x].Role="Seer" && this.Players[x].status==0){
              Seer();
            }
          }
      }else if (this.phases==3){
        for (x in this.Players){
          if ((this.Players[x].Role="WW" || this.Players[x].Role="WhiteWW")&& this.Players[x].status==0){
            WW();
          }
        }
      }else if (x==4) {
        for (x in this.Players){
          if (this.Players[x].Role="WhiteWW" && this.Players[x].status==0 && this.nights%2=true){
            WhiteWW();
          }
        }
      }else if (x==5) {
        for (x in this.Players){
          if (this.Players[x].Role="Witch" && this.Players[x].status<2 && (this.Players[x].killpotion=1 || this.Players[x].savepotion=1)){
            Witch();
          }
        }
      }else if (x==6){
        checkforwinner();
        killoff();
        Day();
      }else if (x==61){
        Hunter();
      }
  }

  }
}

//------------------------------------------------------------------------------

class System{
  constructor(){
    this.games=[];
    this.runninggames=[];
    this.closedgames=[];
  }
  addgame(x){
    var nGame=new Game(x);
    this.games.push(nGame);
    this.runninggames.push(nGame);
  }
  finishGame(x){
    x.status=1;
    for (i in this.runninggames){
      if (x.name==this.runninggames[i].name){
        curr=this.runninggames[i];
        this.closedgames.push(curr);
        this.runninggames.pop(curr);
        console.log("game has been closed");
        return true;
      }else{
        return false;
      }
    }
  }
  showrunning(){
    //console.log(this.runninggames);
    return this.runninggames;
  }
}

p1 = new System();
p1.addgame("hi");
p1.showrunning();
p1.finishGame();
//p1.test("blub");
