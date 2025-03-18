const minimalCost = (supply: number[], demand: number[], costs: number[][]) => {
	const m = supply.length;
	const n = demand.length;
	const tableData = Array.from({ length: m }, () => Array(n).fill(0));
	let totalCost = 0;

	const supplyCopy = [...supply];
	const demandCopy = [...demand];

	while (supplyCopy.some((s) => s > 0) && demandCopy.some((d) => d > 0)) {
		let minCost = Infinity;
		let minI = -1;
		let minJ = -1;

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

		const quantity = Math.min(supplyCopy[minI], demandCopy[minJ]);
		tableData[minI][minJ] = quantity;
		totalCost += quantity * costs[minI][minJ];

		supplyCopy[minI] -= quantity;
		demandCopy[minJ] -= quantity;
	}

	return { tableData, totalCost };
};

export default minimalCost;
