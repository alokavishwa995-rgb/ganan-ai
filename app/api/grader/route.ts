import { NextRequest, NextResponse } from 'next/server';

export interface PlotDataResponse {
  success: boolean;
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
  error?: string;
}

// Simple Equation Parser for Linear & Quadratic Equations
function parseEquation(input: string) {
  // Clean input: remove spaces and lowercase
  const clean = input.replace(/\s+/g, '').toLowerCase();

  // Strip "y=" or "f(x)="
  const expr = clean.replace(/^(y|f\(x\))=/, '');

  if (!expr) throw new Error('කරුණාකර නිවැරදි සමීකරණයක් ඇතුළත් කරන්න.');

  // Check Quadratic: ax^2 + bx + c
  const quadRegex = /^([+-]?\d*\.?\d*)?x\^?2([+-]\d*\.?\d*x)?([+-]\d*\.?\d*)?$/;
  // Check Linear: mx + c
  const linRegex = /^([+-]?\d*\.?\d*)?x([+-]\d*\.?\d*)?$/;

  let a = 0, b = 0, c = 0;
  let isQuadratic = false;

  if (expr.includes('x^2') || expr.includes('x2')) {
    isQuadratic = true;
    
    // Extract 'a'
    const aMatch = expr.match(/^([+-]?\d*\.?\d*)?x\^?2/);
    if (aMatch) {
      const aStr = aMatch[1];
      if (!aStr || aStr === '+') a = 1;
      else if (aStr === '-') a = -1;
      else a = parseFloat(aStr);
    }

    // Extract 'b'
    const bMatch = expr.match(/([+-]\d*\.?\d*)x(?!^2)/);
    if (bMatch) {
      const bStr = bMatch[1];
      if (bStr === '+') b = 1;
      else if (bStr === '-') b = -1;
      else b = parseFloat(bStr);
    }

    // Extract 'c'
    const cMatch = expr.match(/([+-]\d*\.?\d*)$/);
    if (cMatch && !cMatch[0].includes('x')) {
      c = parseFloat(cMatch[1]);
    }
  } else if (expr.includes('x')) {
    // Linear
    const mMatch = expr.match(/^([+-]?\d*\.?\d*)?x/);
    if (mMatch) {
      const mStr = mMatch[1];
      if (!mStr || mStr === '+') b = 1; // using 'b' as 'm'
      else if (mStr === '-') b = -1;
      else b = parseFloat(mStr);
    }

    const cMatch = expr.match(/([+-]\d*\.?\d*)$/);
    if (cMatch && !cMatch[0].includes('x')) {
      c = parseFloat(cMatch[1]);
    }
  } else {
    // Constant line y = c
    const constVal = parseFloat(expr);
    if (!isNaN(constVal)) {
      c = constVal;
    } else {
      throw new Error('සමීකරණයේ ආකෘතිය හඳුනාගත නොහැක.');
    }
  }

  return { a, b, c, isQuadratic };
}

export async function POST(req: NextRequest) {
  try {
    const { equation } = await req.json();

    if (!equation) {
      return NextResponse.json({ success: false, error: 'Equation is required' }, { status: 400 });
    }

    const { a, b, c, isQuadratic } = parseEquation(equation);

    // Compute function y = f(x)
    const evalY = (x: number) => {
      if (isQuadratic) return a * x * x + b * x + c;
      return b * x + c; // b acts as m for linear
    };

    // Smooth Graph Points (-10 to 10)
    const points: { x: number; y: number }[] = [];
    for (let x = -10; x <= 10; x += 0.2) {
      const roundX = Number(x.toFixed(2));
      const roundY = Number(evalY(roundX).toFixed(2));
      points.push({ x: roundX, y: roundY });
    }

    // O/L Table of Values (x = -4, -3, -2, -1, 0, 1, 2, 3, 4)
    const tableOfValues: { x: number; y: number }[] = [];
    for (let x = -4; x <= 4; x++) {
      tableOfValues.push({ x, y: Number(evalY(x).toFixed(2)) });
    }

    // Metadata
    const yIntercept = c;
    const metadata: PlotDataResponse['metadata'] = { yIntercept };

    if (isQuadratic) {
      const vx = Number((-b / (2 * (a || 1))).toFixed(2));
      const vy = Number(evalY(vx).toFixed(2));
      metadata.vertex = { x: vx, y: vy };
      metadata.isMinimum = a > 0;

      // Discriminant for x-intercepts
      const disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const root1 = Number(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2));
        const root2 = Number(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2));
        metadata.xIntercepts = Array.from(new Set([root1, root2]));
      }
    } else {
      metadata.gradient = b; // m
      if (b !== 0) {
        metadata.xIntercepts = [Number((-c / b).toFixed(2))];
      }
    }

    const normEq = isQuadratic
      ? `y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}x² ${b ? (b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`) : ''} ${c ? (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`) : ''}`
      : `y = ${b !== 1 ? (b === -1 ? '-' : b) : ''}x ${c ? (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`) : ''}`;

    return NextResponse.json({
      success: true,
      type: isQuadratic ? 'quadratic' : 'linear',
      normalizedEquation: normEq,
      points,
      tableOfValues,
      metadata,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'සමීකරණය පරීක්ෂා කිරීමට අපොහොසත් විය.' },
      { status: 400 }
    );
  }
}