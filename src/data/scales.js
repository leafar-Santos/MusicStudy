export const scaleTypes = [
  { slug: 'diatonica', title: 'Escala Diatônica', subtitle: 'Maior · sete notas, uma estrutura', intervals: [0, 2, 4, 5, 7, 9, 11, 12], concept: 'Uma escala diatônica tem sete notas, com cinco tons e dois semitons. Aqui estudamos a escala maior, um dos tipos de escala diatônica. A menor natural também é diatônica.', formula: 'T · T · S · T · T · T · S', color: '#d7ad62' },
  { slug: 'menor-natural', title: 'Escala Menor Natural', subtitle: 'A sonoridade do modo eólio', intervals: [0, 2, 3, 5, 7, 8, 10, 12], concept: 'A menor natural tem o 3º, o 6º e o 7º graus um semitom abaixo dos graus da escala maior de mesma tônica. Mantém as mesmas notas na subida e na descida.', formula: 'T · S · T · T · S · T · T', color: '#8ac5d2' },
  { slug: 'menor-harmonica', title: 'Escala Menor Harmônica', subtitle: 'O sétimo grau elevado', intervals: [0, 2, 3, 5, 7, 8, 11, 12], concept: 'A menor harmônica eleva o 7º grau da menor natural em um semitom. Isso cria uma sensível que conduz à tônica e uma segunda aumentada entre o 6º e o 7º graus.', formula: 'T · S · T · T · S · 3S · S', color: '#b6a0dc' },
  { slug: 'menor-melodica', title: 'Escala Menor Melódica', subtitle: 'Explore a subida e a descida', intervals: [0, 2, 3, 5, 7, 9, 11, 12], concept: 'Na forma clássica estudada aqui, a menor melódica eleva o 6º e o 7º graus da menor natural na subida e retorna à menor natural na descida. No jazz, é comum manter a forma ascendente nas duas direções.', formula: 'T · S · T · T · T · T · S', color: '#92c8aa' },
]

const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const names = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si']
const natural = [0, 2, 4, 5, 7, 9, 11]
const accidentalNames = { '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' }
export const tonics = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'].map(id => ({
  id, label: names[letters.indexOf(id[0])] + (id[1] === '#' ? '♯' : id[1] === 'b' ? '♭' : ''),
}))

export function buildScale(tonic, type, direction = 'ascending') {
  const start = letters.indexOf(tonic[0])
  const root = 60 + natural[start] + (tonic[1] === '#' ? 1 : tonic[1] === 'b' ? -1 : 0)
  const intervals = type.slug === 'menor-melodica' && direction === 'descending' ? scaleTypes[1].intervals : type.intervals
  const notes = intervals.map((interval, degree) => {
    const position = start + degree
    const letterIndex = position % 7
    const octave = 4 + Math.floor(position / 7)
    const midi = root + interval
    const accidental = midi - (12 * (octave + 1) + natural[letterIndex])
    return { midi, degree: degree + 1, position, octave, accidental, symbol: accidentalNames[accidental], name: names[letterIndex] + accidentalNames[accidental], frequency: 440 * 2 ** ((midi - 69) / 12) }
  })
  return direction === 'descending' ? notes.reverse() : notes
}
