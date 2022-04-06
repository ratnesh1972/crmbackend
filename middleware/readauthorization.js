const readauthorization = async (req, res, next) => {
    try {
        if (req.user.role === 'write' || req.user.role === 'read') {
            next();
        } else {
            return res.status(401).json({ message: 'You are unauthorized!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...' });
    }
}

module.exports = readauthorization;