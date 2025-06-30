// "use client";

// import ReactConfetti from 'react-confetti';
// import { useConfettiStore } from '@/hooks/useConfettiStore';

// export const ConfettiProvider = () => {
//     const confetti = useConfettiStore();
//     if (!confetti) return null;

//     return (
//         <ReactConfetti className='pointer-events-none z-[100]'
//             numberOfPieces={500}
//             recycle={false}
//             onConfettiComplete={() => {
//                 confetti.onClose();
//             }}
//         />
//     )
// }