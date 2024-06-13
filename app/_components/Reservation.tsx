import { getBookedDatesByCabinId, getSettings } from '../_lib/data-service';
import { TCabin } from '../_lib/data-service.types';
import DateSelector from './DateSelector';
import ReservationForm from './ReservationForm';

async function Reservation({ cabin }: { cabin: TCabin }) {
    const [settings, bookedDates] = await Promise.all([
        getSettings(),
        getBookedDatesByCabinId(cabin.id),
    ]);

    console.log(bookedDates);

    return (
        <div className="grid min-h-[400px] grid-cols-2 border border-primary-800">
            <DateSelector
                cabin={cabin}
                settings={settings}
                bookedDates={bookedDates}
            />
            <ReservationForm cabin={cabin} />
        </div>
    );
}

export default Reservation;
