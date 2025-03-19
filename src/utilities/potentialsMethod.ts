type AllocationResult = {
	allocation: number[][];
	totalCost: number;
};

type Potentials = {
	u: number[];
	v: number[];
};

function calculatePotentials(
	costs: number[][],
	allocation: number[][]
): Potentials {
	const m = costs.length;
	const n = costs[0].length;
	const u: (number | null)[] = Array(m).fill(null);
	const v: (number | null)[] = Array(n).fill(null);
	u[0] = 0;
	let changed = true;
	while (changed) {
		changed = false;
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < n; j++) {
				if (allocation[i][j] > 0) {
					if (u[i] !== null && v[j] === null) {
						v[j] = costs[i][j] - u[i]!;
						changed = true;
					} else if (u[i] === null && v[j] !== null) {
						u[i] = costs[i][j] - v[j]!;
						changed = true;
					}
				}
			}
		}
	}
	return { u: u as number[], v: v as number[] };
}

function getPositiveDeltas(
	costs: number[][],
	allocation: number[][],
	{ u, v }: Potentials
) {
	const list: { delta: number; cell: [number, number] }[] = [];
	for (let i = 0; i < costs.length; i++) {
		for (let j = 0; j < costs[0].length; j++) {
			if (allocation[i][j] === 0) {
				const delta = u[i] + v[j] - costs[i][j];
				if (delta > 0) {
					list.push({ delta, cell: [i, j] });
				}
			}
		}
	}
	return list.sort((a, b) => b.delta - a.delta);
}

function findAllCycles(
	allocation: number[][],
	start: [number, number]
): [number, number][][] {
	const m = allocation.length,
		n = allocation[0].length;
	const results: [number, number][][] = [];

	function dfs(path: [number, number][], rowDir: boolean): void {
		const [r, c] = path[path.length - 1];
		if (path.length >= 4 && r === start[0] && c === start[1]) {
			results.push([...path]);
			return;
		}
		if (rowDir) {
			for (let col = 0; col < n; col++) {
				if (
					col !== c &&
					(allocation[r][col] > 0 ||
						(r === start[0] && col === start[1]))
				) {
					if (
						!path
							.slice(0, -1)
							.some(([rr, cc]) => rr === r && cc === col)
					) {
						dfs([...path, [r, col]], !rowDir);
					}
				}
			}
		} else {
			for (let row = 0; row < m; row++) {
				if (
					row !== r &&
					(allocation[row][c] > 0 ||
						(row === start[0] && c === start[1]))
				) {
					if (
						!path
							.slice(0, -1)
							.some(([rr, cc]) => rr === row && cc === c)
					) {
						dfs([...path, [row, c]], !rowDir);
					}
				}
			}
		}
	}

	dfs([start], true);
	return results;
}

function reallocate(allocation: number[][], cycle: [number, number][]) {
	const minus = cycle.filter((_, idx) => idx % 2 === 1);
	const minVal = Math.min(...minus.map(([r, c]) => allocation[r][c]));
	for (let i = 0; i < cycle.length; i++) {
		const [r, c] = cycle[i];
		if (i % 2 === 0) allocation[r][c] += minVal;
		else allocation[r][c] -= minVal;
	}
	for (let i = 0; i < allocation.length; i++) {
		for (let j = 0; j < allocation[0].length; j++) {
			if (allocation[i][j] < 0.000001) allocation[i][j] = 0;
		}
	}
}

export function potentialsMethod(
	costs: number[][],
	initialAlloc: number[][]
): {
	allocation: number[][];
	totalCost: number;
	potentials: Potentials;
	positive: { delta: number; cell: [number, number] }[];
} {
	const m = costs.length,
		n = costs[0].length;
	let allocation = initialAlloc.map((r) => [...r]);
	const MAX_ITER = 100;
	let iteration = 0;

	while (iteration < MAX_ITER) {
		iteration++;
		const potentials = calculatePotentials(costs, allocation);
		const positive = getPositiveDeltas(costs, allocation, potentials);

		if (positive.length === 0) break;

		let improved = false;
		for (const { delta, cell } of positive) {
			const [sr, sc] = cell;
			const cycles = findAllCycles(allocation, [sr, sc]);
			if (!cycles.length) continue;

			let bestCycle: [number, number][] | null = null;
			let bestGain = -Infinity;
			let oldCost = 0;
			for (let i = 0; i < m; i++) {
				for (let j = 0; j < n; j++) {
					oldCost += allocation[i][j] * costs[i][j];
				}
			}

			for (const cyc of cycles) {
				const testAlloc = allocation.map((row) => [...row]);
				const minus = cyc.filter((_, idx) => idx % 2 === 1);
				const minQty = Math.min(
					...minus.map(([r, c]) => testAlloc[r][c])
				);
				for (let k = 0; k < cyc.length; k++) {
					const [rr, cc] = cyc[k];
					if (k % 2 === 0) testAlloc[rr][cc] += minQty;
					else testAlloc[rr][cc] -= minQty;
				}
				let newCost = 0;
				for (let i = 0; i < m; i++) {
					for (let j = 0; j < n; j++) {
						if (testAlloc[i][j] < 0.00001) testAlloc[i][j] = 0;
						newCost += testAlloc[i][j] * costs[i][j];
					}
				}
				const gain = oldCost - newCost;
				if (gain > bestGain) {
					bestGain = gain;
					bestCycle = cyc;
				}
			}

			if (bestCycle && bestGain > 0.00001) {
				reallocate(allocation, bestCycle);
				improved = true;
				break;
			}
		}

		if (!improved) break;
	}

	let totalCost = 0;
	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			totalCost += allocation[i][j] * costs[i][j];
		}
	}

	return {
		allocation,
		totalCost,
		potentials: calculatePotentials(costs, allocation),
		positive: getPositiveDeltas(
			costs,
			allocation,
			calculatePotentials(costs, allocation)
		),
	};
}
