type Potentials = { u: number[]; v: number[] };

function calculatePotentials(
	costs: number[][],
	allocation: number[][]
): Potentials {
	const m = costs.length;
	const n = costs[0].length;
	const u = Array(m).fill(null);
	const v = Array(n).fill(null);
	u[0] = 0;

	let updated = true;
	while (updated) {
		updated = false;
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < n; j++) {
				if (allocation[i][j] > 0) {
					if (u[i] !== null && v[j] === null) {
						v[j] = costs[i][j] - u[i];
						updated = true;
					} else if (v[j] !== null && u[i] === null) {
						u[i] = costs[i][j] - v[j];
						updated = true;
					}
				}
			}
		}
	}

	return { u: u as number[], v: v as number[] };
}

function checkOptimality(
	costs: number[][],
	allocation: number[][],
	potentials: Potentials
) {
	const m = costs.length;
	const n = costs[0].length;

	let minDelta = 0;
	let minPos: [number, number] | null = null;

	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			if (allocation[i][j] === 0) {
				const delta = costs[i][j] - (potentials.u[i] + potentials.v[j]);
				if (delta < minDelta) {
					minDelta = delta;
					minPos = [i, j];
				}
			}
		}
	}

	return {
		isOptimal: minDelta >= 0,
		minDelta,
		minPos,
	};
}

function findCycle(
	start: [number, number],
	allocation: number[][],
	path: [number, number][] = [],
	visited: Set<string> = new Set(),
	isRow: boolean = true
): [number, number][] | null {
	const [row, col] = start;
	const m = allocation.length;
	const n = allocation[0].length;

	path.push(start);
	visited.add(`${row},${col}`);

	if (path.length >= 4 && row === path[0][0] && col === path[0][1]) {
		return path;
	}

	if (isRow) {
		for (let j = 0; j < n; j++) {
			if (
				(j !== col && allocation[row][j] > 0) ||
				(row === path[0][0] && j === path[0][1])
			) {
				if (
					!visited.has(`${row},${j}`) ||
					(row === path[0][0] && j === path[0][1])
				) {
					const cycle = findCycle(
						[row, j],
						allocation,
						[...path],
						new Set(visited),
						!isRow
					);
					if (cycle) return cycle;
				}
			}
		}
	} else {
		for (let i = 0; i < m; i++) {
			if (
				(i !== row && allocation[i][col] > 0) ||
				(i === path[0][0] && col === path[0][1])
			) {
				if (
					!visited.has(`${i},${col}`) ||
					(i === path[0][0] && col === path[0][1])
				) {
					const cycle = findCycle(
						[i, col],
						allocation,
						[...path],
						new Set(visited),
						!isRow
					);
					if (cycle) return cycle;
				}
			}
		}
	}

	return null;
}

function adjustAllocation(allocation: number[][], cycle: [number, number][]) {
	const minusCells = cycle.filter((_, idx) => idx % 2 === 1);
	const quantities = minusCells.map(([i, j]) => allocation[i][j]);
	const minQuantity = Math.min(...quantities);

	for (let idx = 0; idx < cycle.length; idx++) {
		const [i, j] = cycle[idx];
		if (idx % 2 === 0) {
			allocation[i][j] += minQuantity;
		} else {
			allocation[i][j] -= minQuantity;
		}
	}
}

export function potentialsMethod(
	costs: number[][],
	initialAllocation: number[][]
) {
	let allocation = initialAllocation.map((row) => [...row]);

	while (true) {
		const potentials = calculatePotentials(costs, allocation);
		const { isOptimal, minPos } = checkOptimality(
			costs,
			allocation,
			potentials
		);

		if (isOptimal || !minPos) {
			break; // Optimal solution found
		}

		const cycle = findCycle(minPos, allocation);
		if (!cycle) {
			throw new Error("Cannot find a valid cycle for reallocation.");
		}

		adjustAllocation(allocation, cycle);

		// Remove allocations with zero quantity (clean up)
		allocation = allocation.map((row) =>
			row.map((cell) => (cell <= 0 ? 0 : cell))
		);
	}

	return allocation;
}
