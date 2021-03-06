const botconfig = require("./util/botconfig.json");
const help = require('./util/commands.json');
const Discord = require("discord.js");

const bot = new Discord.Client({disabledEveryone: true});
const prefix = botconfig.prefix;

// Fields
var backlog = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5'];
var inProgress;
var complete;
var commandList = ['add', 'remove', 'help'];
var itemID = 1;

// Signifies Launch
bot.on("ready", async () =>{
  console.log(`${bot.user.username} is online! Time to get shit done!`);
});

bot.on("message", async message => {
  if(message.author.bot) return ;
  if(message.channel.type == "dm") return;

  // Parse command, and check.
  let commands = message.content.split(" -");
  let cmd = [];
  //kanban command
  cmd[0] = commands[0];
  // what comes after.
  if(commands.length > 1)
    cmd[1] = commands[1].split(" ")[0];
  let args = commands.slice(1);

  //Error Handling.
  if (!commandList.includes(cmd[1]) && cmd.length > 1){  console.log(cmd); return message.channel.send(errorHandle(message));}
  //Add
  if (cmd[1] == commandList[0]) {addToBacklog(message, commands[1])}
  //Help -- benji
  if (cmd[1] == commandList[2]) {console.log("Im here"); return message.channel.send(helpList(message));}
  //Remove
  if (cmd[1] == commandList[1]) {removeItem(message, commands[1])}

  //display board
  if (cmd[0] === `${prefix}kanban` && commands.length == 1){
    // console.log(commands.length + "is the size");
    console.log("I made it to server info");
    //let sicon = message.guild.displayAvatarURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Kanbot-Bot!")
    .setColor("#0074E7")
    .addField("Project Backlog",
      "```" +
      displayBacklog()
      + "```")
    //.setThumbnail(sicon)
    // .addField("Server Name", message.guild.name)
    // .addField("Created On", message.guild.createdAt)
    .addField("your ID: ", "I've been called by " + message.member );
    //.addField("You joined", message.member.joinedAt)
    //.addField("Total Members", message.guild.memberCount);
    return message.channel.send(serverembed);
  }
})

function displayBacklog (){
  var display = "";
  console.log(backlog.length);
  for(var i = 0; i < backlog.length; i++) {
    display += (i + 1)+ " - "  + backlog[i] + "\n";
  }
  console.log("checkin some shit");
  console.log(display);
  return display;
}

function errorHandle(message) {
  console.log("Im here to handle errors");
  let errorHandle = new Discord.RichEmbed()
  .setColor('#800000')
  .addField("Please enter a valid Command!", "enter `" +" $kanban help"+ " `" + " for list of commands");
  return errorHandle;
}

function addToBacklog(message, item) {
  console.log("Here to add to backlog.");
  var content = item.split("\"")[1];
  message.channel.send("` "+ content + " `" + " has been added to the Backlog!")
  backlog.push(content);
  console.log(backlog);
}

function helpList(message) {
  let Help = new Discord.RichEmbed()
    .setColor("#0074E7")
    .setTitle("List of Board Commands")
    .addField(`${help.viewAll.command}`, `${help.viewAll.desc}`)
    .addField(`${help.backlog.command}`, `${help.backlog.desc}`)
    .addField(`${help.inprogress.command}`, `${help.inprogress.desc}`)
    .addField(`${help.completed.command}`, `${help.completed.desc}`)
    .addField(`${help.add.command}`, `${help.add.desc}`)
    .addField(`${help.delete.command}`, `${help.delete.desc}`)
    .addField(`${help.edit.command}`, `${help.edit.desc}`)
    .addField(`${help.forward.command}`, `${help.forward.desc}`)
    .addField(`${help.backward.command}`, `${help.backward.desc}`)
    .addField(`${help.up.command}`, `${help.up.desc}`)
    .addField(`${help.down.command}`, `${help.down.desc}`);
  return Help;
}

function removeItem(message, item) {
  var content = item.split("\"")[1];
  var i;
  if (content == null) {
    message.channel.send({embed: {
      color: 3447003,
      description: "Needs more parameters."
    }});
    return;
  }
  for (i = 0; i < backlog.length; i++) {
    if (backlog[content - 1]) {
      backlog.splice(content - 1, 1);
      message.channel.send({embed: {
        color: 3447003,
        description: "Item ID #" + content + "  removed by   " + message.member
      }});
      return;
    }
  }
}


bot.login(botconfig.token);
