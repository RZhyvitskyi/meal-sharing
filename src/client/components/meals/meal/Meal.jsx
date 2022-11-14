import React from 'react';
import { Link } from 'react-router-dom';
import useReservation from '../../hooks/UseReservation';
import './Meal.css';

const Meal = ({ meal }) => {
  const numberOfGuests = useReservation(meal.id);
  const mealDate = new Date(meal.accessibility_time);
  const [hours, minutes] = [mealDate.getHours(), mealDate.getMinutes()];

  return (
    <div className="meal__wrapper">
      <Link to={`/meals/${meal.id}`}>
        <div className="meal__image">
          <img src={meal.image_url} alt="food" />
        </div>
        <div className="meal__info">
          <h3>{meal.title}</h3>
          <p>{meal.location}</p>
          <div>
            <p>{mealDate.toDateString()}</p>
            <p>
              {hours}:{minutes > 10 ? minutes : '0' + minutes}
            </p>
          </div>
          <p>
            <span>Reserved: </span>
            {numberOfGuests === 0 ? '-' : numberOfGuests}/
            {meal.max_reservations}
          </p>
          <p>
            <span>Price: </span>
            {meal.price}
          </p>
        </div>
        <div className="meal__reservation">
          {numberOfGuests === meal.max_reservations ? (
            <p className="meal__full">No reservations left</p>
          ) : (
            <p className="meal__not-full">
              {meal.max_reservations - numberOfGuests} reservations left
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Meal;
