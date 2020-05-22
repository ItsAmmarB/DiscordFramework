/* eslint-disable no-undef */

let i = 0;
setInterval(() => {
    const MSGLEN = Config.AutoMessage.messages.length;
    i++;
    if(i > MSGLEN) i = 0;
    emitNet('chat:addMessage', -1, { args: Config.AutoMessage.messages[i] });
}, Config.AutoMessage.waitTime * 1000);