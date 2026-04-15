// import { useState, type ReactNode } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { ethers } from 'ethers';
// import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contract';

// import MainLayout from './components/Navbar';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import CreateEventPage from './pages/CreateEventPage';

// const withMainLayout = (element: ReactNode) => <MainLayout>{element}</MainLayout>;

// function TestConnection() {
//   const [status, setStatus] = useState('');
//   const [address, setAddress] = useState('');

//   const handleConnect = async () => {
//     if (!window.ethereum) {
//       setStatus('Chưa cài MetaMask!');
//       return;
//     }

//     try {
//       setStatus('Đang kết nối...');

//       await window.ethereum.request({ method: 'eth_requestAccounts' });

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       setAddress(userAddress);

//       const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

//       console.log('Contract Instance:', contract);

//       setStatus('KẾT NỐI THÀNH CÔNG');
//       alert(`Đã kết nối ví: ${userAddress}\nContract Address: ${CONTRACT_ADDRESS}`);
//     } catch (error) {
//       console.error(error);
//       setStatus(`Lỗi: ${(error as any)?.message || error}`);
//     }
//   };

//   return (
//     <div style={{ padding: '50px', textAlign: 'center' }}>
//       <h2>TEST KẾT NỐI BLOCKCHAIN</h2>
//       <p>
//         Contract Address: <b>{CONTRACT_ADDRESS}</b>
//       </p>

//       <button
//         onClick={handleConnect}
//         style={{
//           padding: '15px 30px',
//           fontSize: '18px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//         }}
//       >
//         {address ? 'Đã kết nối' : 'Kết nối Ví & Contract'}
//       </button>

//       <div style={{ marginTop: '20px', fontWeight: 'bold', color: 'blue' }}>{status}</div>

//       {address && <p>Ví của bạn: {address}</p>}
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={withMainLayout(<HomePage />)} />
//         <Route path="/login" element={withMainLayout(<LoginPage />)} />
//         <Route path="/register" element={withMainLayout(<RegisterPage />)} />
//         <Route path="/test" element={withMainLayout(<TestConnection />)} />
//         {/* CreateEventPage có sidebar riêng — không dùng MainLayout */}
//         <Route path="/create-event" element={<CreateEventPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import OrganizerEventDetailLayout from './layouts/OrganizerEventDetailLayout';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';

// User pages
import ProfilePage from './pages/User/ProfilePage';
import MyTickets from './pages/User/MyTickets';

// Organizer pages
import MyEventsPage from './pages/Organizer/MyEventsPage';
import CreateEventPage from './pages/Organizer/CreateEventPage';
import ReportsPage from './pages/Organizer/ReportsPage';
import TeamManagementPage from './pages/Organizer/TeamManagementPage';

// Organizer Event Detail pages
import EventSummaryPage from './pages/Organizer/OrganizerEventDetail/EventSummaryPage';
import EventCheckInPage from './pages/Organizer/OrganizerEventDetail/EventCheckInPage';
import EventMembersPage from './pages/Organizer/OrganizerEventDetail/EventMembersPage';
import EventEditPage from './pages/Organizer/OrganizerEventDetail/EventEditPage';
import EventVouchersPage from './pages/Organizer/OrganizerEventDetail/EventVouchersPage';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            {/* ═══ PUBLIC — MainLayout (Navbar + Footer) ═══ */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
            </Route>

            {/* ═══ USER — MainLayout + Auth Guard ═══ */}
            <Route element={<MainLayout />}>
              <Route path="/user/profile" element={<ProfilePage />} />
              <Route path="/user/my-tickets" element={<MyTickets />} />
            </Route>

            {/* ═══ ORGANIZER CẤP 1 — OrganizerLayout ═══ */}
            {/* OrganizerLayout = OrganizerSidebar + OrganizerHeader + <Outlet/> */}
            <Route path="/organizer" element={<OrganizerLayout />}>
              {/* /organizer → redirect tới /organizer/events */}
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<MyEventsPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="team" element={<TeamManagementPage />} />

              {/* ═══ ORGANIZER CẤP 2 — EventDetailLayout (nested) ═══ */}
              {/* EventDetailLayout = EventDetailSidebar (Back, Báo cáo, Cài đặt, Marketing) + <Outlet/> */}
              <Route path="events/:eventId" element={<OrganizerEventDetailLayout />}>
                {/* /organizer/events/:eventId → redirect tới summary */}
                <Route index element={<Navigate to="summary" replace />} />
                <Route path="summary" element={<EventSummaryPage />} />
                <Route path="checkin" element={<EventCheckInPage />} />
                <Route path="members" element={<EventMembersPage />} />
                <Route path="edit" element={<EventEditPage />} />
                <Route path="vouchers" element={<EventVouchersPage />} />
                <Route path="vouchers/create" element={<EventVouchersPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
