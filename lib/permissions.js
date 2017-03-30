//permission stuffs
module.exports = function permissions()
{
	//this code has been graciously provided by izy521, it is from the Discord.io lib
	const perms = {};
	perms.permissionBits = {
		GENERAL_CREATE_INSTANT_INVITE: 0,
		GENERAL_KICK_MEMBERS: 1,
		GENERAL_BAN_MEMBERS: 2,
		GENERAL_ADMINISTRATOR: 3,
		GENERAL_MANAGE_CHANNELS: 4,
		GENERAL_MANAGE_GUILD: 5,
		GENERAL_MANAGE_ROLES: 28,
		GENERAL_MANAGE_NICKNAMES: 27,
		GENERAL_CHANGE_NICKNAME: 26,
		GENERAL_MANAGE_WEBHOOKS: 29,
		GENERAL_MANAGE_EMOJIS: 30,

		TEXT_ADD_REACTIONS: 6,
		TEXT_READ_MESSAGES: 10,
		TEXT_SEND_MESSAGES: 11,
		TEXT_SEND_TTS_MESSAGE: 12,
		TEXT_MANAGE_MESSAGES: 13,
		TEXT_EMBED_LINKS: 14,
		TEXT_ATTACH_FILES: 15,
		TEXT_READ_MESSAGE_HISTORY: 16,
		TEXT_MENTION_EVERYONE: 17,
		TEXT_EXTERNAL_EMOJIS: 18,

		VOICE_CONNECT: 20,
		VOICE_SPEAK: 21,
		VOICE_MUTE_MEMBERS: 22,
		VOICE_DEAFEN_MEMBERS: 23,
		VOICE_MOVE_MEMBERS: 24,
		VOICE_USE_VAD: 25,
	};

	perms.hasPermission = function(bit, permissions)
	{
			if(((permissions >> bit) & 1) === 1)
			{
				return true;
			}
			else
			{
				return false;
			}
	}
	return perms;
}

