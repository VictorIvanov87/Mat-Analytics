import React, { useState } from "react";
import { Table, Box, Button, Text, Flex } from "@chakra-ui/react";
import { iterativeOptimization } from "../../utilities/optimalPlan";

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
			justifyContent="space-between"
			flexDirection={isVertical ? "column" : "row"}
		>
			<Box color="blue.500">{leftContent}</Box>
			<Box>{rightContent}</Box>
		</Flex>
	</Box>
);

const OptimalPlan = ({
	solution,
	suppliers,
	consumers,
	supplyQuantities,
	demandQuantities,
	costs,
}) => {
	const [totalCost, setTotalCost] = useState(0);
	const [newAllocation, setNewAllocation] = useState<number[][] | null>(null);
	const [finalPotentials, setFinalPotentials] = useState<{
		u: number[];
		v: number[];
	} | null>(null);
	const [finalPositives, setFinalPositives] = useState<
		{ delta: number; cell: [number, number] }[] | null
	>(null);

	const findNewOptimalPlam = () => {
		const {
			finalAllocation,
			finalCost,
			finalPositives,
			finalPotentials,
			iterations,
		} = iterativeOptimization(solution, costs);
		setNewAllocation(finalAllocation);
		setTotalCost(finalCost);
		setFinalPotentials(finalPotentials);
		setFinalPositives(finalPositives);
	};

	return (
		<Box overflowX="auto" my={5}>
			<Button
				color="white"
				bg="blue.500"
				my={4}
				onClick={findNewOptimalPlam}
			>
				Намери оптимален план
			</Button>
			{newAllocation && finalPotentials && (
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
										rightContent={`v=${finalPotentials.v[idx]}`}
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
						{newAllocation.map((row, i) => (
							<Table.Row key={i} bg="transparent">
								<Table.Cell fontWeight="bold" w={20}>
									<TableCellContent
										leftContent={suppliers[i]}
										rightContent={`u=${finalPotentials.u[i]}`}
										isVertical={true}
									/>
								</Table.Cell>
								{row.map((cell, j) => {
									const positiveDelta = finalPositives?.find(
										(p) =>
											p.cell[0] === i && p.cell[1] === j
									);
									return (
										<Table.Cell
											key={j}
											fontWeight="bold"
											bg={
												positiveDelta
													? "red.300"
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

			<Text mt={4} textAlign="right">
				Общите транспортни разходи са: {totalCost}
			</Text>
		</Box>
	);
};

export default OptimalPlan;
