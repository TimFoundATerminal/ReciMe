const db = require('./db');

function reset() {
    const result = db.run("DELETE FROM pantry",{})
    db.run("DELETE FROM waste",{})
    return {message:db.validateChanges(result, 'DB reset succesfully', 'Error reseting DB')};
}

module.exports = {
    reset
}