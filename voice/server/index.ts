
import * as alt from 'alt-server';
import { VoiceChannel } from 'alt-server';
import { useRebar } from '@Server/index.js';


const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();
const useInventory = await Rebar.useApi().getAsync('inventory-api');
const hungerapi = await Rebar.useApi().getAsync('hunger-api');
const currencyapi = await Rebar.useApi().getAsync('currency-api');
const db = Rebar.database.useDatabase();
const promptbarapi = await Rebar.useApi().getAsync('promptbar-api');
const notifyapi = await Rebar.useApi().getAsync('ascended-notification-api')



const long = new VoiceChannel(true, 25);
const mid = new VoiceChannel(true, 8);
const low = new VoiceChannel(true, 3);


Rebar.events.useEvents().on('character-bound', (player: alt.Player) => {
  long.addPlayer(player);
  mid.addPlayer(player);
  low.addPlayer(player);




  //将玩家在long和low语音频道静音，默认mid频道
  long.mutePlayer(player)
  low.mutePlayer(player)
  mid.unmutePlayer(player);
});



alt.onClient('switchVoiceChannel', (player: alt.Player, currentChannel: string) => {
  if (currentChannel === '远距离25米') {
    long.unmutePlayer(player);
    mid.mutePlayer(player);
    low.mutePlayer(player);


  } else if (currentChannel === '中距离8米') {
    mid.unmutePlayer(player);
    long.mutePlayer(player);
    low.mutePlayer(player);


  } else if (currentChannel === '近距离3米') {
    low.unmutePlayer(player);
    long.mutePlayer(player);
    mid.mutePlayer(player);

  }
});



alt.on('playerDisconnect', (player: alt.Player) => {
  long.removePlayer(player);
  mid.removePlayer(player);
  low.removePlayer(player);
});







