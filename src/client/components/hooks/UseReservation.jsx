import { useState, useEffect } from 'react';

const useReservation = (mealId, success) => {
  const countReservations = (reservations) => {
    return reservations.reduce((sum, res) => (sum += res.number_of_guests), 0);
  };

  const reservationsUrl = `/api/reservations/${mealId}`;

  const [reservations, setReservations] = useState([]);
  const numberOfGuests = countReservations(reservations);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchReservations = async () => {
      try {
        const req = await fetch(reservationsUrl, { signal: abortCont.signal });
        const data = await req.json();

        setReservations(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReservations();

    return () => abortCont.abort();
  }, [success]);

  return numberOfGuests;
};

export default useReservation;
