import React from "react";
import { Box, Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";

const ConsumersForm = ({
	consumers,
	onAddConsumer,
	onRemoveConsumer,
	onConsumerChange,
}) => {
	return (
		<Flex direction="column">
			<Flex justify="space-between" align="center" p={3}>
				<Heading>Консуматори:</Heading>
				<Box>
					<Button
						onClick={onAddConsumer}
						color="white"
						bg="blue.500"
						disabled={consumers.length === 10}
						mx={2}
					>
						+
					</Button>
					<Button
						onClick={onRemoveConsumer}
						color="white"
						bg="red.500"
						disabled={consumers.length === 1}
						mx={2}
					>
						-
					</Button>
				</Box>
			</Flex>
			<Stack direction="row" spaceX={3} p={3}>
				{consumers.map((c, index) => (
					<Input
						key={index}
						variant="subtle"
						bg="transparent"
						onChange={(e) =>
							onConsumerChange(index, e.target.value)
						}
						value={c}
						w="auto"
					/>
				))}
			</Stack>
		</Flex>
	);
};

export default ConsumersForm;
