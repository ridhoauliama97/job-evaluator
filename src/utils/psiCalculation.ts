import { JobAlternative, PSICalculation } from '@/types/psi';
import { CRITERIA_DATA } from '@/data/criteriaData';

const formatNumber = (num: number): number => {
  return parseFloat(num.toFixed(4));
};

export const calculatePSI = (alternatives: JobAlternative[]): PSICalculation => {
  const m = alternatives.length; // number of alternatives
  const n = CRITERIA_DATA.length; // number of criteria

  // Step 1: Build decision matrix
  const decisionMatrix: number[][] = alternatives.map((alt) =>
    CRITERIA_DATA.map((criteria) => alt.values[criteria.id] || 0)
  );

  // Step 2: Normalize the matrix
  const normalizedMatrix: number[][] = decisionMatrix.map((row, i) =>
    row.map((value, j) => {
      const criteria = CRITERIA_DATA[j];
      const columnValues = decisionMatrix.map((r) => r[j]);
      
      if (criteria.type === 'Benefit') {
        const max = Math.max(...columnValues);
        return max === 0 ? 0 : formatNumber(value / max);
      } else {
        // Cost criteria
        const min = Math.min(...columnValues.filter(v => v > 0));
        return value === 0 ? 0 : formatNumber(min / value);
      }
    })
  );

  // Step 3: Calculate average values for each criterion
  const averages: number[] = CRITERIA_DATA.map((_, j) => {
    const sum = normalizedMatrix.reduce((acc, row) => acc + row[j], 0);
    return formatNumber(sum / m);
  });

  // Step 4: Calculate preference variation for each criterion
  const preferenceVariations: number[] = CRITERIA_DATA.map((_, j) => {
    const avg = averages[j];
    const sumSquaredDiff = normalizedMatrix.reduce((acc, row) => {
      return acc + Math.pow(row[j] - avg, 2);
    }, 0);
    return formatNumber(sumSquaredDiff);
  });

  // Step 5: Calculate deviation in preference value
  const deviations: number[] = preferenceVariations.map((pv) => formatNumber(1 - pv));

  // Step 6: Calculate weights for each criterion
  const sumDeviations = deviations.reduce((acc, d) => acc + d, 0);
  const weights: number[] = deviations.map((d) => 
    formatNumber(sumDeviations === 0 ? 0 : d / sumDeviations)
  );

  // Step 7: Calculate PSI value for each alternative
  const psiValues: number[] = normalizedMatrix.map((row) => {
    const weightedSum = row.reduce((acc, value, j) => {
      return acc + (value * weights[j]);
    }, 0);
    return formatNumber(weightedSum);
  });

  return {
    normalizedMatrix,
    averages,
    preferenceVariations,
    weights,
    psiValues,
  };
};
