module.exports.isAdmin = (req, res, next) => {
    const { role } = req.user;

    if (role === 'admin') {
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

    if (role === 'user') {
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

    if (role === 'store') {
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

    if (role === 'store' || role === 'user') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ store หรือ user เท่านั้น'
            }
        });
    }
}

module.exports.isAdminOrUser = (req, res, next) => {
    const { role } = req.user;

    if (role === 'admin' || role === 'user') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ admin หรือ user เท่านั้น'
            }
        });
    }
}

module.exports.isAdminOrStore = (req, res, next) => {
    const { role } = req.user;

    if (role === 'admin' || role === 'store') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ admin หรือ store เท่านั้น'
            }
        });
    }
}

module.exports.isUserOrAdminOrStore = (req, res, next) => {
    const { role } = req.user;

    if (role === 'user' || role === 'admin' || role === 'store') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ user, admin หรือ store เท่านั้น'
            }
        });
    }
}
