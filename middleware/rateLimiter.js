const rateLimitMap = new Map();
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60;

export function rateLimiter(ip) {
    const currentTime = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, firstRequestTime: currentTime });
        return true;
    }

    const entry = rateLimitMap.get(ip);

    if (currentTime - entry.firstRequestTime > WINDOW_SIZE) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, firstRequestTime: currentTime });
        return true;
    }

    if (entry.count >= MAX_REQUESTS) {
        return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
}
