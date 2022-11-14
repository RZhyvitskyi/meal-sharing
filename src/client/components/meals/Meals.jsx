import React, { useEffect, useState } from 'react';
import Meal from './meal/Meal';
import './Meals.css';

const meals_url = '/api/meals';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchMeals = async () => {
      try {
        setLoading(true);
        const req = await fetch(meals_url, { signal: abortCont.signal });
        const data = await req.json();

        setLoading(false);
        setMeals(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMeals();

    return () => abortCont.abort();
  }, []);

  return (
    <div className="container">
      <div className="meals__wrapper">
        {loading && <p>Loading...</p>}
        {meals.map((meal) => {
          return <Meal key={meal.id} meal={meal} />;
        })}
      </div>
    </div>
  );
};

export default Meals;
