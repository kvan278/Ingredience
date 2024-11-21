const USER_ROLES = Object.freeze({
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest"
});

const GENDER_OPTIONS = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    PREFER_NOT_TO_SAY: "prefer_not_to_say"
});


const ALLOWED_USER_KEYS = Object.freeze({
    username: 'username',
    avatarURL: 'avatarURL'
});

module.exports = {
    USER_ROLES,
    GENDER_OPTIONS,
    ALLOWED_USER_KEYS
};
