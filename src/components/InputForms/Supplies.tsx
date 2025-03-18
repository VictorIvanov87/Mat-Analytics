import React from "react";
import { Input, Stack } from "@chakra-ui/react";

const Supplies = ({ supplyQuantities, onSupplyChange }) => {
	return (
		<Stack direction="row" spaceX={3} p={3}>
			{supplyQuantities.map((qty, index) => (
				<Input
					key={index}
					bg="white"
					w="auto"
					onChange={(e) =>
						onSupplyChange(index, Number(e.target.value))
					}
					value={qty}
				/>
			))}
		</Stack>
	);
};

export default Supplies;
