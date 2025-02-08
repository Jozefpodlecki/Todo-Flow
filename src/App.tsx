import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"

function App() {
	const [isVisible, setVisible] = useState(false);

	useEffect(() => {

		const handle = setInterval(() => {
			console.log("flip", isVisible);
			setVisible(value => !value);
		}, 1000)

		return () => {
			clearInterval(handle);
		}

	}, []);

	return (
		<div className="h-full flex justify-center items-center">
			{/* <motion.div className="" animate={{ opacity: isVisible ? 1 : 0 }} /> */}
			<AnimatePresence initial={false}>
                {isVisible ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="w-[300px] h-[300px] bg-blue-900"
                        key="box"
                    />
                ) : null}
            </AnimatePresence>
		</div>
	)
}

export default App;