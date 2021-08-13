const ytdl = require("ytdl-core")
const { MessageActionRow, MessageButton, MessageEmbed, Client, CommandInteraction } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
getVoiceConnection,
demuxProbe
} = require('@discordjs/voice');

const yts = require( 'yt-search' )


class Song {
/**
 * 
 * @param {Object} song 
 * @param {String} type 
 * @name SongDetials
 */
  constructor(song, type) { 
    switch(type) {
      case 'YOUTUBE_SEARCH': 
      this.title = song.title
      this.url = song.url
      this.author = song.author,
      this.user = song.user
      this.type = type
    break;
    case 'YOUTUBE_URL':
     yts(song.videoDetails.video_url).then(data => {
      Object.entries(new Song(data, 'YOUTUBE_SEARCH')).forEach(obj => {
        this[obj[0]] = obj[1]
      })
     })
    break;
  case 'SPOTIFY_URL':
 this.unsuported = true
  break;  
  default:
    this.unsuported = true
  break;  
  }
  }
}

class Music {
  constructor(ops = {}) {
     this.Regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album)[\/:]([A-Za-z0-9]+)/ 
     this.ops = ops
  console.log('FOUND_DEBUG')
  }
  static READY() { return this !== {} }
  changeVol(message, serverQueue, args) {
      message.channel.send("set volume to " + parseInt(args));
      //serverQueue.volume = parseInt(args);
      //  serverQueue.connection.dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 5)
  };
  /**
   * 
   * @param {Message} message 
   * @param {Map} serverQueue 
   * @param {String[]} args 
   * @param {Boolean} NoMessage 
   * @param {Object} options
   * @returns {Object}
   */
  async execute(message = {}, serverQueue = null, args = [], NoMessage = false, options = {}) {
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      !options.interaction ? message.channel.send(
        "You need to be in a voice channel to play music!"
      ) : interaction.reply("You need to be in a voice channel to play music!", { fetchReply: true })
    return;
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  let song;
  // console.log(this)
    let SEARCH_TYPE = Music.findType(args.join(' '))
    switch(SEARCH_TYPE) {
      case 'YOUTUBE_SEARCH': 
      const yts = require( 'yt-search' )
  let video = await yts(args.join(' '))
  video = { all: video.all.filter(v => v.type === 'video') }
  if(video.all.length === 0) {
  if(!NoMessage) message.channel.send({ content: `Cannot find song **${args[0]}** ` })
  return;
  }
  song = new Song(video.all[0], SEARCH_TYPE)
  break;
  case 'YOUTUBE_URL':
    let data = await ytdl.getBasicInfo(ytdl.getURLVideoID(query))
    if(!data) return !options.interaction ? message.channel.send({ content: `Invalid youtube URL!`, embeds: [] }) : message.reply('Error')
    song = new Song(data, SEARCH_TYPE)
    break;
    default:
      message.reply("idk what song i just recived so uh " + SEARCH_TYPE + ' does not exist')
  }
  
   
    if (!serverQueue) {
      let queueContruct = {
  songs: [],
  voiceChannel: voiceChannel,
  textChannel: message.channel,
  player: null,
  playing: true,
  volume: 5
      }
  // console.log(song.other)
      message.client.queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = joinVoiceChannel({
          channelId: message.member.voice.channel.id,
          guildId: message.member.guild.id,
          adapterCreator: message.member.guild.voiceAdapterCreator,
      })
  // console.log(connection)
        queueContruct.connection = connection;
  if(message.member.voice.channel.type === 'GUILD_STAGE_VOICE') {
  setTimeout(() => {
  message.guild.me.voice.setSuppressed(false).catch(err => {
  message.client.error(err)
  message.guild.me.voice.setRequestToSpeak(true);
  message.reply("Faild to set as speaking request send.")
  })
  }, 3000)
  
  }
        Music.play(message, queueContruct.songs[0], NoMessage);
      } catch (err) {
        message.client.error(err);
  if(queueContruct.connection) {
  queueContruct.connection.destroy()
  }	
      //  message.client.queue.delete(message.guild.id);
        return message.channel.send(err.message);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
  static findType(query, type) {
    
    if(query.match(this.Regex)?.[1]?.toUpperCase() === 'PLAYLIST') return 'SPOTIFY_PLAYLIST'
    if(query.match(this.Regex)?.[1]?.toUpperCase() === 'TRACK') return 'SPOTIFY_TRACK'
    if(query.match(this.Regex)?.[1]?.toUpperCase() === 'ALBUM') return 'SPOTIFY_ALBUM'
  if(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(query)) return 'YOUTUBE_SONG'
  return 'YOUTUBE_SEARCH'
  
  
   // return url.match(this.Regex)?.[1]?.toUpperCase() === type 
  
  }
  skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
  serverQueue.songs[0].looped = false
  serverQueue.songs[0].skipped = true 
  serverQueue.player.stop();
  }
  
  stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
      
    if (!serverQueue)
      return message.channel.send("There is no song that I could stop!");
    serverQueue.songs = [];
    if(serverQueue.connection) {
  serverQueue.connection.destroy()
  serverQueue.connection = null
  serverQueue.player = null
  serverQueue.playing = false
  }
  message.channel.send(' the queue has ended!')
  message.client.queue.delete(message.guild.id)
  }
  
  static async play(message, song, looped) {
  const guild = message.guild 
  const serverQueue = message.client.queue.get(guild.id);
    if (!song) {
      serverQueue.connection.destroy()
      message.client.queue.delete(guild.id);
  message.channel.send(' the queue has ended!')
      return;
    }
  
    const player = createAudioPlayer()
  const data = await ytdl(song.url, { filter: "audioonly" })
  let resource =  createAudioResource(data, {
  inputType: StreamType.Arbitrary,
   })
  
  player.play(resource)
  let date = Date.now()
   player.on(AudioPlayerStatus.Idle, () => {
  if(1000 > Date.now() - date) return;
  // message.reply(`IDLE ${Date.now() - date}`)
  console.log(serverQueue.songs[0])
  
  if(serverQueue.songs[0].looped && !serverQueue.songs[0].skipped) return play(message, serverQueue.songs[0], true);
      
  serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
     player.on("error", error => message.client.error(error.message));
    // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.player = player;
  // message.client.error(dispatcher)
  serverQueue.connection.on(VoiceConnectionStatus.Playing, () => {
      message.client.error('The audio player has started playing!');
    });
  serverQueue.connection.subscribe(player)
    if (!looped) { 
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
                 }
  }
  
  }
module.exports.Music = Music