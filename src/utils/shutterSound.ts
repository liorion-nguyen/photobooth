/**
 * Phát âm thanh chụp máy ảnh (Web Audio API): tiếng "tách" ngắn giống shutter cơ.
 */
export function playShutterSound(): void {
  if (typeof window === "undefined") return;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  try {
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const sampleRate = ctx.sampleRate;
    const duration = 0.06;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    // Transient giống cơ khí: noise ngắn + envelope decay rất nhanh
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 120); // decay nhanh ~8ms
      data[i] = (Math.random() * 2 - 1) * decay * 0.35;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
    // Tiếng "tách" thứ hai nhỏ hơn (shutter đóng) ~20ms sau
    const buffer2 = ctx.createBuffer(1, Math.floor(sampleRate * 0.03), sampleRate);
    const data2 = buffer2.getChannelData(0);
    for (let i = 0; i < data2.length; i++) {
      const t = i / sampleRate;
      data2[i] = (Math.random() * 2 - 1) * Math.exp(-t * 150) * 0.2;
    }
    const noise2 = ctx.createBufferSource();
    noise2.buffer = buffer2;
    const filter2 = ctx.createBiquadFilter();
    filter2.type = "highpass";
    filter2.frequency.value = 600;
    noise2.connect(filter2);
    filter2.connect(ctx.destination);
    noise2.start(now + 0.018);
    noise2.stop(now + 0.05);
  } catch {
    // Ignore nếu trình duyệt chặn AudioContext (autoplay policy)
  }
}
