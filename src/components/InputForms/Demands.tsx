import React from "react";
import { Input, Stack } from "@chakra-ui/react";

const Demands = ({ demandQuantities, onDemandChange }) => {
	return (
		<Stack direction="row" spaceX={3} p={3}>
			{demandQuantities.map((qty, index) => (
				<Input
					key={index}
					bg="white"
					w="auto"
					onChange={(e) =>
						onDemandChange(index, Number(e.target.value))
					}
					value={qty}
				/>
			))}
		</Stack>
	);
};

export default Demands;
