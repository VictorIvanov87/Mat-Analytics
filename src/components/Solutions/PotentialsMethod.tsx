import React from "react";
import { Box, Button, Table, Flex } from "@chakra-ui/react";
import { potentialsMethod } from "../../utilities/potentialsMethod";

interface Props {
	costs: number[][];
	initialSolution: number[][];
	initialSolutionType: "northWest" | "minimalCost";
	suppliers: string[];
	consumers: string[];
	supplyQuantities: number[];
	demandQuantities: number[];
}

const TableCellContent = ({
	leftContent,
	rightContent,
	isVertical = false,
}: {
	leftContent: React.ReactNode;
	rightContent: React.ReactNode;
	isVertical?: boolean;
}) => (
	<Box as="div">
		<Flex
			justifyContent={isVertical ? "center" : "space-between"}
			flexDirection={isVertical ? "column" : "row"}
			alignItems={isVertical ? "center" : "stretch"}
		>
			<Box color={!isVertical && leftContent !== "-" ? "blue.500" : ""}>
				{leftContent}
			</Box>
			<Box>{rightContent}</Box>
		</Flex>
	</Box>
);

const PotentialsMethod = ({
	costs,
	initialSolution,
	initialSolutionType,
	suppliers,
	consumers,
	supplyQuantities,
	demandQuantities,
}: Props) => {
	const [solution, setSolution] = React.useState<number[][] | null>(null);
	const [potentials, setPotentials] = React.useState<{
		u: number[];
		v: number[];
	} | null>(null);
	const [positiveDeltas, setPositiveDeltas] = React.useState<
		{ delta: number; cell: [number, number] }[] | null
	>(null);

	const initialSolutionTypeMap = {
		northWest: "северозападен ъгъл",
		minimalCost: "минимални разходи",
	};

	const handleOptimize = () => {
		const optimalSolution = potentialsMethod(costs, initialSolution);
		setSolution(optimalSolution.allocation);
		setPotentials(optimalSolution.potentials);
		setPositiveDeltas(optimalSolution.positive);
	};

	return (
		<Box overflowX="auto" my={5}>
			<Button
				color="white"
				bg="blue.500"
				my={4}
				onClick={handleOptimize}
				disabled={!initialSolution}
			>
				Изчисли потенциалите за{" "}
				{initialSolutionTypeMap[initialSolutionType]}
			</Button>
			{solution && potentials && (
				<Table.Root showColumnBorder>
					<Table.Header>
						<Table.Row bg="transparent">
							<Table.Cell fontWeight="bold">
								<TableCellContent
									leftContent="От / До"
									rightContent=""
									isVertical={true}
								/>
							</Table.Cell>
							{consumers.map((c, idx) => (
								<Table.Cell fontWeight="bold" key={idx}>
									<TableCellContent
										leftContent={c}
										rightContent={`v=${potentials.v[idx]}`}
										isVertical={true}
									/>
								</Table.Cell>
							))}
							<Table.Cell fontWeight="bold">
								<TableCellContent
									leftContent="Общо"
									rightContent=""
									isVertical={true}
								/>
							</Table.Cell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{solution.map((row, i) => (
							<Table.Row key={i} bg="transparent">
								<Table.Cell fontWeight="bold" w={20}>
									<TableCellContent
										leftContent={suppliers[i]}
										rightContent={`u=${potentials.u[i]}`}
										isVertical={true}
									/>
								</Table.Cell>
								{row.map((cell, j) => {
									const positiveDelta = positiveDeltas?.find(
										(p) =>
											p.cell[0] === i && p.cell[1] === j
									);
									return (
										<Table.Cell
											key={j}
											fontWeight="bold"
											bg={
												positiveDelta
													? "red.100"
													: "transparent"
											}
										>
											<TableCellContent
												leftContent={cell || "-"}
												rightContent={
													positiveDelta
														? `△=${positiveDelta.delta} (${costs[i][j]})`
														: `(${costs[i][j]})`
												}
											/>
										</Table.Cell>
									);
								})}
								<Table.Cell fontWeight="bold">
									{supplyQuantities[i]}
								</Table.Cell>
							</Table.Row>
						))}
						<Table.Row bg="transparent">
							<Table.Cell fontWeight="bold">Общо</Table.Cell>
							{demandQuantities.map((d, idx) => (
								<Table.Cell fontWeight="bold" key={idx}>
									{d}
								</Table.Cell>
							))}
							<Table.Cell></Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			)}
		</Box>
	);
};

export default PotentialsMethod;
