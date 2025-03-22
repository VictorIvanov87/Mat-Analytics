/**
 * Функция, която намира начално решение на транспортната задача
 * по метода на минималния елемент (Minimal Cost Method).
 *
 * Подход:
 * 1) Създава се таблица tableData, в която ще записваме разпределените количества.
 * 2) Докато има остатъчни наличности и търсения:
 *    - Търсим клетката (i,j) с най-малък разход (costs[i][j]), за която
 *      складът (supplyCopy[i]) и потребителят (demandCopy[j]) все още
 *      имат ненулеви количества.
 *    - Определяме количеството, което ще разпределим (минимума от supplyCopy[i] и demandCopy[j]).
 *    - Добавяме това количество в tableData и актуализираме totalCost.
 *    - Намаляваме съответно наличността на supplyCopy[i] и търсенето на demandCopy[j].
 * 3) Връщаме запълнената таблица и общата цена за това разпределение.
 */

const minimalCost = (supply: number[], demand: number[], costs: number[][]) => {
	const m = supply.length;
	const n = demand.length;
	const tableData = Array.from({ length: m }, () => Array(n).fill(0));
	let totalCost = 0;

	const supplyCopy = [...supply];
	const demandCopy = [...demand];

	// Повтаряме, докато има складове с наличност и потребители с търсене
	while (supplyCopy.some((s) => s > 0) && demandCopy.some((d) => d > 0)) {
		let minCost = Infinity;
		let minI = -1;
		let minJ = -1;

		// Намираме клетката с най-нисък разход сред все още активните складове и потребители
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < n; j++) {
				if (
					costs[i][j] < minCost &&
					supplyCopy[i] > 0 &&
					demandCopy[j] > 0
				) {
					minCost = costs[i][j];
					minI = i;
					minJ = j;
				}
			}
		}

		// Разпределяме възможното количество
		const quantity = Math.min(supplyCopy[minI], demandCopy[minJ]);
		tableData[minI][minJ] = quantity;

		// Сумираме разхода
		totalCost += quantity * costs[minI][minJ];

		// Намаляваме съответно наличността и търсенето
		supplyCopy[minI] -= quantity;
		demandCopy[minJ] -= quantity;
	}

	return { tableData, totalCost };
};

export default minimalCost;
