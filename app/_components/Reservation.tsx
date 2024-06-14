import { auth } from '../_lib/auth';
import { getBookedDatesByCabinId, getSettings } from '../_lib/data-service';
import { TCabin } from '../_lib/data-service.types';
import DateSelector from './DateSelector';
import LoginMessage from './LoginMessage';
import ReservationForm from './ReservationForm';

async function Reservation({ cabin }: { cabin: TCabin }) {
    const [settings, bookedDates, session] = await Promise.all([
        getSettings(),
        getBookedDatesByCabinId(cabin.id),
        auth(),
    ]);

    return (
        <div className="grid min-h-[400px] grid-cols-2 border border-primary-800">
            <DateSelector
                cabin={cabin}
                settings={settings}
                bookedDates={bookedDates}
            />
            {session?.user ? (
                <ReservationForm cabin={cabin} user={session.user} />
            ) : (
                <LoginMessage />
            )}
        </div>
    );
}

export default Reservation;
