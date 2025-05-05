// src/PdfReport.js
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export function generateHeatingPdf(deltaT, results, totalFlow, maxHead) {
  const date = new Date().toLocaleString('ru-RU');
  const now = new Date().toISOString().slice(0, 10);

  const tableBody = [
    [
      { text: '№', bold: true },
      { text: 'Мощность (Вт)', bold: true },
      { text: 'Расход (л/мин)', bold: true },
      { text: 'Сопротивление (кПа)', bold: true },
      { text: 'Режим', bold: true }
    ],
    ...results.map((res, i) => [
      `${i + 1}`,
      `${res.power}`,
      `${res.flowRate.toFixed(2)}`,
      `${res.resistance.toFixed(2)}`,
      res.regime
    ])
  ];

  const docDefinition = {
    content: [
      { text: 'Отчёт по расчёту отопления', style: 'header' },
      { text: `Дата: ${date}`, style: 'small' },
      '\n',
      { text: `Температурный перепад ΔT: ${deltaT} °C`, style: 'text' },
      { text: `Суммарный расход: ${totalFlow.toFixed(3)} м³/ч`, style: 'text' },
      { text: `Макс. сопротивление: ${maxHead.toFixed(2)} м вод. ст.`, style: 'text' },
      '\n',
      { text: 'Петли отопления', style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*', '*'],
          body: tableBody
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5, 0, 15]
      }
    ],
    styles: {
      header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      text: { fontSize: 12 },
      small: { fontSize: 10, color: 'gray' }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  pdfMake.createPdf(docDefinition).download(`otchet_otoplenie_${now}.pdf`);
}
