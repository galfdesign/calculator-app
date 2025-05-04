import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const TempDeltaCard = ({ value, onChange }) => (
  <div className="bg-white shadow rounded-xl p-2 w-full max-w-[220px] mb-4">
    <div className="text-sm font-semibold text-center mb-2">ΔT (°C)</div>
    <div className="flex items-center justify-center gap-1">
      <button onClick={() => onChange(Math.max(2, value - 1))} className="px-2 py-1 text-sm bg-gray-200 rounded">-</button>
      <input
        type="number"
        min="2"
        max="15"
        value={value}
        onChange={(e) => onChange(Math.max(2, Math.min(15, parseInt(e.target.value) || 2)))}
        className="border border-gray-300 rounded-md p-1 text-sm w-20 text-center"
      />
      <button onClick={() => onChange(Math.min(15, value + 1))} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
    </div>
  </div>
);

const LoopCard = ({ index, data, updateData, removeData }) => {
  const adjustValue = (field, amount) => {
    updateData(index, {
      ...data,
      [field]: Math.max(0, parseInt(data[field] || 0) + amount),
    });
  };

  const handleChange = (field, value) => {
    updateData(index, { ...data, [field]: value });
  };

  return (
    <div className="bg-white shadow rounded-xl p-2 w-full max-w-[220px] relative">
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-gray-300 text-center text-sm font-bold text-gray-700 leading-6">
        {index + 1}
      </div>
      <button
        onClick={() => removeData(index)}
        className="absolute top-2 right-2 w-6 h-6 rounded-full border border-gray-300 text-gray-700 font-bold text-center flex items-center justify-center bg-transparent hover:bg-gray-100"
      >
        −
      </button>
      <div className="flex flex-col items-center gap-2 mb-1">
        <input
          type="text"
          placeholder="Название"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm w-36 text-center"
        />
        <div className="flex items-center gap-1">
          <button onClick={() => adjustValue("totalLength", -10)} className="px-2 py-1 text-sm bg-gray-200 rounded">-</button>
          <input
            type="number"
            placeholder="Общ. длина"
            value={data.totalLength}
            onChange={(e) => handleChange("totalLength", e.target.value)}
            className="border border-gray-300 rounded-md p-1 text-sm w-20 text-center"
          />
          <button onClick={() => adjustValue("totalLength", 10)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => adjustValue("supplyLength", -10)} className="px-2 py-1 text-sm bg-gray-200 rounded">-</button>
          <input
            type="number"
            placeholder="Подводящие"
            value={data.supplyLength}
            onChange={(e) => handleChange("supplyLength", e.target.value)}
            className="border border-gray-300 rounded-md p-1 text-sm w-20 text-center"
          />
          <button onClick={() => adjustValue("supplyLength", 10)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
        </div>
        <input
          type="number"
          placeholder="Диаметр (мм)"
          value={data.innerDiameter}
          onChange={(e) => handleChange("innerDiameter", e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm w-36 text-center"
        />
      </div>
    </div>
  );
};

const ResultCard = ({ index, name, power, flowRate, resistance }) => {
  const isOutOfRange = resistance < 7.5 || resistance > 20;
  const borderClass = isOutOfRange ? "border-red-400 border-2" : "border-transparent";

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
    flow: parseFloat(item.flowRate.toFixed(2))
  }));

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full max-w-full mt-6">
      <div className="text-sm font-semibold text-center mb-2">График расходов (л/мин)</div>
      <ResponsiveContainer width="100%" height={250}>
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

const LoopCardList = () => {
  const [cards, setCards] = useState([{ name: "", totalLength: 70, supplyLength: 15, innerDiameter: 12 }]);
  const [deltaT, setDeltaT] = useState(5);

  const addCard = () => {
    setCards([...cards, { name: "", totalLength: 70, supplyLength: 15, innerDiameter: 12 }]);
  };

  const updateCard = (index, updatedData) => {
    const newCards = [...cards];
    newCards[index] = updatedData;
    setCards(newCards);
  };

  const removeCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const results = cards.map((c) => {
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
    const v = Q_m3s / A;
    const Re = v * d_m / nu;
    const lambda = Re < 2300 ? 64 / Re : 0.03;

    const hf_straight = lambda * totalLength / d_m * Math.pow(v, 2) / (2 * g);
    const hf_bends = lambda * (supplyLength * 0.2 + usefulLength * 0.4) / d_m * Math.pow(v, 2) / (2 * g);
    const hf = hf_straight + hf_bends;
    const resistance = rho * g * hf / 1000 + 7;

    return { power, flowRate, resistance };
  });

  return (
    <div className="px-6 sm:px-8 md:px-12">
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-start mb-4">
        <TempDeltaCard value={deltaT} onChange={setDeltaT} />
        <div className="bg-white shadow rounded-xl p-2 w-full max-w-[220px]">
          <div className="text-sm font-semibold text-center mb-2">Общие итоги</div>
          <div className="text-xs text-gray-700 text-center">
            Суммарный расход: <b>{(results.reduce((sum, r) => sum + r.flowRate, 0) / 1000 * 60).toFixed(3)}</b> м³/ч
          </div>
          <div className="text-xs text-gray-700 text-center">
            Макс. сопротивление: <b>{(Math.max(...results.map(r => r.resistance)) / 9.81).toFixed(2)}</b> м вод. ст.
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

      <FlowRateChartCard data={results} />
    </div>
  );
};

export default LoopCardList;
