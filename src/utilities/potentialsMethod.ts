import { newOptimalPlan } from "./optimalPlan";

type Potentials = {
	u: number[];
	v: number[];
};

type PositiveDelta = {
	delta: number;
	cell: [number, number];
};

export function calculatePotentials(
	costs: number[][],
	allocation: number[][]
): Potentials {
	const m = costs.length;
	const n = costs[0].length;
	const u: (number | null)[] = Array(m).fill(null);
	const v: (number | null)[] = Array(n).fill(null);
	const allocationCopy = [...allocation];
	u[0] = 0;
	let changed = true;
	while (changed) {
		changed = false;
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < n; j++) {
				if (allocationCopy[i][j] > 0) {
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

export function getPositiveDeltas(
	costs: number[][],
	allocation: number[][],
	{ u, v }: Potentials
): PositiveDelta[] {
	const allocationCopy = [...allocation];
	const list: PositiveDelta[] = [];
	for (let i = 0; i < costs.length; i++) {
		for (let j = 0; j < costs[0].length; j++) {
			if (allocationCopy[i][j] === 0) {
				const delta = u[i] + v[j] - costs[i][j];
				if (delta > 0) {
					list.push({ delta, cell: [i, j] });
				}
			}
		}
	}
	return list.sort((a, b) => b.delta - a.delta);
}

export function potentialsMethod(
	costs: number[][],
	allocation: number[][]
): {
	allocation: number[][];
	costs: number[][];
	potentials: Potentials;
	positive: PositiveDelta[];
} {
	const potentials = calculatePotentials(costs, allocation);
	const positive = getPositiveDeltas(costs, allocation, potentials);

	return { allocation, costs, potentials, positive };
}
