import { PSIResult } from '@/types/psi';
import { CRITERIA_DATA } from '@/data/criteriaData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = async (result: PSIResult) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('PSI Decision Support System Report', 14, 20);
  
  // User Details
  doc.setFontSize(12);
  doc.text('User Information', 14, 35);
  doc.setFontSize(10);
  doc.text(`Name: ${result.userDetails.name}`, 14, 42);
  doc.text(`Age: ${result.userDetails.age}`, 14, 48);
  doc.text(`Education: ${result.userDetails.education}`, 14, 54);
  doc.text(`Location: ${result.userDetails.location}`, 14, 60);
  
  // Rankings Table
  doc.setFontSize(12);
  doc.text('Job Rankings', 14, 75);
  
  const rankingsData = result.rankedAlternatives.map((item) => [
    `#${item.rank}`,
    item.alternative.name,
    item.psiValue.toFixed(4),
  ]);
  
  autoTable(doc, {
    startY: 80,
    head: [['Rank', 'Job Alternative', 'PSI Value']],
    body: rankingsData,
  });
  
  // Weights Table
  const weightsY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Criteria Weights', 14, weightsY);
  
  const weightsData = CRITERIA_DATA.map((criteria, i) => [
    criteria.id,
    criteria.name,
    result.weights[i].toFixed(4),
  ]);
  
  autoTable(doc, {
    startY: weightsY + 5,
    head: [['ID', 'Criteria', 'Weight']],
    body: weightsData,
  });
  
  // Save
  doc.save(`PSI_Report_${Date.now()}.pdf`);
};

export const exportToExcel = async (result: PSIResult) => {
  const workbook = XLSX.utils.book_new();
  
  // User Details Sheet
  const userDetailsData = [
    ['User Information'],
    ['Name', result.userDetails.name],
    ['Age', result.userDetails.age],
    ['Education', result.userDetails.education],
    ['Location', result.userDetails.location],
  ];
  const userSheet = XLSX.utils.aoa_to_sheet(userDetailsData);
  XLSX.utils.book_append_sheet(workbook, userSheet, 'User Details');
  
  // Rankings Sheet
  const rankingsData = [
    ['Rank', 'Job Alternative', 'PSI Value'],
    ...result.rankedAlternatives.map((item) => [
      item.rank,
      item.alternative.name,
      item.psiValue,
    ]),
  ];
  const rankingsSheet = XLSX.utils.aoa_to_sheet(rankingsData);
  XLSX.utils.book_append_sheet(workbook, rankingsSheet, 'Rankings');
  
  // Weights Sheet
  const weightsData = [
    ['Criteria ID', 'Criteria Name', 'Weight'],
    ...CRITERIA_DATA.map((criteria, i) => [
      criteria.id,
      criteria.name,
      result.weights[i],
    ]),
  ];
  const weightsSheet = XLSX.utils.aoa_to_sheet(weightsData);
  XLSX.utils.book_append_sheet(workbook, weightsSheet, 'Weights');
  
  // Normalized Matrix Sheet
  const normalizedData = [
    ['Alternative', ...CRITERIA_DATA.map((c) => c.id)],
    ...result.normalizedMatrix.map((row, i) => [
      result.alternatives[i].name,
      ...row,
    ]),
  ];
  const normalizedSheet = XLSX.utils.aoa_to_sheet(normalizedData);
  XLSX.utils.book_append_sheet(workbook, normalizedSheet, 'Normalized Matrix');
  
  // Save
  XLSX.writeFile(workbook, `PSI_Report_${Date.now()}.xlsx`);
};

export const exportToCSV = async (result: PSIResult) => {
  let csv = 'PSI Decision Support System Report\n\n';
  
  csv += 'User Information\n';
  csv += `Name,${result.userDetails.name}\n`;
  csv += `Age,${result.userDetails.age}\n`;
  csv += `Education,${result.userDetails.education}\n`;
  csv += `Location,${result.userDetails.location}\n\n`;
  
  csv += 'Job Rankings\n';
  csv += 'Rank,Job Alternative,PSI Value\n';
  result.rankedAlternatives.forEach((item) => {
    csv += `${item.rank},${item.alternative.name},${item.psiValue}\n`;
  });
  
  csv += '\nCriteria Weights\n';
  csv += 'Criteria ID,Criteria Name,Weight\n';
  CRITERIA_DATA.forEach((criteria, i) => {
    csv += `${criteria.id},${criteria.name},${result.weights[i]}\n`;
  });
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PSI_Report_${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
