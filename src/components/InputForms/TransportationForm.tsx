import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Separator } from "@chakra-ui/react";
import SuppliersForm from "./SuppliersForm";
import ConsumersForm from "./ConsumersForm";
import Supplies from "./Supplies";
import Demands from "./Demands";
import BalanceIndicator from "./BalanceIndicator";
import NorthWestCornerMethod from "../Solutions/NorthWestCornerMethod";
import PotentialsMethod from "../Solutions/PotentialsMethod";
import Costs from "./Costs";
import MinimalCostMethod from "../Solutions/MinimalCostMethod";

const TransportationForm = () => {
	const [suppliers, setSuppliers] = useState(["A"]);
	const [supplyQuantities, setSupplyQuantities] = useState([0]);
	const [consumers, setConsumers] = useState(["1"]);
	const [demandQuantities, setDemandQuantities] = useState([0]);
	const [northWestSolution, setNorthWestSolution] = useState<
		number[][] | null
	>(null);
	const [minimalCostSolution, setMinimalCostSolution] = useState<
		number[][] | null
	>(null);
	const [potentialsSolution, setPotentialsSolution] = useState<
		number[][] | null
	>(null);
	const [costs, setCosts] = useState([[0]]);
	const [exampleTaskLoaded, setExampleTaskLoaded] = useState(false);

	useEffect(() => {
		if (exampleTaskLoaded) return;

		const m = suppliers.length;
		const n = consumers.length;
		const newCosts = Array(m)
			.fill(null)
			.map(() => Array(n).fill(0));
		setCosts(newCosts);
	}, [suppliers, consumers, exampleTaskLoaded]);

	const loadExample = () => {
		setExampleTaskLoaded(true);
		setSuppliers(["A", "B", "C"]);
		setSupplyQuantities([4600, 3400, 3000]);
		setConsumers(["1", "2", "3", "4"]);
		setDemandQuantities([3500, 2000, 4500, 1000]);
		setCosts([
			[30, 40, 60, 10],
			[50, 10, 20, 30],
			[40, 50, 80, 10],
		]);
	};

	const clearAllData = () => {
		setSuppliers(["A"]);
		setSupplyQuantities([0]);
		setConsumers(["1"]);
		setDemandQuantities([0]);
		setNorthWestSolution(null);
		setMinimalCostSolution(null);
		setPotentialsSolution(null);
		setCosts([[0]]);
		setExampleTaskLoaded(false);
	};

	return (
		<Box minW={500} maxW={800} mx="auto" mt={10}>
			<Flex justify="space-between">
				<Button onClick={loadExample}>
					Зареди примерна задача от заданието
				</Button>
				<Button onClick={clearAllData}>Изчисти всички данни</Button>
			</Flex>
			<Separator size="md" mt={10} mb={10} />
			<Heading as="h2" size="2xl" m={2} textAlign="center">
				1. Товар:
			</Heading>
			<SuppliersForm
				suppliers={suppliers}
				onAddSupplier={() => {
					const nextLetter = String.fromCharCode(
						65 + suppliers.length
					);
					setSuppliers([...suppliers, nextLetter]);
					setSupplyQuantities([...supplyQuantities, 0]);
					setCosts([...costs, Array(consumers.length).fill(0)]);
				}}
				onRemoveSupplier={() => {
					if (suppliers.length > 1) {
						setSuppliers(suppliers.slice(0, -1));
						setSupplyQuantities(supplyQuantities.slice(0, -1));
						setCosts(costs.slice(0, -1));
					}
				}}
				onSupplierChange={(index, value) => {
					const newSuppliers = [...suppliers];
					newSuppliers[index] = value;
					setSuppliers(newSuppliers);
				}}
			/>
			<Supplies
				supplyQuantities={supplyQuantities}
				onSupplyChange={(index, value) => {
					const newSupplies = [...supplyQuantities];
					newSupplies[index] = value;
					setSupplyQuantities(newSupplies);
				}}
			/>
			<ConsumersForm
				consumers={consumers}
				onAddConsumer={() => {
					setConsumers([
						...consumers,
						(consumers.length + 1).toString(),
					]);
					setDemandQuantities([...demandQuantities, 0]);
					setCosts(costs.map((row) => [...row, 0]));
				}}
				onRemoveConsumer={() => {
					if (consumers.length > 1) {
						setConsumers(consumers.slice(0, -1));
						setDemandQuantities(demandQuantities.slice(0, -1));
						setCosts(costs.map((row) => row.slice(0, -1)));
					}
				}}
				onConsumerChange={(index, value) => {
					const newConsumers = [...consumers];
					newConsumers[index] = value;
					setConsumers(newConsumers);
				}}
			/>
			<Demands
				demandQuantities={demandQuantities}
				onDemandChange={(index, value) => {
					const newDemands = [...demandQuantities];
					newDemands[index] = value;
					setDemandQuantities(newDemands);
				}}
			/>
			{supplyQuantities[0] !== 0 && demandQuantities[0] !== 0 && (
				<BalanceIndicator
					supplyQuantities={supplyQuantities}
					demandQuantities={demandQuantities}
				/>
			)}
			<Separator size="md" mt={10} mb={10} />
			<Heading as="h2" size="2xl" m={2} textAlign="center">
				2. Транспортни разходи:
			</Heading>
			<Costs
				costs={costs}
				suppliers={suppliers}
				consumers={consumers}
				setCosts={setCosts}
			/>
			<Separator size="md" mt={10} mb={10} />
			<Heading as="h2" size="2xl" m={2} textAlign="center">
				3. Изчисления:
			</Heading>
			<NorthWestCornerMethod
				solution={northWestSolution}
				suppliers={suppliers}
				consumers={consumers}
				supplyQuantities={supplyQuantities}
				demandQuantities={demandQuantities}
				costs={costs}
				setSolution={setNorthWestSolution}
			/>
			<MinimalCostMethod
				solution={minimalCostSolution}
				suppliers={suppliers}
				consumers={consumers}
				supplyQuantities={supplyQuantities}
				demandQuantities={demandQuantities}
				costs={costs}
				setSolution={setMinimalCostSolution}
			/>
			<PotentialsMethod
				costs={costs}
				initialSolution={minimalCostSolution}
				suppliers={suppliers}
				consumers={consumers}
			/>
			<Separator size="md" mt={10} mb={10} />
		</Box>
	);
};

export default TransportationForm;
