import React, { useState } from "react";
import { Table, Box, Button, Text, Flex } from "@chakra-ui/react";
import northWestCorner from "../../utilities/northWestCornerMethod";

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

const NorthWestCornerMethod = ({
	solution,
	suppliers,
	consumers,
	supplyQuantities,
	demandQuantities,
	costs,
	setSolution,
}) => {
	const [totalCost, setTotalCost] = useState(0);
	const calculateInitialSolution = () => {
		const numericSupply = supplyQuantities.map(Number);
		const numericDemand = demandQuantities.map(Number);
		const { tableData, totalCost } = northWestCorner(
			numericSupply,
			numericDemand,
			costs
		);
		setSolution(tableData);
		setTotalCost(totalCost);
	};

	return (
		<Box overflowX="auto" my={5}>
			<Button
				color="white"
				bg="blue.500"
				my={4}
				onClick={calculateInitialSolution}
			>
				Изчисли с метод на северозападния ъгъл
			</Button>
			<Table.Root showColumnBorder>
				<Table.Header>
					<Table.Row bg="transparent">
						<Table.Cell fontWeight="bold">От / До</Table.Cell>
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
					{suppliers.map((supplier, i) => (
						<Table.Row key={i} bg="transparent">
							<Table.Cell
								fontWeight="bold"
								w={20}
								textAlign="center"
							>
								{supplier}
							</Table.Cell>
							{consumers.map((_, j) => (
								<Table.Cell key={j} fontWeight="bold">
									{solution &&
									solution[i] &&
									solution[i][j] ? (
										<TableCellContent
											leftContent={solution[i][j]}
											rightContent={`(${costs[i][j]})`}
										/>
									) : (
										"-"
									)}
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
			{solution && (
				<Text mt={4} textAlign="right">
					Общите транспортни разходи са: {totalCost}
				</Text>
			)}
		</Box>
	);
};

export default NorthWestCornerMethod;
