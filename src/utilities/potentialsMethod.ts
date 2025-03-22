/**
 * Типове данни:
 * Potentials - пазим потенциалите за всеки ред (u) и всяка колона (v).
 * PositiveDelta - пазим стойността на ∆ (delta) и координата на клетката.
 */

type Potentials = {
	u: number[];
	v: number[];
};

type PositiveDelta = {
	delta: number;
	cell: [number, number];
};

/**
 * Функция calculatePotentials:
 * 1) Получава матрицата на разходите (costs) и текущото разпределение (allocation).
 * 2) Инициализираме масивите u, v с null, задаваме u[0] = 0 (начален потенциал).
 * 3) Обхождаме заетите клетки в allocation.
 *    - Ако знаем u[i], но не знаем v[j], намираме v[j] = costs[i][j] - u[i].
 *    - Ако знаем v[j], но не знаем u[i], намираме u[i] = costs[i][j] - v[j].
 * 4) Повтаряме, докато не намерим всички възможни потенциали.
 * 5) Връщаме намерените u, v.
 */

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

/**
 * Функция getPositiveDeltas:
 * 1) Изчислява индексните оценки (delta) за всяка празна клетка (там, където allocation[i][j] == 0).
 * 2) ∆ = u[i] + v[j] - costs[i][j].
 * 3) Ако ∆ > 0, добавяме я в списък. Сортираме списъка по най-висока делта.
 * 4) Връщаме списък от тип PositiveDelta, където пазим стойността и координатата на клетката.
 */

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

/**
 * Функция potentialsMethod:
 * 1) Пресмята потенциалите (calculatePotentials).
 * 2) Намира положителните делти (getPositiveDeltas).
 * 3) Връща текущото allocation, costs, potentials и списъка с positive delta.
 */

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
