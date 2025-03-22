/**
 * Тук се намира логиката за подобрение на начално решение
 * чрез метода на потенциалите (изграждане на цикъл и преразпределяне).
 *
 * Файла включва:
 * 1) Построяване на затворен цикъл (buildCycle)
 * 2) Маркиране на клетките в цикъла със знаци (+ / -)
 * 3) Преразпределяне на товари според намерения цикъл (applyReallocation)
 * 4) Итеративна оптимизация (iterativeOptimization), докато има ∆ > 0
 */

import { calculatePotentials, getPositiveDeltas } from "./potentialsMethod";

type PositiveDelta = {
	delta: number;
	cell: [number, number];
};

type CycleCell = {
	coords: [number, number];
	sign: "+" | "-";
};

/**
 * Посоките, в които можем да се движим: нагоре надолу, наляво надясно.
 */
const DIRECTIONS = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

/**
 * Проверка дали дадена клетка (r, c) е валидна и съдържа товар > 0,
 * така че да може да се включи в цикъла (освен ако не е стартовата).
 */
function isValidCell(allocation: number[][], r: number, c: number): boolean {
	return (
		r >= 0 &&
		r < allocation.length &&
		c >= 0 &&
		c < allocation[0].length &&
		allocation[r][c] > 0
	);
}

/**
 * DFS търсене за цикъл. Започваме от start (sr, sc) и се опитваме да
 * се върнем там, като обхождаме само пълни клетки. Ако стигнем start
 * при поне 3 стъпки, оформяме цикъл.
 */
function dfsCycle(
	allocation: number[][],
	start: [number, number],
	path: [number, number][],
	visited: Set<string>
): [number, number][] | null {
	const [sr, sc] = start;
	const [r, c] = path[path.length - 1];

	// Ако сме направили ≥4 хода и сме се върнали на start, цикълът е намерен
	if (path.length >= 4 && r === sr && c === sc) {
		return path;
	}

	for (const [dr, dc] of DIRECTIONS) {
		const nr = r + dr;
		const nc = c + dc;

		// Ако можем да се върнем към start след 3 стъпки, оформяме цикъл
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
					// Ако крайният цикъл е по-дълъг от нужното (повтаря старт),
					// може да отрежем последния елемент, за да избегнем дублиране.
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

/**
 * buildCycle: опитва да намери затворен цикъл, тръгвайки от клетката start.
 */
function buildCycle(
	allocation: number[][],
	start: [number, number]
): [number, number][] | null {
	const visited = new Set<string>([`${start[0]},${start[1]}`]);
	const path = [start];
	return dfsCycle(allocation, start, path, visited);
}

/**
 * markPlusMinus: маркира клетките от намерения цикъл, редувайки
 * + и - , като първата клетка (i=0) е винаги с +.
 */
function markPlusMinus(cycle: [number, number][]): CycleCell[] {
	const result: CycleCell[] = [];
	for (let i = 0; i < cycle.length; i++) {
		const sign = i === 0 ? "+" : i % 2 === 1 ? "-" : "+";
		result.push({ coords: cycle[i], sign });
	}
	return result;
}

/**
 * applyReallocation: намира минималното количество (t) сред клетките
 * със знак '-' и преразпределя това t:
 * - добавя t на всички '+' клетки
 * - изважда t от всички '-' клетки
 */
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
		if (val > 0 && val < t) {
			t = val;
		}
	}

	if (!isFinite(t) || t <= 0) return;

	for (const [r, c] of plusCells) {
		allocation[r][c] += t;
	}
	for (const [r, c] of minusCells) {
		allocation[r][c] -= t;
		if (allocation[r][c] < 1e-8) {
			allocation[r][c] = 0;
		}
	}
}

/**
 * costOfPlan: изчислява общите разходи на базата на текущото
 * разпределение (allocation) и матрицата на разходите (costs).
 */
function costOfPlan(allocation: number[][], costs: number[][]): number {
	let sum = 0;
	for (let i = 0; i < allocation.length; i++) {
		for (let j = 0; j < allocation[0].length; j++) {
			sum += allocation[i][j] * costs[i][j];
		}
	}
	return sum;
}

/**
 * newOptimalPlan:
 * 1) Обхождаме подадените клетки с положителни ∆ (positives).
 * 2) За всяка клетка опитваме да намерим затворен цикъл. Ако намерим
 *    подходящ цикъл (повече от 3 клетки), разпределяме количествата по него.
 * 3) Връщаме новото allocation и новата цена.
 */
export function newOptimalPlan(
	allocation: number[][],
	costs: number[][],
	positives: { delta: number; cell: [number, number] }[]
): {
	newAllocation: number[][];
	totalCost: number;
} {
	for (const positive of positives) {
		const cycle = buildCycle(allocation, positive.cell);
		if (cycle && cycle.length > 3) {
			const markedCycle = markPlusMinus(cycle);
			applyReallocation(allocation, markedCycle);
			return {
				newAllocation: allocation,
				totalCost: costOfPlan(allocation, costs),
			};
		}
	}
	return {
		newAllocation: allocation,
		totalCost: costOfPlan(allocation, costs),
	};
}

/**
 * iterativeOptimization:
 * Обхождаме повтарящо се:
 * 1) Изчисляваме потенциалите и ∆.
 * 2) Ако няма положителни ∆, спираме.
 * 3) Ако има, извикваме newOptimalPlan, за да направим цикъл и преразпределение.
 * 4) Повтаряме, докато вече не се подобрява решението (нямаме повече положителни ∆).
 */
export function iterativeOptimization(
	allocation: number[][],
	costs: number[][]
): {
	finalAllocation: number[][];
	finalCost: number;
	finalPotentials: { u: number[]; v: number[] };
	finalPositives: PositiveDelta[];
} {
	let improved = true;
	let iterations = 0;
	while (improved) {
		const oldCost = costOfPlan(allocation, costs);
		const { u, v } = calculatePotentials(costs, allocation);
		const positives = getPositiveDeltas(costs, allocation, { u, v });

		if (!positives.length) {
			break;
		}

		improved = false;
		const { newAllocation, totalCost } = newOptimalPlan(
			allocation,
			costs,
			positives
		);

		if (totalCost < oldCost) {
			allocation = newAllocation;
			improved = true;
			iterations++;
		}
	}

	const finalCost = costOfPlan(allocation, costs);
	const finalPotentials = calculatePotentials(costs, allocation);
	const finalPositives = getPositiveDeltas(
		costs,
		allocation,
		finalPotentials
	);

	return {
		finalAllocation: allocation,
		finalCost,
		finalPotentials,
		finalPositives,
	};
}
