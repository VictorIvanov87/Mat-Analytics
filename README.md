# Математически моделиране - транспортна задача

Този проект представлява приложение за решаване на транспортна задача, като комбинира различни методи за намиране и оптимизиране на първоначалното решение (северозападен ъгъл, минимален елемент, метод на потенциалите и итеративна оптимизация).

## Как да тестваме решението?

Има два начина за стартиране на приложението:

### Локално стартиране

Клонирайте репозиторито, инсталирайте зависимостите и стартирайте проекта локално:
1. `git clone https://github.com/VictorIvanov87/Math-Analytics.git`
2. отваряме свалента папка
3. в нея инсталираме dependency-тата с `npm install`
3. стартираме проекта с `npm run dev` и можем да го достъпим на `http://localhost:5173/`

### Онлайн версия

Можете да тествате решението и онлайн на следния линк:
[https://transportation-problem-301iz.netlify.app/](https://transportation-problem-301iz.netlify.app/)

## Как изглежда и се използва приложението?

Приложението е разделено в няколко секции:

### 1.Товар
Тук можем да въведем пунктовете и консуматорите, както и техните стойности. Има ограничение от максимум 10 пункта и 10 консуматора. По подразбиране имената на пунктовете са A, B, C..., а тези на консуматорите 1, 2, 3..., но могат да бъдат променени при нужда. След въвеждане на стойностите се проврява дали задачата е от затворен тип.

![Screenshot 2025-03-23 at 0 14 09](https://github.com/user-attachments/assets/8f874fab-64d4-4f2b-a681-32d276ed69bb)

### 2. Транспортни разходи
На база вече въведените пунктове и консуматори можем да попълним таблицата с транспортните разходи за тях.

![Screenshot 2025-03-23 at 0 15 41](https://github.com/user-attachments/assets/d1a318fb-931e-44b8-9712-f8b4e4dffe85)

### 3. Изчисления по метода на северозападния ъгъл
В тази секция изчисляваме базистното решение по метода на северозападния ъгъл. След като имаме това решение, можем да намерим потенциалите и оптималния план.

![Screenshot 2025-03-23 at 0 17 23](https://github.com/user-attachments/assets/9ab627f8-0cbf-4c78-ab39-f8d65de7f5b2)

### 4. Изчисления по метода на минималния елемент
В тази секция изчисляваме базистното решение по метода на минималния елемент. След като имаме това решение, можем да намерим потенциалите и оптималния план.

![Screenshot 2025-03-23 at 0 18 04](https://github.com/user-attachments/assets/be911c3a-13d4-4b19-8c10-45c3e2958129)


## Изчисления:

Всички изчисления са поместени в `src/utilities`, като всеки метод е поместен в отделен файл:

[northWestCornerMethod.ts](src/utilities/northWestCornerMethod.ts)
```
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
```

[minimalCostMethod.ts](src/utilities/minimalCostMethod.ts)
```
/**
 * Функция, която намира начално решение на транспортната задача
 * по метода на минималния елемент (Minimal Cost Method).
 *
 * Подход:
 * 1) Създава се таблица tableData, в която ще записваме разпределените количества.
 * 2) Докато има остатъчни наличности и търсения:
 *    - Търсим клетката (i,j) с най-малък разход (costs[i][j]), за която
 *      складът (supplyCopy[i]) и потребителят (demandCopy[j]) все още
 *      имат ненулеви количества.
 *    - Определяме количеството, което ще разпределим (минимума от supplyCopy[i] и demandCopy[j]).
 *    - Добавяме това количество в tableData и актуализираме totalCost.
 *    - Намаляваме съответно наличността на supplyCopy[i] и търсенето на demandCopy[j].
 * 3) Връщаме запълнената таблица и общата цена за това разпределение.
 */

const minimalCost = (supply: number[], demand: number[], costs: number[][]) => {
	const m = supply.length;
	const n = demand.length;
	const tableData = Array.from({ length: m }, () => Array(n).fill(0));
	let totalCost = 0;

	const supplyCopy = [...supply];
	const demandCopy = [...demand];

	// Повтаряме, докато има складове с наличност и потребители с търсене
	while (supplyCopy.some((s) => s > 0) && demandCopy.some((d) => d > 0)) {
		let minCost = Infinity;
		let minI = -1;
		let minJ = -1;

		// Намираме клетката с най-нисък разход сред все още активните складове и потребители
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

		// Разпределяме възможното количество
		const quantity = Math.min(supplyCopy[minI], demandCopy[minJ]);
		tableData[minI][minJ] = quantity;

		// Сумираме разхода
		totalCost += quantity * costs[minI][minJ];

		// Намаляваме съответно наличността и търсенето
		supplyCopy[minI] -= quantity;
		demandCopy[minJ] -= quantity;
	}

	return { tableData, totalCost };
};

export default minimalCost;
```

[potentialsMethod.ts](src/utilities/potentialsMethod.ts)
```
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
```

[optimalPlan.ts](src/utilities/optimalPlan.ts)
```
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
```
