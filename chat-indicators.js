Hooks.on("renderChatMessage", (chatMessage, html, messageData) => {
    injectMessageTag(html, messageData);
    injectWhisperParticipants(html, messageData);
});

function injectMessageTag(html, messageData) {
    const timestampTag = html.find(".message-timestamp");

    const indicatorElement = $("<span>");
    indicatorElement.addClass("chat-mode-indicator");

    const whisperTargets = messageData.message.whisper;

    const isBlind = messageData.message.blind || false;
    const isWhisper = whisperTargets?.length > 0 || false;
    const isSelf = isWhisper && whisperTargets.length === 1 && whisperTargets[0] === messageData.message.user;
    const isRoll = messageData.message.roll !== undefined;

    // Inject tag to the left of the timestamp
    if (isBlind) {
        indicatorElement.text(game.i18n.localize("CHAT.RollBlind"));
        timestampTag.before(indicatorElement);
    } else if (isSelf && whisperTargets[0]) {
        indicatorElement.text(game.i18n.localize("CHAT.RollSelf"));
        timestampTag.before(indicatorElement);
    } else if (isRoll && isWhisper) {
        indicatorElement.text(game.i18n.localize("CHAT.RollPrivate"));
        timestampTag.before(indicatorElement);
    } else if (isWhisper) {
        indicatorElement.text(game.i18n.localize("chat-indicators.Whisper"));
        timestampTag.before(indicatorElement);
    }
}

function injectWhisperParticipants(html, messageData) {
    const alias = messageData.alias;
    const whisperTargetString = messageData.whisperTo;
    const whisperTargetIds = messageData.message.whisper;
    const isWhisper = whisperTargetIds?.length > 0 || false;
    const isRoll = messageData.message.roll !== undefined;

    const authorId = messageData.message.user;
    const userId = game.user.data._id;

    if (!isWhisper) return;
    if (userId !== authorId && !whisperTargetIds.includes(userId) ) return;

    // remove the old whisper to content, if it exists
    html.find(".whisper-to").detach();

    // if this is a roll
    if (isRoll) return;

    // add new content
    const messageHeader = html.find(".message-header");

    const whisperParticipants = $("<span>");
    whisperParticipants.addClass("whisper-to");
    
    const whisperFrom = $("<span>");
    whisperFrom.text(`${game.i18n.localize("chat-indicators.From")}: ${alias}`);

    const whisperTo = $("<span>");
    whisperTo.text(`${game.i18n.localize("CHAT.To")}: ${whisperTargetString}`);

    whisperParticipants.append(whisperFrom);
    whisperParticipants.append(whisperTo);
    messageHeader.append(whisperParticipants);
}