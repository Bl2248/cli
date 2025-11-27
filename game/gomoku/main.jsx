import React from 'react';
import { createRoot } from 'react-dom/client';
import Gomoku from './Gomoku.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Gomoku />);