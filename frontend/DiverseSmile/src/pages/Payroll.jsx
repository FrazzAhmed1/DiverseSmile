import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/Payroll.css';

const API_BASE = 'http://localhost:5000';

export default function Payroll({ hourlyRate = 145, taxRate = 0.1 }) {
  const [periods, setPeriods]         = useState([]);
  const [yearSummary, setYearSummary] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    (async () => {
      // 1) fetch all logs
      const { data } = await axios.get(`${API_BASE}/api/login-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logs = Array.isArray(data) ? data : [];
      const yearStart = new Date(new Date().getFullYear(), 0, 1);

      // 2) compute year-to-date summary
      const totalSec = logs.reduce((sum, l) => {
        const [h,m,s] = l.duration.split(':').map(Number);
        return sum + h*3600 + m*60 + s;
      }, 0);
      const hoursYTD = totalSec / 3600;
      const grossYTD = hoursYTD * hourlyRate;
      const netYTD   = grossYTD * (1 - taxRate);
      setYearSummary({ hours: hoursYTD, gross: grossYTD, net: netYTD });

      // 3) group into 14-day pay periods
      const groups = {};
      logs.forEach(l => {
        const dt   = new Date(l.date);
        const days = Math.floor((dt - yearStart)/(1000*60*60*24));
        const idx  = Math.floor(days/14);
        groups[idx] = groups[idx] || [];
        groups[idx].push(l);
      });

      const arr = Object.entries(groups).map(([idx, gLogs]) => {
        const start = new Date(yearStart.getTime() + idx*14*24*3600_000);
        const end   = new Date(start.getTime()   + 13*24*3600_000);
        const secs  = gLogs.reduce((s, l2) => {
          const [h,m,s2] = l2.duration.split(':').map(Number);
          return s + h*3600 + m*60 + s2;
        }, 0);
        const hrs   = secs/3600;
        const grs   = hrs * hourlyRate;
        const nt    = grs * (1 - taxRate);
        return {
          idx: Number(idx),
          start, end,
          hours: hrs,
          gross: grs,
          net: nt
        };
      });
      arr.sort((a,b) => b.idx - a.idx);
      setPeriods(arr);
    })().catch(console.error);
  }, [token, hourlyRate, taxRate]);

  const selected = periods.find(p => p.idx === Number(selectedIdx));
  const periodChart = selected ? [
    { name: 'Net Pay', value: selected.net },
    { name: 'Taxes',   value: selected.gross - selected.net },
  ] : [];
  const yearChart = yearSummary ? [
    { name: 'Net Pay', value: yearSummary.net },
    { name: 'Taxes',   value: yearSummary.gross - yearSummary.net },
  ] : [];
  const COLORS = ['#28a745', '#dc3545'];

  return (
    <div className="payroll-container">
      <h2>Pay Statements</h2>
      <div className="payroll-flex">
        {/* ── Left: Pay Period ── */}
        <div className="pay-period">
          <select
            className="period-select"
            value={selectedIdx}
            onChange={e => setSelectedIdx(e.target.value)}
          >
            <option value="">— Select Pay Period —</option>
            {periods.map(p => (
              <option key={p.idx} value={p.idx}>
                {format(p.start,'MMM d, yyyy')} – {format(p.end,'MMM d, yyyy')}
              </option>
            ))}
          </select>

          {selected && (
            <>
              <p className="hours-worked">
                <strong>Hours Worked:</strong> {selected.hours.toFixed(2)} hrs
              </p>
              <p className="hourly-wage">
                <strong>Hourly Wage:</strong> ${hourlyRate.toFixed(2)}/hr
              </p>
              <div className="chart-container">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={periodChart}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      label
                    >
                      {periodChart.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={val => `$${val.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-summary">
                  <div>Take Home</div>
                  <div className="chart-amount">
                    ${selected.net.toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Right: Year-to-Date ── */}
        {yearSummary && (
          <div className="yearly-section">
            <h3>Year to Date ({new Date().getFullYear()})</h3>
            <p><strong>Total Hours:</strong> {yearSummary.hours.toFixed(2)} hrs</p>
            <p><strong>Total Gross:</strong> ${yearSummary.gross.toFixed(2)}</p>
            <p><strong>Total Net:</strong> ${yearSummary.net.toFixed(2)}</p>
            <div className="chart-container">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={yearChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label
                  >
                    {yearChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={val => `$${val.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-summary">
                <div>YTD Take Home</div>
                <div className="chart-amount">
                  ${yearSummary.net.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
