import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell/AppShell'
import HomePage from './pages/HomePage/HomePage'
import LearnPage from './pages/LearnPage/LearnPage'
import PracticePage from './pages/PracticePage/PracticePage'
import InstrumentsPage from './pages/InstrumentsPage/InstrumentsPage'
import ToolsPage from './pages/ToolsPage/ToolsPage'
import MetronomePage from './pages/MetronomePage/MetronomePage'
import TunerPage from './pages/TunerPage/TunerPage'
import CircleOfFifthsPage from './pages/CircleOfFifthsPage/CircleOfFifthsPage'
import DictionaryPage from './pages/DictionaryPage/DictionaryPage'
import TheoryTopicPage from './pages/TheoryTopicPage/TheoryTopicPage'
import ExerciseTopicPage from './pages/ExerciseTopicPage/ExerciseTopicPage'
import PianoInstrumentPage from './pages/instruments/PianoInstrumentPage/PianoInstrumentPage'
import ViolinoInstrumentPage from './pages/instruments/ViolinoInstrumentPage/ViolinoInstrumentPage'
import ViolaInstrumentPage from './pages/instruments/ViolaInstrumentPage/ViolaInstrumentPage'
import ViolonceloInstrumentPage from './pages/instruments/ViolonceloInstrumentPage/ViolonceloInstrumentPage'
import ContrabaixoInstrumentPage from './pages/instruments/ContrabaixoInstrumentPage/ContrabaixoInstrumentPage'
import FlautaInstrumentPage from './pages/instruments/FlautaInstrumentPage/FlautaInstrumentPage'
import OboeInstrumentPage from './pages/instruments/OboeInstrumentPage/OboeInstrumentPage'
import ClarineteInstrumentPage from './pages/instruments/ClarineteInstrumentPage/ClarineteInstrumentPage'
import FagoteInstrumentPage from './pages/instruments/FagoteInstrumentPage/FagoteInstrumentPage'
import TrompeteInstrumentPage from './pages/instruments/TrompeteInstrumentPage/TrompeteInstrumentPage'
import TrompaInstrumentPage from './pages/instruments/TrompaInstrumentPage/TrompaInstrumentPage'
import TromboneInstrumentPage from './pages/instruments/TromboneInstrumentPage/TromboneInstrumentPage'
import TubaInstrumentPage from './pages/instruments/TubaInstrumentPage/TubaInstrumentPage'
import PercussaoInstrumentPage from './pages/instruments/PercussaoInstrumentPage/PercussaoInstrumentPage'
export default function App() {
  return <Routes><Route element={<AppShell />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/aprender" element={<LearnPage />} />
    <Route path="/aprender/:slug" element={<TheoryTopicPage />} />
    <Route path="/praticar" element={<PracticePage />} />
    <Route path="/praticar/:slug" element={<ExerciseTopicPage />} />
    <Route path="/instrumentos" element={<InstrumentsPage />} />
        <Route path="/instrumentos/piano" element={<PianoInstrumentPage />} />
        <Route path="/instrumentos/violino" element={<ViolinoInstrumentPage />} />
        <Route path="/instrumentos/viola" element={<ViolaInstrumentPage />} />
        <Route path="/instrumentos/violoncelo" element={<ViolonceloInstrumentPage />} />
        <Route path="/instrumentos/contrabaixo" element={<ContrabaixoInstrumentPage />} />
        <Route path="/instrumentos/flauta" element={<FlautaInstrumentPage />} />
        <Route path="/instrumentos/oboe" element={<OboeInstrumentPage />} />
        <Route path="/instrumentos/clarinete" element={<ClarineteInstrumentPage />} />
        <Route path="/instrumentos/fagote" element={<FagoteInstrumentPage />} />
        <Route path="/instrumentos/trompete" element={<TrompeteInstrumentPage />} />
        <Route path="/instrumentos/trompa" element={<TrompaInstrumentPage />} />
        <Route path="/instrumentos/trombone" element={<TromboneInstrumentPage />} />
        <Route path="/instrumentos/tuba" element={<TubaInstrumentPage />} />
        <Route path="/instrumentos/percussao" element={<PercussaoInstrumentPage />} />
    <Route path="/ferramentas" element={<ToolsPage />} />
    <Route path="/ferramentas/metronomo" element={<MetronomePage />} />
    <Route path="/ferramentas/afinador" element={<TunerPage />} />
    <Route path="/ferramentas/circulo-quintas" element={<CircleOfFifthsPage />} />
    <Route path="/dicionario" element={<DictionaryPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes>
}
