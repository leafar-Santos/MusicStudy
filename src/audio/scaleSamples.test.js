import { loadScaleSamples, pianoSamples } from './scaleSamples'

afterEach(() => { delete window.Soundfont; jest.restoreAllMocks() })

test('loads Salamander recordings and tunes the closest sample to the requested pitch', async () => {
  const originalFetch = global.fetch
  global.fetch = jest.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })
  const source = { playbackRate: {}, connect: jest.fn(), start: jest.fn(), stop: jest.fn() }
  const context = {
    sampleRate: 1000,
    createBuffer: (channels, length) => ({ getChannelData: () => new Float32Array(length) }),
    createConvolver: jest.fn(() => ({ connect: jest.fn(), disconnect: jest.fn() })),
    decodeAudioData: jest.fn().mockResolvedValue({ duration: 5 }),
    createBufferSource: () => source,
    createGain: () => ({ connect: jest.fn(), disconnect: jest.fn(), gain: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() } }),
  }
  try {
    const player = await loadScaleSamples(context, {}, 'piano')
    expect(global.fetch).toHaveBeenCalledTimes(pianoSamples.length)
    expect(global.fetch).toHaveBeenCalledWith('https://tonejs.github.io/audio/salamander/C4.mp3', expect.any(Object))
    player.play(61, 2, .5)
    expect(source.playbackRate.value).toBeCloseTo(2 ** (1 / 12))
    expect(source.start).toHaveBeenCalledWith(2)
    expect(source.stop).toHaveBeenCalledWith(3.76)
    expect(player.tailTime).toBe(3.5)
    expect(context.createConvolver).toHaveBeenCalledTimes(1)
    player.stopEffects()
    expect(context.createConvolver).toHaveBeenCalledTimes(2)
  } finally { global.fetch = originalFetch }
})

test.each(['clarinet', 'violin', 'alto_sax'])('decodes and schedules actual local %s samples for all 24 pitches', async id => {
  const fs = require('fs')
  const path = require('path')
  const originalFetch = global.fetch
  const sources = []
  const decoded = []
  global.fetch = jest.fn(async url => {
    const midi = url.split('/').pop()
    const bytes = fs.readFileSync(path.join(process.cwd(), 'public/audio/scales', id, midi))
    expect(bytes.length).toBeGreaterThan(1000)
    return { ok: true, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) }
  })
  const destination = {}
  const context = {
    decodeAudioData: jest.fn(async bytes => { const buffer = { bytes }; decoded.push(buffer); return buffer }),
    createBufferSource: () => { const source = { connect: jest.fn(), start: jest.fn(), stop: jest.fn() }; sources.push(source); return source },
    createGain: () => ({ connect: jest.fn(), gain: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() } }),
  }
  try {
    const player = await loadScaleSamples(context, destination, id)
    expect(global.fetch).toHaveBeenCalledTimes(24)
    expect(context.decodeAudioData).toHaveBeenCalledTimes(24)
    for (let midi = 60; midi < 84; midi++) {
      player.play(midi, 1, .5)
      expect(sources[midi - 60].buffer).toBe(decoded[midi - 60])
      expect(sources[midi - 60].start).toHaveBeenCalledWith(1)
      expect(sources[midi - 60].stop).toHaveBeenCalledWith(1.61)
    }
  } finally { global.fetch = originalFetch }
})
