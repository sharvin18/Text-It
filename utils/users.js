const users =  [];

/// Adding a new user
function joinNewUser(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

/// Fetching current user data
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

/// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1);
    }
}

/// Get users in a particular room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    joinNewUser,
    getCurrentUser,
    userLeave,
    getRoomUsers
};

