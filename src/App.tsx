import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Search from './pages/patient/Search';
import Listing from './pages/patient/Listing';
import Book from './pages/patient/Book';
import Confirmation from './pages/patient/Confirmation';
import AccessPoints from './pages/patient/AccessPoints';
import ConnectPortal from './pages/patient/ConnectPortal';
import Dashboard from './pages/provider/Dashboard';
import NewRequirement from './pages/provider/NewRequirement';
import RequirementPage from './pages/provider/Requirement';
import Kiosk from './pages/Kiosk';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/patient/listing/:id" element={<Listing />} />
        <Route path="/patient/book/:id" element={<Book />} />
        <Route path="/patient/confirmation/:apptId" element={<Confirmation />} />
        <Route path="/patient/connect" element={<ConnectPortal />} />
        <Route path="/provider" element={<Dashboard />} />
        <Route path="/provider/requirements/new" element={<NewRequirement />} />
        <Route path="/provider/requirements/:id" element={<RequirementPage />} />
        <Route path="/kiosk" element={<Kiosk />} />
      </Route>
      {/* Map-heavy pages opt into full width (list + map split view). */}
      <Route element={<Layout fullWidth />}>
        <Route path="/patient" element={<Search />} />
        <Route path="/patient/telehealth" element={<AccessPoints />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
