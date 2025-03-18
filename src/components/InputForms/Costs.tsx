import React from "react";
import { Table, Input } from "@chakra-ui/react";

function Costs({
	suppliers,
	consumers,
	costs,
	setCosts,
}: {
	suppliers: string[];
	consumers: string[];
	costs: number[][];
	setCosts: (costs: number[][]) => void;
}) {
	const handleCostChange = (
		rowIndex: number,
		colIndex: number,
		value: string
	) => {
		const newCosts = [...costs];
		newCosts[rowIndex][colIndex] = Number(value);
		setCosts(newCosts);
	};

	return (
		<Table.Root showColumnBorder>
			<Table.Header>
				<Table.Row bg="transparent">
					<Table.Cell fontWeight="bold" />
					{consumers.map((consumer, idx) => (
						<Table.Cell fontWeight="bold" key={idx}>
							{consumer}
						</Table.Cell>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{costs.map((row, rowIndex) => (
					<Table.Row key={rowIndex} bg="transparent">
						<Table.Cell fontWeight="bold">
							{suppliers[rowIndex]}
						</Table.Cell>
						{row.map((cost, colIndex) => (
							<Table.Cell key={colIndex}>
								<Input
									value={cost}
									onChange={(e) =>
										handleCostChange(
											rowIndex,
											colIndex,
											e.target.value
										)
									}
								/>
							</Table.Cell>
						))}
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
}

export default Costs;
