// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// // // // import React from 'react';
// // // // import ProductoList from './pages/ProductoList';

// // // // function App() {
// // // //   return (
// // // //     <div className="App">
// // // //       <ProductoList />
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;

// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductoList from './pages/ProductoList';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/producto" element={<ProductoList />} />
      </Routes>
    </Router>
  );
}

export default App;