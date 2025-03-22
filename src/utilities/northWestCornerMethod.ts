/**
 * Функция, която намира начално решение на транспортната задача по
 * метода на Северозападния ъгъл.
 *
 * Логика на метода:
 * 1) Създава се таблица (tableData), в която ще се записват разпределените количества.
 * 2) Започваме от първия склад (i=0) и първия потребител (j=0).
 * 3) Разпределяме минималното от (supplyLeft[i], demandLeft[j]).
 * 4) Ако изчерпим този склад (supplyLeft[i] == 0), минаваме на следващия (i++).
 * 5) Ако изчерпим потребителя (demandLeft[j] == 0), минаваме на следващия (j++).
 * 6) Когато не остане supplyLeft или demandLeft, изчисляваме общата цена.
 */

export function northWestCorner(supply, demand, costs) {
	const tableData = Array.from({ length: supply.length }, () =>
		Array(demand.length).fill(0)
	);

	let i = 0,
		j = 0;
	const supplyLeft = [...supply];
	const demandLeft = [...demand];

	while (i < supply.length && j < demand.length) {
		// Намираме разпределеното количество според по-малката стойност от наличното и търсенето
		const quantity = Math.min(supplyLeft[i], demandLeft[j]);
		tableData[i][j] = quantity;

		// Намаляваме съответно наличността и търсенето
		supplyLeft[i] -= quantity;
		demandLeft[j] -= quantity;

		// Преминаваме на следващ склад, ако този е изчерпан, или на следващ потребител, ако е изчерпан
		if (supplyLeft[i] === 0) i++;
		else if (demandLeft[j] === 0) j++;
	}

	// Изчисляваме общата цена на база полученото разпределение
	const totalCost = tableData.reduce(
		(acc, row, i) =>
			acc + row.reduce((acc, cell, j) => acc + cell * costs[i][j], 0),
		0
	);

	return { tableData, totalCost };
}

export default northWestCorner;
