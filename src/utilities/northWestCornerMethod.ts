export function northWestCorner(supply, demand, costs) {
	const tableData = Array.from({ length: supply.length }, () =>
		Array(demand.length).fill(0)
	);

	let i = 0,
		j = 0;
	const supplyLeft = [...supply];
	const demandLeft = [...demand];

	while (i < supply.length && j < demand.length) {
		const quantity = Math.min(supplyLeft[i], demandLeft[j]);
		tableData[i][j] = quantity;

		supplyLeft[i] -= quantity;
		demandLeft[j] -= quantity;

		if (supplyLeft[i] === 0) i++;
		else if (demandLeft[j] === 0) j++;
	}

	const totalCost = tableData.reduce(
		(acc, row, i) =>
			acc + row.reduce((acc, cell, j) => acc + cell * costs[i][j], 0),
		0
	);

	return { tableData, totalCost };
}

export default northWestCorner;
