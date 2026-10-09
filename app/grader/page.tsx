'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PlotData {
  type: 'linear' | 'quadratic' | 'unknown';
  normalizedEquation: string;
  points: { x: number; y: number }[];
  tableOfValues: { x: number; y: number }[];
  metadata: {
    yIntercept?: number;
    xIntercepts?: number[];
    gradient?: number;
    vertex?: { x: number; y: number };
    isMinimum?: boolean;
  };
}

export default function AutoGraphPage() {
  const [equationInput, setEquationInput] = useState<string>('y = x^2 - 9');
  const [data, setData] = useState<PlotData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (equationInput.trim()) {
        fetchGraphData(equationInput);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [equationInput]);

  const fetchGraphData = async (eq: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/grader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equation: eq }),
      });

      const resData = await res.json();

      if (resData.success) {
        setData(resData);
      } else {
        setError(resData.error || 'අසංගත සමීකරණ ආකෘතියකි');
        setData(null);
      }
    } catch (err) {
      setError('සමීකරණය පරීක්ෂා කිරීමට අපොහොසත් විය.');
    } finally {
      setLoading(false);
    }
  };

  // Render Symmetric Light Blue Graph Sheet (-25 to +25)
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fixed Symmetric Range: -25 to +25
    const xBound = 25;
    const yBound = 25;

    const scaleX = width / (xBound * 2);
    const scaleY = height / (yBound * 2);

    const cx = width / 2;
    const cy = height / 2;

    // 1. Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 2. Minor Blue Grid Lines (Every 1 Unit)
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 0.8;
    for (let x = -xBound; x <= xBound; x += 1) {
      const px = cx + x * scaleX;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    for (let y = -yBound; y <= yBound; y += 1) {
      const py = cy - y * scaleY;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // 3. Major Blue Grid Lines (Every 5 Units)
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.3;
    for (let x = -xBound; x <= xBound; x += 5) {
      const px = cx + x * scaleX;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    for (let y = -yBound; y <= yBound; y += 5) {
      const py = cy - y * scaleY;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // 4. Main Axes (X & Y) - Bold Dark Blue
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 2.5;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Numbers on Axes (Labeled every 5 units)
    ctx.fillStyle = '#0c4a6e';
    ctx.font = 'bold 11px sans-serif';

    // X-Axis Labels (-20 to +20 by 5)
    for (let x = -20; x <= 20; x += 5) {
      if (x !== 0) {
        const px = cx + x * scaleX;
        ctx.fillText(x.toString(), px - 8, cy + 16);
      }
    }

    // Y-Axis Labels (-20 to +20 by 5)
    for (let y = -20; y <= 20; y += 5) {
      if (y !== 0) {
        const py = cy - y * scaleY;
        ctx.fillText(y.toString(), cx + 8, py + 4);
      }
    }
    ctx.fillText('0', cx - 12, cy + 14);

    // 5. Plot Curve
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3.5;
    ctx.beginPath();

    let first = true;
    data.points.forEach((pt) => {
      const px = cx + pt.x * scaleX;
      const py = cy - pt.y * scaleY;

      if (px >= -10 && px <= width + 10 && py >= -10 && py <= height + 10) {
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    });
    ctx.stroke();

    // 6. Highlight Vertex
    if (data.metadata.vertex) {
      const { x, y } = data.metadata.vertex;
      const vx = cx + x * scaleX;
      const vy = cy - y * scaleY;

      if (vx >= 0 && vx <= width && vy >= 0 && vy <= height) {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(vx, vy, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#991b1b';
        ctx.font = 'bold 12px sans-serif';
        const labelY = y < 0 ? vy - 10 : vy + 18;
        ctx.fillText(`Vertex (${x}, ${y})`, vx + 10, labelY);
      }
    }
  }, [data]);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '16px 10px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#38bdf8', margin: '0 0 6px 0' }}>
            ⚡ Auto Math Graph Plotter (O/L)
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            ඕනෑම සරල රේඛීය හෝ වර්ගජ සමීකරණයක් Type කළ සැනින් ඉබේම ප්‍රස්තාරය ඇඳේ!
          </p>
        </div>

        {/* Input Box Card */}
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: '#e2e8f0', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            සමීකරණය ඇතුළත් කරන්න (Enter Equation):
          </label>
          <input
            type="text"
            value={equationInput}
            onChange={(e) => setEquationInput(e.target.value)}
            placeholder="e.g. y = x^2 - 9"
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#0f172a',
              background: '#ffffff',
              borderRadius: '10px',
              border: '3px solid #3b82f6',
              boxSizing: 'border-box',
              outline: 'none',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
            }}
          />

          {/* Quick Preset Buttons */}
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>උදාහරණ:</span>
            {['y = 2x - 3', 'y = -x + 4', 'y = x^2 - 9', 'y = -x^2 + 2x + 3'].map((sample) => (
              <button
                key={sample}
                onClick={() => setEquationInput(sample)}
                style={{
                  padding: '6px 12px',
                  background: '#334155',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: '#450a0a', border: '1px solid #f87171', color: '#fca5a5', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        {data && (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
            
            {/* Features & Table Section */}
            <div style={{ flex: '1 1 320px', minWidth: '280px' }}>
              
              {/* Features Card */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '16px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#60a5fa', fontSize: '16px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                  📌 ප්‍රස්තාරයේ ලක්ෂණ (Key Features)
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <p style={{ margin: 0, color: '#f8fafc' }}>
                    <b style={{ color: '#94a3b8' }}>සමීකරණය:</b> <span style={{ color: '#facc15', fontWeight: 'bold' }}>{data.normalizedEquation}</span>
                  </p>
                  
                  {data.type === 'linear' ? (
                    <>
                      <p style={{ margin: 0, color: '#f8fafc' }}>
                        <b style={{ color: '#94a3b8' }}>අනුක්‍රමණය (m):</b> {data.metadata.gradient}
                      </p>
                      <p style={{ margin: 0, color: '#f8fafc' }}>
                        <b style={{ color: '#94a3b8' }}>y-අන්තර්ඡේදය:</b> (0, {data.metadata.yIntercept})
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ margin: 0, color: '#f8fafc' }}>
                        <b style={{ color: '#94a3b8' }}>හැඩය:</b> {data.metadata.isMinimum ? '∪ (අවම ලක්ෂ්‍යයක් ඇත)' : '∩ (උපරිම ලක්ෂ්‍යයක් ඇත)'}
                      </p>
                      <p style={{ margin: 0, color: '#f8fafc' }}>
                        <b style={{ color: '#94a3b8' }}>ශීර්ෂය (Vertex):</b> ({data.metadata.vertex?.x}, {data.metadata.vertex?.y})
                      </p>
                      <p style={{ margin: 0, color: '#f8fafc' }}>
                        <b style={{ color: '#94a3b8' }}>සමමිතික අක්ෂය:</b> x = {data.metadata.vertex?.x}
                      </p>
                    </>
                  )}
                  <p style={{ margin: 0, color: '#f8fafc' }}>
                    <b style={{ color: '#94a3b8' }}>x-අන්තර්ඡේද (Roots):</b> {data.metadata.xIntercepts?.join(', ') || 'නැත'}
                  </p>
                </div>
              </div>

              {/* Table of Values */}
              <h3 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '10px' }}>📊 අගයන් වගුව (Table of Values)</h3>
              <div style={{ overflowX: 'auto', background: '#1e293b', padding: '10px', borderRadius: '12px', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', color: '#f8fafc', minWidth: '300px' }}>
                  <thead>
                    <tr style={{ background: '#2563eb', color: '#ffffff' }}>
                      <th style={{ padding: '8px', border: '1px solid #475569', fontWeight: 'bold' }}>x</th>
                      {data.tableOfValues.map((item) => (
                        <td key={item.x} style={{ padding: '8px', border: '1px solid #475569', fontWeight: 'bold' }}>
                          {item.x}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#0f172a' }}>
                      <th style={{ padding: '8px', border: '1px solid #475569', background: '#1d4ed8', color: '#ffffff' }}>y</th>
                      {data.tableOfValues.map((item) => (
                        <td key={item.x} style={{ padding: '8px', border: '1px solid #475569', color: '#facc15', fontWeight: 'bold' }}>
                          {item.y}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Canvas Graph Sheet (-25 to +25) */}
            <div style={{ flex: '1 1 450px', textAlign: 'center', background: '#1e293b', padding: '16px', borderRadius: '16px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '16px' }}>📈 Symmetric Graph Sheet (-25 to +25)</h3>
              <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', aspectRatio: '1 / 1' }}>
                <canvas
                  ref={canvasRef}
                  width={550}
                  height={550}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                    border: '2px solid #38bdf8'
                  }}
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}