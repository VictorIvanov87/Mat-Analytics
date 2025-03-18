export function northWestCorner(supply, demand) {
	const result = Array.from({ length: supply.length }, () =>
		Array(demand.length).fill(0)
	);

	let i = 0,
		j = 0;
	const supplyLeft = [...supply];
	const demandLeft = [...demand];

	while (i < supply.length && j < demand.length) {
		const quantity = Math.min(supplyLeft[i], demandLeft[j]);
		result[i][j] = quantity;

		supplyLeft[i] -= quantity;
		demandLeft[j] -= quantity;

		if (supplyLeft[i] === 0) i++;
		else if (demandLeft[j] === 0) j++;
	}

	return result;
}

export default northWestCorner;
