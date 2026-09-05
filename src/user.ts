export interface UserRecord {
    id: number;
    username: string;
    password: string;
    displayName: string;
    email: string;
}

const records: UserRecord[] = [
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

export const findById = (
    id: number,
    cb: (err: Error | null, user?: UserRecord) => void
): void => {
    process.nextTick(() => {
        const idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

export const findByUsername = (
    username: string,
    cb: (err: Error | null, user?: UserRecord | null) => void
): void => {
    process.nextTick(() => {
        for (const record of records) {
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

export const verifyPassword = (user: UserRecord, password: string): boolean => {
    return user.password === password;
};
