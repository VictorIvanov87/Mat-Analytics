import { Alert, Box, Flex } from "@chakra-ui/react";
import React from "react";

const BalanceIndicator = ({ supplyQuantities, demandQuantities }) => {
	const totalSupply = supplyQuantities.reduce((a, b) => a + Number(b), 0);
	const totalDemand = demandQuantities.reduce((a, b) => a + Number(b), 0);

	const balance = totalSupply - totalDemand;

	return (
		<Box my={4}>
			{balance === 0 ? (
				<Alert.Root status="success">
					<Flex justify="center">Задачата е от затворен тип.</Flex>
				</Alert.Root>
			) : (
				<Alert.Root status="error">
					<Flex direction="column">
						Задачата НЕ е от затворен тип.
						<Box>Общо доставки: {totalSupply}</Box>
						<Box>Общо търсене: {totalDemand}</Box>
						<Box>
							Разлика:{" "}
							{balance > 0
								? `Доставките са с ${balance} повече от търсенето.`
								: `Търсенето е с ${-balance} повече от доставките.`}
						</Box>
					</Flex>
				</Alert.Root>
			)}
		</Box>
	);
};

export default BalanceIndicator;
