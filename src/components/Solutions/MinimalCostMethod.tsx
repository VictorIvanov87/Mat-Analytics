import React, { useState } from "react";
import { Table, Box, Button, Text } from "@chakra-ui/react";
import minimalCost from "../../utilities/minimalCostMethod";

const MinimalCostMethod = ({
	solution,
	suppliers,
	consumers,
	supplyQuantities,
	demandQuantities,
	costs,
	setSolution,
}) => {
	const [totalCost, setTotalCost] = useState(0);
	const calculateMinimalCostSolution = () => {
		const numericSupply = supplyQuantities.map(Number);
		const numericDemand = demandQuantities.map(Number);
		const { tableData, totalCost } = minimalCost(
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
				onClick={calculateMinimalCostSolution}
			>
				Изчисли с метод на минималните разходи
			</Button>
			{solution && (
				<>
					<Table.Root showColumnBorder>
						<Table.Header>
							<Table.Row bg="transparent">
								<Table.Cell fontWeight="bold">
									От / До
								</Table.Cell>
								{consumers.map((c, idx) => (
									<Table.Cell fontWeight="bold" key={idx}>
										{c}
									</Table.Cell>
								))}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{solution.map((row, i) => (
								<Table.Row key={i} bg="transparent">
									<Table.Cell fontWeight="bold" w={20}>
										{suppliers[i]}
									</Table.Cell>
									{row.map((cell, j) => (
										<Table.Cell key={j}>
											{cell || "-"}
										</Table.Cell>
									))}
								</Table.Row>
							))}
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

export default MinimalCostMethod;
