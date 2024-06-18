module.exports.isAdmin = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ admin เท่านั้น'
            }
        });
    }
}

module.exports.isUser = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'user') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ user เท่านั้น'
            }
        });
    }
}

module.exports.isStore = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'store') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ store เท่านั้น'
            }
        });
    }
}

module.exports.isStoreOrUser = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'store'|| role === 'user') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ store หรือ user เท่านั้น'
            }
        });
    }
}