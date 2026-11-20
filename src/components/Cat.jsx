import { useState } from 'react';
import { useSite } from '../context/SiteContext';

const SLEEPING = ' /\\_/\\\n( -.- ) z\n > ^ <';
const AWAKE = ' /\\_/\\\n( o.o )\n > ^ <';

/** The little ASCII cat on top of the terminal. Wakes on hover; petting it glitches the world. */
export default function Cat() {
  const [awake, setAwake] = useState(false);
  const { kick, toast } = useSite();

  const pet = () => {
    setAwake(true);
    kick(0.6);
    toast('the cat approves');
  };

  return (
    <div
      className={`cat ${awake ? 'awake' : ''}`}
      title="pet the cat"
      onMouseEnter={() => setAwake(true)}
      onMouseLeave={() => setAwake(false)}
      onClick={pet}
    >
      <span className="bub">mrrp.</span>
      <span>{awake ? AWAKE : SLEEPING}</span>
    </div>
  );
}
