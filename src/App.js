import React, { useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  ReferenceDot
} from 'recharts';

const TempDeltaCard = ({ value, onChange }) => (
  <div className="bg-white shadow rounded-xl p-2 w-full max-w-[220px] mb-4">
    <div className="text-sm font-semibold text-center mb-2">ΔT (°C)</div>
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(Math.max(2, value - 1))}
        className="px-2 py-1 text-sm bg-gray-200 rounded"
      >
        -
      </button>
      <input
        type="number"
        min={2}
        max={15}
        value={value}
        onChange={e => {
          const newVal = parseInt(e.target.value, 10);
          onChange(Math.max(2, Math.min(15, isNaN(newVal) ? value : newVal)));
        }}
        className="border border-gray-300 rounded-md p-1 text-sm w-20 text-center"
      />
      <button
        onClick={() => onChange(Math.min(15, value + 1))}
        className="px-2 py-1 text-sm bg-gray-200 rounded"
      >
        +
      </button>
    </div>
  </div>
);

const LoopCard = ({ index, data, updateData, removeData }) => {
  const adjustValue = (field, delta) => {
    const newValue = Math.max(0, (parseInt(data[field], 10) || 0) + delta);
    updateData(index, { ...data, [field]: newValue });
  };
  const handleChange = (field, value) => updateData(index, { ...data, [field]: value });

  return (
    <div className="bg-white shadow rounded-xl p-2 w-full max-w-[220px] relative">
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-gray-300 text-center text-sm font-bold text-gray-700 leading-6">
        {index + 1}
      </div>
      <button
        onClick={() => removeData(index)}
        className="absolute top-2 right-2 w-6 h-6 rounded-full border border-gray-300 text-gray-700 font-bold flex items-center justify-center bg-transparent hover:bg-gray-100"
      >
        −
      </button>
      <div className="flex flex-col items-center gap-2 mb-1">
        <input
          type="text"
          placeholder="Название"
          value={data.name}
          onChange={e => handleChange('name', e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm w-36 text-center"
        />
        <div className="flex items-center gap-1">
          <button onClick={() => adjustValue('totalLength', -10)} className="px-2 py-1 text-sm bg-gray-200 rounded">-</button>
          <input
            type="number"
            placeholder="Общ. длина"
            value={data.totalLength}
            onChange={e => handleChange('totalLength', e.target.value)}
            className="border border-gray-300 rounded-md p-1 text-sm w-20 text-center"
          />
          <button onClick={() => adjustValue('totalLength', 10)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => adjustValue('supplyLength', -10)} className="px-2 py-1 text-sm bg-gray-200 rounded">-</button>
          <input
            type="number"
            placeholder="Подводящие"
            value={data.supplyLength}
            onChange={e => handleChange('supplyLength', e.target.value)}
            className="border border-gray-300 rounded-md p-1 text-sm w-20 text-center"
          />
          <button onClick={() => adjustValue('supplyLength', 10)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
        </div>
        <input
          type="number"
          placeholder="Диаметр (мм)"
          value={data.innerDiameter}
          onChange={e => handleChange('innerDiameter', e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm w-36 text-center"
        />
      </div>
    </div>
  );
};

const ResultCard = ({ index, name, power, flowRate, resistance }) => {
  const isOutOfRange = resistance < 7.5 || resistance > 20;
  const borderClass = isOutOfRange ? 'border-red-400 border-2' : 'border-transparent';

  return (
    <div className={`bg-gray-100 shadow-inner rounded-xl p-2 w-full max-w-[220px] ${borderClass}`}>
      <div className="text-sm text-gray-800 font-medium text-center mb-1">
        {name || `Петля ${index + 1}`}
      </div>
      <div className="text-xs text-gray-600 text-center">Мощность: <b>{power}</b> Вт</div>
      <div className="text-xs text-gray-600 text-center">Расход: <b>{flowRate.toFixed(2)}</b> л/мин</div>
      <div className="text-xs text-gray-600 text-center">Сопротивление: <b>{resistance.toFixed(2)}</b> кПа</div>
    </div>
  );
};

const FlowRateChartCard = ({ data }) => {
  const chartData = data.map((item, index) => ({
    name: item.name || `Петля ${index + 1}`,
    flow: item.flowRate
  }));

  return (
    <div className="p-4 w-full max-w-[440px] h-[260px]">
      <div className="text-sm font-semibold text-center mb-2">График расходов (л/мин)</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#999" strokeWidth={1.5} strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} stroke="#666" strokeWidth={2} />
          <YAxis stroke="#666" strokeWidth={2} />
          <Tooltip />
          <Bar dataKey="flow" fill="#999" radius={[6, 6, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const PumpCurveSmallCard = ({ curve, operatingPoint }) => (
  <div className="p-4 w-full max-w-[220px] mb-4 flex flex-col items-center h-[260px]">
    <div className="text-sm font-semibold text-center mb-2">кривая насоса 25-60</div>
    <div className="w-full flex justify-start -ml-12">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={curve.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis type="number" dataKey="flow" name="м³/ч" fontSize={10} stroke="#666" />
          <YAxis type="number" dataKey="head" name="м" fontSize={10} stroke="#666" />
          <Tooltip formatter={value => value.toFixed(2)} />
          <Line type="monotone" dataKey="head" stroke="#999" strokeWidth={3} dot={false} />
          <ReferenceDot x={operatingPoint.flow} y={operatingPoint.head} r={5} fill="red" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const LoopCardList = () => {
  const [cards, setCards] = useState([{ name: "", totalLength: 70, supplyLength: 15, innerDiameter: 12 }]);
  const [deltaT, setDeltaT] = useState(5);

  const addCard = () => setCards(prev => [...prev, { name: "", totalLength: 70, supplyLength: 15, innerDiameter: 12 }]);
  const updateCard = (index, data) => setCards(cards.map((c, i) => i === index ? data : c));
  const removeCard = index => setCards(cards.filter((_, i) => i !== index));

  const results = cards.map(c => {
    const totalLength = parseFloat(c.totalLength) || 0;
    const supplyLength = parseFloat(c.supplyLength) || 0;
    const diameter = parseFloat(c.innerDiameter) || 1;
    const usefulLength = Math.max(0, totalLength - supplyLength);

    const power = Math.round((usefulLength / 8) * 60);
    const flowRate = deltaT > 0 ? power / (1.16 * deltaT * 60) : 0;

    const rho = 1000;
    const g = 9.81;
    const nu = 1e-6;

    const d_m = diameter / 1000;
    const Q_m3s = flowRate / 1000 / 60;
    const A = Math.PI * Math.pow(d_m / 2, 2);
    if (d_m <= 0 || A === 0) return { power: 0, flowRate: 0, resistance: Infinity };
    const v = Q_m3s / A;
    const Re = v * d_m / nu;
    const lambda = Re < 2300 ? 64 / Re : 0.03;

    const hf_straight = lambda * totalLength / d_m * Math.pow(v, 2) / (2 * g);
    const hf_bends = lambda * (supplyLength * 0.2 + usefulLength * 0.4) / d_m * Math.pow(v, 2) / (2 * g);
    const hf = hf_straight + hf_bends;
    const resistance = rho * g * hf / 1000 + 7;

    return { power, flowRate, resistance };
  });

  const totalFlow = (results.reduce((sum, r) => sum + r.flowRate, 0) / 1000) * 60;
  const maxHead = results.length ? Math.max(...results.map(r => r.resistance)) / 9.81 : 0;

  const grundfosCurve = {
    name: 'Grundfos UPS 25-60',
    data: [
      { flow: 0, head: 6 },
      { flow: 1, head: 5.5 },
      { flow: 2, head: 5 },
      { flow: 3, head: 4 },
      { flow: 4, head: 2.5 },
      { flow: 5, head: 1 },
      { flow: 6, head: 0 }
    ]
  };

  return (
    <div className="px-6 sm:px-8 md:px-12">
      <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start gap-4 items-start mb-4">
        <PumpCurveSmallCard curve={grundfosCurve} operatingPoint={{ flow: totalFlow, head: maxHead }} />
        <FlowRateChartCard data={results} />
        <TempDeltaCard value={deltaT} onChange={setDeltaT} />
        <div className="bg-white shadow rounded-xl p-2 w-full max-w-[220px] mb-4">
          <div className="text-sm font-semibold text-center mb-2">Общие итоги</div>
          <div className="text-xs text-gray-700 text-center">
            Суммарный расход: <b>{totalFlow.toFixed(3)}</b> м³/ч
          </div>
          <div className="text-xs text-gray-700 text-center">
            Макс. сопротивление: <b>{maxHead.toFixed(2)}</b> м вод. ст.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
        {cards.map((card, index) => (
          <LoopCard
            key={index}
            index={index}
            data={card}
            updateData={updateCard}
            removeData={removeCard}
          />
        ))}
        <button
          onClick={addCard}
          className="bg-white shadow rounded-xl p-2 w-full max-w-[220px] h-[170px] flex items-center justify-center text-4xl text-green-600 hover:bg-green-50"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
        {results.map((res, index) => (
          <ResultCard
            key={index}
            index={index}
            name={cards[index].name}
            power={res.power}
            flowRate={res.flowRate}
            resistance={res.resistance}
          />
        ))}
      </div>
    </div>
  );
};

export default LoopCardList;
