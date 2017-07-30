'use strict';

const { RtmClient, RTM_EVENTS, CLIENT_EVENTS, MemoryDataStore } = require('@slack/client');

class MessageBot {
  constructor(bot_token, messageHandler) {
    this.bot = new RtmClient(bot_token, {
      logLevel: 'error',
      dataStore: new MemoryDataStore(),
    });

    this.bot.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this.user = this.bot.dataStore.getUserById(this.bot.activeUserId);
      this.team = this.bot.dataStore.getTeamById(this.bot.activeTeamId);
      console.log(`Connected to ${this.team.name} as ${this.user.name}`);
    });

    this.bot.on(RTM_EVENTS.MESSAGE, message => {
      if (message.type === 'message') {
        messageHandler(message);
      }
    });

    this.bot.start();
  }

  say(message, channel_id) {
    this.bot.sendMessage(message, channel_id);
  }
}

module.exports = {
  MessageBot,
};
