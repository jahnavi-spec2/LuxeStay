export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry(fn, { retries = 3, baseDelayMs = 1000 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`  Retry ${attempt + 1}/${retries} after error: ${err.message}. Waiting ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}