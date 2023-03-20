import React from 'react';
import {
  useRoutes
} from 'react-router-dom';

import Home from './screens/Home';

export default function App() {
  let element = useRoutes([
    {path: '/', element: <Home />},
  ]);

  return element;
}

