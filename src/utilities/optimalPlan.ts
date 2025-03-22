type PositiveDelta = {
	delta: number;
	cell: [number, number];
};

type CycleCell = {
	coords: [number, number];
	sign: "+" | "-";
};

function buildCycleMatrix(rows: number, cols: number): (string | null)[][] {
	const matrix: (string | null)[][] = [];
	for (let i = 0; i < rows; i++) {
		const row: (string | null)[] = [];
		for (let j = 0; j < cols; j++) {
			row.push(null);
		}
		matrix.push(row);
	}
	return matrix;
}

const DIRECTIONS = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

function isValidCell(allocation: number[][], r: number, c: number): boolean {
	return (
		r >= 0 &&
		r < allocation.length &&
		c >= 0 &&
		c < allocation[0].length &&
		allocation[r][c] > 0
	);
}

function dfsCycle(
	allocation: number[][],
	start: [number, number],
	path: [number, number][],
	visited: Set<string>
): [number, number][] | null {
	const [sr, sc] = start;
	const [r, c] = path[path.length - 1];

	if (path.length >= 4 && r === sr && c === sc) {
		return path;
	}

	for (const [dr, dc] of DIRECTIONS) {
		const nr = r + dr;
		const nc = c + dc;
		if (nr === sr && nc === sc && path.length >= 3) {
			return [...path, [nr, nc]];
		}
		if (isValidCell(allocation, nr, nc)) {
			const key = `${nr},${nc}`;
			if (!visited.has(key)) {
				visited.add(key);
				const newPath = dfsCycle(
					allocation,
					start,
					[...path, [nr, nc]],
					new Set(visited)
				);
				if (newPath) {
					if (
						newPath.length >= 2 &&
						newPath[0][0] === newPath[newPath.length - 1][0] &&
						newPath[0][1] === newPath[newPath.length - 1][1] &&
						newPath.length > 4
					) {
						return newPath.slice(0, -1);
					}
					return newPath;
				}
			}
		}
	}
	return null;
}

function buildCycle(
	allocation: number[][],
	start: [number, number]
): [number, number][] | null {
	const visited = new Set<string>([`${start[0]},${start[1]}`]);
	const path = [start];
	return dfsCycle(allocation, start, path, visited);
}

function markPlusMinus(cycle: [number, number][]): CycleCell[] {
	const result: CycleCell[] = [];
	for (let i = 0; i < cycle.length; i++) {
		const sign = i === 0 ? "+" : i % 2 === 1 ? "-" : "+";
		result.push({ coords: cycle[i], sign });
	}
	return result;
}

function applyReallocation(
	allocation: number[][],
	markedCells: CycleCell[]
): void {
	const plusCells: [number, number][] = [];
	const minusCells: [number, number][] = [];
	for (const mc of markedCells) {
		const [r, c] = mc.coords;
		if (mc.sign === "+") {
			plusCells.push([r, c]);
		} else {
			minusCells.push([r, c]);
		}
	}
	if (!minusCells.length) return;
	let t = Infinity;
	for (const [r, c] of minusCells) {
		const val = allocation[r][c];
		if (val > 0 && val < t) t = val;
	}
	if (!isFinite(t) || t <= 0) return;
	for (const [r, c] of plusCells) {
		allocation[r][c] += t;
	}
	for (const [r, c] of minusCells) {
		allocation[r][c] -= t;
		if (allocation[r][c] < 1e-8) allocation[r][c] = 0;
	}
}

function totalCost(allocation: number[][], costs: number[][]): number {
	let sum = 0;
	for (let i = 0; i < allocation.length; i++) {
		for (let j = 0; j < allocation[0].length; j++) {
			sum += allocation[i][j] * costs[i][j];
		}
	}
	return sum;
}

export function newOptimalPlan(
	allocation: number[][],
	costs: number[][],
	positives: { delta: number; cell: [number, number] }[]
): {
	newAllocation: number[][];
	signMatrix: (string | null)[][];
	totalCost: number;
} {
	if (!positives.length) {
		return {
			newAllocation: allocation,
			signMatrix: buildCycleMatrix(
				allocation.length,
				allocation[0].length
			),
			totalCost: totalCost(allocation, costs),
		};
	}
	const bestCell = positives[0].cell;
	const cycle = buildCycle(allocation, bestCell);
	if (!cycle || cycle.length <= 3) {
		return {
			newAllocation: allocation,
			signMatrix: buildCycleMatrix(
				allocation.length,
				allocation[0].length
			),
			totalCost: totalCost(allocation, costs),
		};
	}
	const markedCycle = markPlusMinus(cycle);
	applyReallocation(allocation, markedCycle);
	const signMatrix = buildCycleMatrix(
		allocation.length,
		allocation[0].length
	);
	for (const c of markedCycle) {
		const [row, col] = c.coords;
		signMatrix[row][col] = c.sign;
	}
	return {
		newAllocation: allocation,
		signMatrix,
		totalCost: totalCost(allocation, costs),
	};
}
