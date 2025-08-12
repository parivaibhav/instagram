export function withErrorHandler(handler) {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error(error);
            res
                .status(error.status || 500)
                .json({ message: error.message || "Internal Server Error" });
        }
    };
}
