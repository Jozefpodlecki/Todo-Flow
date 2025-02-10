import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { AppState, TaskState } from './models';
import { defaultAppState } from './utils';
import { simulation } from './simulation';
import { AlertCircle, CheckCircle2, CheckSquare, Loader2, PlusCircle, RotateCcw, Wrench, XCircle } from 'lucide-react';

const getTaskColor = (state: TaskState) => {
	switch (state) {
	  case TaskState.Created:
		return 'bg-green-400';
	  case TaskState.InProgress:
		return 'bg-orange-400';
	  case TaskState.InQA:
		return 'bg-purple-400';
	  case TaskState.FailedQA:
		return 'bg-red-400';
	  case TaskState.InTesting:
		return 'bg-blue-400';
	  case TaskState.FailedTesting:
		return 'bg-pink-400';
	  case TaskState.Completed:
		return 'bg-gray-400';
	  case TaskState.Reopened:
		return 'bg-yellow-400';
	  default:
		return 'bg-white';
	}
};

const getTaskIcon = (state: TaskState) => {
	switch (state) {
	  case TaskState.Created: return <PlusCircle />;
	  case TaskState.InProgress: return <Loader2 className="animate-spin" />;
	  case TaskState.InQA: return <CheckCircle2 />;
	  case TaskState.FailedQA: return <AlertCircle />;
	  case TaskState.InTesting: return <Wrench />;
	  case TaskState.FailedTesting: return <XCircle />;
	  case TaskState.Completed: return <CheckSquare />;
	  case TaskState.Reopened: return <RotateCcw />;
	  default: return null;
	}
  };

function App() {
	const [state, setState] = useState<AppState>(defaultAppState);

	useEffect(() => {

		const timeout = 1000;

		const onSimulation = () => {

			setState(state => simulation(state))

			setTimeout(onSimulation, timeout);
		}

		setTimeout(onSimulation, timeout);
	}, []);

	return (
		<div className="p-4 space-y-4">
		  <AnimatePresence initial={false}>
			{state.items.map(task => (
			  <motion.div
				data-state={task.state}
				key={task.id}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				transition={{ layout: { duration: 0.3 } }}
				layout
				className={`flex items-center w-[400px] p-4 rounded shadow ${getTaskColor(task.state)} transition-all`}
			  >
				{getTaskIcon(task.state)}
				<div className="ml-4">
					<h2 className="text-lg font-bold">{task.name}</h2>
					<p>{task.description}</p>
				</div>
				
			  </motion.div>
			))}
		  </AnimatePresence>
		</div>
	  );
}

export default App;