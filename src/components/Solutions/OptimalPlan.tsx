import React, { useState } from "react";
import { Table, Box, Button, Text, Flex } from "@chakra-ui/react";
import {
	iterativeOptimization,
	newOptimalPlan,
} from "../../utilities/optimalPlan";

const TableCellContent = ({
	leftContent,
	rightContent,
}: {
	leftContent: React.ReactNode;
	rightContent: React.ReactNode;
}) => (
	<Box as="div">
		<Flex justifyContent="space-between">
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
	positives,
}) => {
	const [totalCost, setTotalCost] = useState(0);
	const [newAllocation, setNewAllocation] = useState<number[][] | null>(null);
	const [matrix, setMatrix] = useState<string[][] | null>(null);

	const findNewOptimalPlam = () => {
		const { finalAllocation, finalCost } = iterativeOptimization(
			solution,
			costs
		);
		setNewAllocation(finalAllocation);
		// setMatrix(signMatrix);
		setTotalCost(finalCost);
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
			{newAllocation && (
				<>
					<Table.Root showColumnBorder>
						<Table.Header>
							<Table.Row bg="transparent">
								<Table.Cell fontWeight="bold">
									От / До
								</Table.Cell>
								{consumers.map((c, idx) => (
									<Table.Cell
										fontWeight="bold"
										key={idx}
										textAlign="center"
									>
										{c}
									</Table.Cell>
								))}
								<Table.Cell fontWeight="bold">Общо</Table.Cell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{solution.map((row, i) => (
								<Table.Row key={i} bg="transparent">
									<Table.Cell
										fontWeight="bold"
										w={20}
										textAlign="center"
									>
										{suppliers[i]}
									</Table.Cell>
									{row.map((cell, j) => (
										<Table.Cell key={j} fontWeight="bold">
											<TableCellContent
												leftContent={cell || "-"}
												rightContent={
													matrix &&
													matrix[i] &&
													matrix[i][j]
														? `t${matrix[i][j]} (${costs[i][j]})`
														: `(${costs[i][j]})`
												}
											/>
										</Table.Cell>
									))}
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
					<Text mt={4} textAlign="right">
						Общите транспортни разходи са: {totalCost}
					</Text>
				</>
			)}
		</Box>
	);
};

export default OptimalPlan;
