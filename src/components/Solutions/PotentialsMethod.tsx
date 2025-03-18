import React from "react";
import { Box, Button, Table } from "@chakra-ui/react";
import { potentialsMethod } from "../../utilities/potentialsMethod";

interface Props {
	costs: number[][];
	initialSolution: number[][];
	suppliers: string[];
	consumers: string[];
}

const PotentialsMethod = ({
	costs,
	initialSolution,
	suppliers,
	consumers,
}: Props) => {
	const [solution, setSolution] = React.useState<number[][] | null>(null);

	const handleOptimize = () => {
		const optimalSolution = potentialsMethod(costs, initialSolution);
		setSolution(optimalSolution);
	};

	return (
		<Box overflowX="auto" my={5}>
			<Button color="white" bg="blue.500" my={4} onClick={handleOptimize}>
				Оптимизирай с метод на потенциалите
			</Button>
			{solution && (
				<Table.Root showColumnBorder>
					<Table.Header>
						<Table.Row bg="transparent">
							<Table.Cell fontWeight="bold">От / До</Table.Cell>
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
			)}
		</Box>
	);
};

export default PotentialsMethod;
