const records = [
    {
        id: 1,
        username: 'ivan',
        password: 'ussr',
        displayName: 'Иван Драго',
        email: 'drago@mail.ru',
    },
    {
        id: 2,
        username: 'rocky',
        password: 'usa',
        displayName: 'Rocky Balboa',
        email: 'balboa@example.com',
    },
];

const findById = function (id, cb) {
    process.nextTick(function () {
        const idx = id - 1
        if (records[idx]) {
            cb(null, records[idx])
        } else {
            cb(new Error('User ' + id + ' does not exist'))
        }
    })
}

const findByUsername = function (username, cb) {
    process.nextTick(function () {
        let i = 0, len = records.length
        for (; i < len; i++) {
            const record = records[i]
            if (record.username === username) {
                return cb(null, record)
            }
        }
        return cb(null, null)
    })
}

const verifyPassword = (user, password) => {
    return user.password === password
}

module.exports = { findById, findByUsername, verifyPassword };