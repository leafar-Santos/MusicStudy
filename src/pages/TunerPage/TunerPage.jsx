import { useEffect, useRef, useState } from 'react'

import './TunerPage.css'

const NOTE_NAMES = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
]

const MIN_REFERENCE = 430
const MAX_REFERENCE = 450

export default function TunerPage() {
  const [running, setRunning] = useState(false)

  const [permission, setPermission] = useState('idle')

  const [microphoneError, setMicrophoneError] = useState('')

  const [referenceA, setReferenceA] = useState(440)

  const [frequency, setFrequency] = useState(null)

  const [note, setNote] = useState('--')

  const [octave, setOctave] = useState(null)

  const [targetFrequency, setTargetFrequency] = useState(null)

  const [cents, setCents] = useState(0)

  const [signalDetected, setSignalDetected] = useState(false)

  const audioContextRef = useRef(null)

  const analyserRef = useRef(null)

  const streamRef = useRef(null)

  const sourceRef = useRef(null)

  const animationFrameRef = useRef(null)

  const bufferRef = useRef(null)

  const smoothedFrequencyRef = useRef(null)

  const referenceARef = useRef(referenceA)

  useEffect(() => {
    referenceARef.current = referenceA
  }, [referenceA])

  function autoCorrelate(buffer, sampleRate) {
    const size = buffer.length

    let rms = 0

    for (let i = 0; i < size; i += 1) {
      const value = buffer[i]

      rms += value * value
    }

    rms = Math.sqrt(rms / size)

    if (rms < 0.01) {
      return null
    }

    let start = 0
    let end = size - 1

    const threshold = 0.2

    for (let i = 0; i < size / 2; i += 1) {
      if (Math.abs(buffer[i]) < threshold) {
        start = i
      } else {
        break
      }
    }

    for (let i = 1; i < size / 2; i += 1) {
      if (Math.abs(buffer[size - i]) < threshold) {
        end = size - i
      } else {
        break
      }
    }

    const trimmedBuffer = buffer.slice(start, end)

    const trimmedSize = trimmedBuffer.length

    if (trimmedSize < 2) {
      return null
    }

    const correlations = new Array(trimmedSize).fill(0)

    for (let offset = 0; offset < trimmedSize; offset += 1) {
      let correlation = 0

      for (
        let i = 0;
        i < trimmedSize - offset;
        i += 1
      ) {
        correlation +=
          trimmedBuffer[i] *
          trimmedBuffer[i + offset]
      }

      correlations[offset] = correlation
    }

    let dip = 0

    while (
      dip + 1 < correlations.length &&
      correlations[dip] > correlations[dip + 1]
    ) {
      dip += 1
    }

    let maxValue = -1
    let maxPosition = -1

    for (
      let i = dip;
      i < correlations.length;
      i += 1
    ) {
      if (correlations[i] > maxValue) {
        maxValue = correlations[i]
        maxPosition = i
      }
    }

    if (maxPosition <= 0) {
      return null
    }

    let refinedPosition = maxPosition

    if (
      maxPosition > 0 &&
      maxPosition < correlations.length - 1
    ) {
      const previous =
        correlations[maxPosition - 1]

      const current =
        correlations[maxPosition]

      const next =
        correlations[maxPosition + 1]

      const denominator =
        previous -
        2 * current +
        next

      if (denominator !== 0) {
        const shift =
          0.5 *
          (previous - next) /
          denominator

        refinedPosition =
          maxPosition + shift
      }
    }

    const detectedFrequency =
      sampleRate / refinedPosition

    if (
      detectedFrequency < 40 ||
      detectedFrequency > 2500
    ) {
      return null
    }

    return detectedFrequency
  }

  function frequencyToNote(currentFrequency) {
    const reference =
      referenceARef.current

    const midi =
      Math.round(
        69 +
          12 *
            Math.log2(
              currentFrequency / reference
            )
      )

    const noteIndex =
      ((midi % 12) + 12) % 12

    const currentNote =
      NOTE_NAMES[noteIndex]

    const currentOctave =
      Math.floor(midi / 12) - 1

    const idealFrequency =
      reference *
      Math.pow(
        2,
        (midi - 69) / 12
      )

    const differenceInCents =
      1200 *
      Math.log2(
        currentFrequency /
          idealFrequency
      )

    return {
      note: currentNote,
      octave: currentOctave,
      targetFrequency: idealFrequency,
      cents: differenceInCents,
    }
  }

  function smoothFrequency(newFrequency) {
    if (!smoothedFrequencyRef.current) {
      smoothedFrequencyRef.current =
        newFrequency

      return newFrequency
    }

    const alpha = 0.22

    smoothedFrequencyRef.current =
      alpha * newFrequency +
      (1 - alpha) *
        smoothedFrequencyRef.current

    return smoothedFrequencyRef.current
  }

  function analyseSignal() {
    const analyser =
      analyserRef.current

    const audioContext =
      audioContextRef.current

    if (!analyser || !audioContext) {
      return
    }

    if (!bufferRef.current) {
      bufferRef.current =
        new Float32Array(
          analyser.fftSize
        )
    }

    analyser.getFloatTimeDomainData(
      bufferRef.current
    )

    const detectedFrequency =
      autoCorrelate(
        bufferRef.current,
        audioContext.sampleRate
      )

    if (detectedFrequency) {
      const smoothFrequencyValue =
        smoothFrequency(
          detectedFrequency
        )

      const noteData =
        frequencyToNote(
          smoothFrequencyValue
        )

      setFrequency(
        smoothFrequencyValue
      )

      setNote(noteData.note)

      setOctave(noteData.octave)

      setTargetFrequency(
        noteData.targetFrequency
      )

      setCents(noteData.cents)

      setSignalDetected(true)
    } else {
      setSignalDetected(false)
    }

    animationFrameRef.current =
      requestAnimationFrame(
        analyseSignal
      )
  }

  async function startTuner() {
    try {
      setMicrophoneError('')

      if (!window.isSecureContext) {
        setPermission('denied')

        setMicrophoneError(
          'O acesso ao microfone exige uma conexão segura (HTTPS). ' +
          'Abra o MusicStudy utilizando HTTPS.'
        )

        return
      }

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setPermission('denied')

        setMicrophoneError(
          'Seu navegador não disponibilizou acesso ao microfone. ' +
          'Verifique se o navegador suporta captura de áudio e se o site está usando HTTPS.'
        )

        return
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        })

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext

      if (!AudioContext) {
        stream
          .getTracks()
          .forEach(track => track.stop())

        throw new Error(
          'Web Audio API não suportada pelo navegador.'
        )
      }

      const audioContext =
        new AudioContext()

      if (
        audioContext.state === 'suspended'
      ) {
        await audioContext.resume()
      }

      const analyser =
        audioContext.createAnalyser()

      analyser.fftSize = 4096

      analyser.smoothingTimeConstant =
        0

      const source =
        audioContext.createMediaStreamSource(
          stream
        )

      source.connect(analyser)

      streamRef.current = stream

      audioContextRef.current =
        audioContext

      analyserRef.current = analyser

      sourceRef.current = source

      bufferRef.current =
        new Float32Array(
          analyser.fftSize
        )

      smoothedFrequencyRef.current =
        null

      setPermission('granted')

      setMicrophoneError('')

      setRunning(true)

      analyseSignal()
    } catch (error) {
      console.error(
        'Erro ao iniciar afinador:',
        error
      )

      setPermission('denied')

      setRunning(false)

      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        setMicrophoneError(
          'A permissão para usar o microfone foi negada. ' +
          'Autorize o microfone nas configurações do navegador e tente novamente.'
        )

        return
      }

      if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError'
      ) {
        setMicrophoneError(
          'Nenhum microfone foi encontrado neste dispositivo.'
        )

        return
      }

      if (
        error.name === 'NotReadableError' ||
        error.name === 'TrackStartError'
      ) {
        setMicrophoneError(
          'O microfone foi encontrado, mas não pôde ser utilizado. ' +
          'Ele pode estar sendo usado por outro aplicativo.'
        )

        return
      }

      if (
        error.name === 'OverconstrainedError'
      ) {
        setMicrophoneError(
          'O microfone não suporta a configuração de áudio solicitada.'
        )

        return
      }

      if (
        error.name === 'SecurityError'
      ) {
        setMicrophoneError(
          'O navegador bloqueou o acesso ao microfone por motivos de segurança.'
        )

        return
      }

      setMicrophoneError(
        error.message ||
          'Não foi possível iniciar o microfone.'
      )
    }
  }

  function stopTuner() {
    if (
      animationFrameRef.current
    ) {
      cancelAnimationFrame(
        animationFrameRef.current
      )

      animationFrameRef.current =
        null
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach(track =>
          track.stop()
        )

      streamRef.current = null
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect()
      } catch {
        // fonte já desconectada
      }

      sourceRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()

      audioContextRef.current = null
    }

    analyserRef.current = null

    bufferRef.current = null

    smoothedFrequencyRef.current =
      null

    setRunning(false)

    setSignalDetected(false)

    setFrequency(null)

    setNote('--')

    setOctave(null)

    setTargetFrequency(null)

    setCents(0)

    setMicrophoneError('')
  }

  function toggleTuner() {
    if (running) {
      stopTuner()
    } else {
      startTuner()
    }
  }

  useEffect(() => {
    return () => {
      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        )
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(track =>
            track.stop()
          )
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const clampedCents =
    Math.max(
      -50,
      Math.min(50, cents)
    )

  const needleRotation =
    clampedCents * 0.9

  const tuningState =
    !signalDetected
      ? 'waiting'
      : Math.abs(cents) <= 5
      ? 'tuned'
      : cents < 0
      ? 'flat'
      : 'sharp'

  const tuningLabel = {
    waiting: 'Aguardando nota',
    tuned: 'Afinado',
    flat: 'Abaixo',
    sharp: 'Acima',
  }[tuningState]

  function changeReference(value) {
    const parsed =
      Number(value)

    const normalized =
      Math.min(
        MAX_REFERENCE,
        Math.max(
          MIN_REFERENCE,
          parsed
        )
      )

    setReferenceA(normalized)
  }

  return (
    <div className="tuner-page">
      <header className="tuner-page__header">
        <div>
          <span className="tuner-page__eyebrow">
            Ferramentas do músico
          </span>

          <h1>Afinador</h1>

          <p>
            Toque uma nota e acompanhe em
            tempo real a frequência, a nota
            detectada e a diferença de afinação.
          </p>
        </div>

        <div
          className={`tuner-status ${
            running ? 'active' : ''
          }`}
        >
          <span />

          {running
            ? 'Microfone ativo'
            : 'Microfone desligado'}
        </div>
      </header>

      <div className="tuner-layout">
        <section
          className={`tuner-main ${tuningState}`}
        >
          <div className="tuner-main__top">
            <span>
              Nota detectada
            </span>

            <strong>
              A4 = {referenceA} Hz
            </strong>
          </div>

          <div className="tuner-note">
            <span>
              {signalDetected
                ? note
                : '—'}
            </span>

            {signalDetected &&
              octave !== null && (
                <small>
                  {octave}
                </small>
              )}
          </div>

          <div className="tuner-frequency">
            {signalDetected &&
            frequency
              ? `${frequency.toFixed(
                  1
                )} Hz`
              : running
              ? 'Toque uma nota'
              : 'Inicie o afinador'}
          </div>

          <div className="tuner-gauge">
            <div className="tuner-gauge__labels">
              <span>-50</span>
              <span>-25</span>
              <span>0</span>
              <span>+25</span>
              <span>+50</span>
            </div>

            <div className="tuner-gauge__arc">
              <div className="tuner-gauge__ticks">
                {Array.from({
                  length: 21,
                }).map((_, index) => (
                  <i
                    key={index}
                    className={
                      index === 10
                        ? 'center'
                        : ''
                    }
                  />
                ))}
              </div>

              <div
                className="tuner-gauge__needle"
                style={{
                  transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                }}
              >
                <span />
              </div>

              <div className="tuner-gauge__pivot">
                <span />
              </div>
            </div>
          </div>

          <div
            className={`tuning-feedback ${tuningState}`}
          >
            <div className="tuning-feedback__indicator" />

            <strong>
              {tuningLabel}
            </strong>

            {signalDetected && (
              <span>
                {Math.abs(cents) <= 5
                  ? `${cents.toFixed(
                      1
                    )} cents`
                  : `${
                      cents > 0
                        ? '+'
                        : ''
                    }${cents.toFixed(
                      1
                    )} cents`}
              </span>
            )}
          </div>

          {signalDetected &&
            targetFrequency && (
              <div className="tuner-target">
                Frequência ideal para{' '}
                <strong>
                  {note}
                  {octave}
                </strong>
                :{' '}
                <span>
                  {targetFrequency.toFixed(
                    2
                  )}{' '}
                  Hz
                </span>
              </div>
            )}

          <button
            className={`tuner-start ${
              running ? 'stop' : ''
            }`}
            onClick={toggleTuner}
          >
            <span>
              {running ? '■' : '●'}
            </span>

            {running
              ? 'Parar afinador'
              : 'Iniciar afinador'}
          </button>

          {permission ===
            'denied' && (
            <div className="tuner-error">
              <strong>
                Não foi possível acessar o microfone.
              </strong>

              <span>
                {microphoneError}
              </span>
            </div>
          )}
        </section>

        <aside className="tuner-settings">
          <section className="tuner-setting-card">
            <div className="tuner-setting-card__header">
              <span>01</span>

              <div>
                <h2>
                  Frequência de referência
                </h2>

                <p>
                  Ajuste a frequência do
                  Lá4 utilizada como base.
                </p>
              </div>
            </div>

            <div className="reference-control">
              <button
                onClick={() =>
                  changeReference(
                    referenceA - 1
                  )
                }
              >
                −
              </button>

              <div className="reference-control__value">
                <input
                  type="number"
                  min={MIN_REFERENCE}
                  max={MAX_REFERENCE}
                  value={referenceA}
                  onChange={event =>
                    changeReference(
                      event.target.value
                    )
                  }
                />

                <span>Hz</span>
              </div>

              <button
                onClick={() =>
                  changeReference(
                    referenceA + 1
                  )
                }
              >
                +
              </button>
            </div>

            <input
              className="reference-slider"
              type="range"
              min={MIN_REFERENCE}
              max={MAX_REFERENCE}
              step="1"
              value={referenceA}
              onChange={event =>
                changeReference(
                  event.target.value
                )
              }
            />

            <div className="reference-presets">
              {[432, 438, 440, 442].map(
                value => (
                  <button
                    key={value}
                    className={
                      referenceA === value
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setReferenceA(value)
                    }
                  >
                    {value} Hz
                  </button>
                )
              )}
            </div>
          </section>

          <section className="tuner-setting-card">
            <div className="tuner-setting-card__header">
              <span>02</span>

              <div>
                <h2>
                  Como interpretar
                </h2>

                <p>
                  O indicador mostra a
                  distância até a nota
                  correta.
                </p>
              </div>
            </div>

            <div className="tuner-help">
              <div>
                <span className="flat">
                  −
                </span>

                <div>
                  <strong>
                    Abaixo
                  </strong>

                  <small>
                    A frequência está
                    baixa. Aumente a
                    afinação.
                  </small>
                </div>
              </div>

              <div>
                <span className="tuned">
                  ●
                </span>

                <div>
                  <strong>
                    Afinado
                  </strong>

                  <small>
                    A nota está dentro
                    da margem de ±5
                    cents.
                  </small>
                </div>
              </div>

              <div>
                <span className="sharp">
                  +
                </span>

                <div>
                  <strong>
                    Acima
                  </strong>

                  <small>
                    A frequência está
                    alta. Abaixe a
                    afinação.
                  </small>
                </div>
              </div>
            </div>
          </section>

          <section className="tuner-setting-card tuner-info-card">
            <span className="tuner-info-card__icon">
              ♪
            </span>

            <div>
              <strong>
                Afinador cromático
              </strong>

              <p>
                O MusicStudy identifica
                automaticamente todas as
                12 notas da escala cromática.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}