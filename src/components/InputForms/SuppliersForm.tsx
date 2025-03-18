import React from "react";
import { Box, Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";

const SuppliersForm = ({
	suppliers,
	onAddSupplier,
	onRemoveSupplier,
	onSupplierChange,
}) => {
	return (
		<Flex direction="column">
			<Flex justify="space-between" align="center" p={3}>
				<Heading>Пунктове:</Heading>
				<Box>
					<Button
						onClick={onAddSupplier}
						color="white"
						bg="blue.500"
						disabled={suppliers.length === 10}
						mx={2}
					>
						+
					</Button>
					<Button
						onClick={onRemoveSupplier}
						color="white"
						bg="red.500"
						disabled={suppliers.length === 1}
						mx={2}
					>
						-
					</Button>
				</Box>
			</Flex>
			<Stack direction="row" spaceX={3} p={3}>
				{suppliers.map((field, index) => (
					<Input
						key={index}
						variant="subtle"
						bg="transparent"
						w="auto"
						onChange={(e) =>
							onSupplierChange(index, e.target.value)
						}
						value={field}
					/>
				))}
			</Stack>
		</Flex>
	);
};

export default SuppliersForm;
