export const scaleSounds = [
  { id: 'piano', label: 'Piano' },
  { id: 'clarinet', label: 'Clarinete', soundfont: 'FluidR3_GM' },
  { id: 'violin', label: 'Violino', soundfont: 'MusyngKite' },
  { id: 'alto_sax', label: 'Sax alto', soundfont: 'MusyngKite' },
]

// The same Salamander recordings used by PianoInstrumentPage, covering the scale range.
export const pianoSamples = [
  [60, 'C4'], [63, 'Ds4'], [66, 'Fs4'], [69, 'A4'],
  [72, 'C5'], [75, 'Ds5'], [78, 'Fs5'], [81, 'A5'], [84, 'C6'],
]
function pianoRoom(context, destination) {
  const impulse = context.createBuffer(2, Math.floor(context.sampleRate * 2.2), context.sampleRate)
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-6 * i / data.length) * Math.min(1, i / (context.sampleRate * .012))
    }
  }
  const input = context.createGain()
  const dry = context.createGain()
  const wet = context.createGain()
  dry.gain.value = .83
  wet.gain.value = .17
  input.connect(dry)
  dry.connect(destination)
  wet.connect(destination)
  let reverb
  function reset() {
    if (reverb) { input.disconnect(reverb); reverb.disconnect() }
    reverb = context.createConvolver()
    reverb.buffer = impulse
    input.connect(reverb)
    reverb.connect(wet)
  }
  reset()
  return { input, reset }
}
export async function loadScaleSamples(context, destination, id) {
  if (id !== 'piano') {
    const sound = scaleSounds.find(item => item.id === id)
    if (!sound) throw new Error('Unknown instrument')
    const samples = await Promise.all(Array.from({ length: 24 }, async (_, index) => {
      const midi = 60 + index
      const buffer = await fetchSample(context, `${process.env.PUBLIC_URL}/audio/scales/${id}/${midi}.mp3`)
      return { midi, buffer }
    }))
    return {
      play(midi, time, duration) {
        const sample = samples.find(item => item.midi === midi)
        if (!sample) throw new Error(`Missing sample: ${id} ${midi}`)
        const source = context.createBufferSource()
        const envelope = context.createGain()
        source.buffer = sample.buffer
        source.connect(envelope)
        envelope.connect(destination)
        envelope.gain.setValueAtTime(0, time)
        envelope.gain.linearRampToValueAtTime(.9, time + .012)
        envelope.gain.setValueAtTime(.9, time + duration)
        envelope.gain.linearRampToValueAtTime(0, time + duration + .1)
        source.onended = () => { source.disconnect(); envelope.disconnect() }
        source.start(time)
        source.stop(time + duration + .11)
        return source
      },
    }
  }
  const samples = await Promise.all(pianoSamples.map(async ([midi, name]) => {
    const buffer = await fetchSample(context, `https://tonejs.github.io/audio/salamander/${name}.mp3`)
    return { midi, buffer }
  }))
  const room = pianoRoom(context, destination)
  return {
    tailTime: 3.5,
    stopEffects: room.reset,
    play(midi, time, duration) {
      const sample = samples.reduce((best, item) => Math.abs(item.midi - midi) < Math.abs(best.midi - midi) ? item : best)
      const source = context.createBufferSource()
      const envelope = context.createGain()
      source.buffer = sample.buffer
      source.playbackRate.value = 2 ** ((midi - sample.midi) / 12)
      source.connect(envelope)
      envelope.connect(room.input)
      envelope.gain.setValueAtTime(0, time)
      envelope.gain.linearRampToValueAtTime(.8, time + .005)
      envelope.gain.setValueAtTime(.8, time + duration)
      envelope.gain.exponentialRampToValueAtTime(.001, time + duration + 1.25)
      source.onended = () => { source.disconnect(); envelope.disconnect() }
      source.start(time)
      source.stop(time + duration + 1.26)
      return source
    },
  }
}

async function fetchSample(context, url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`Sample unavailable: ${url}`)
    return await context.decodeAudioData(await response.arrayBuffer())
  } finally { clearTimeout(timer) }
}
