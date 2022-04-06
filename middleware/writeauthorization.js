const writeauthorization = async (req, res, next) => {
    try {
        if (req.user.role === 'write') {
            next();
        } else {
            return res.status(401).json({ message: 'You are unauthorized!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...' });
    }
}

module.exports = writeauthorization;