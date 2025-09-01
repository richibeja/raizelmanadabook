"use client";
import React from 'react';

export default function Header() {
  return (
    <nav>
      <ul>
        <li><a href='/catalogo'>Catálogo</a></li>
        <li><a href='/calculadora'>Calculadora</a></li>
        <li><a href='/test-producto'>Test</a></li>
        <li><a href='/consejos'>Consejos</a></li>
        <li><a href='/hacer-pedido'>Pedidos</a></li>
        <li><a href='/manadabook'>ManadaBook</a></li>
      </ul>
    </nav>
  );
}
