export class Helpers {
  async waitFor(millSeconds) {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    return timer(millSeconds);
  }
}
