const readauthorization = async (req, res, next) => {
    try {
        if (req.user.role === 'write' || req.user.role === 'read') {
            next();
        } else {
            return res.status(401).send('Unauthorized!');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = readauthorization;