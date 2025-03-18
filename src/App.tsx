import React from "react";
import { Provider } from "./components/ui/provider";
import TransportationForm from "./components/InputForms/TransportationForm";

function App() {
	return (
		<Provider>
			<TransportationForm />
		</Provider>
	);
}

export default App;
