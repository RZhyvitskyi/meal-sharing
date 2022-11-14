import React, { useState } from 'react';
import './ReservationForm.css';

const ReservationForm = ({ meal, numberOfGuests, success, setSuccess }) => {
  const [guests, setGuests] = useState(1);
  const [contactName, setContactName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const postReservation = async () => {
    setSuccess(false);
    const contactData = {
      number_of_guests: guests,
      meal_id: meal.id,
      contact_phonenumber: phone,
      contact_name: contactName,
      contact_email: email,
    };
    const reservationUrl = '/api/reservations';
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    };

    try {
      const req = await fetch(reservationUrl, settings);
      const data = await req.json();

      setGuests(1);
      setContactName(null);
      setEmail(null);
      setError(null);
      setErrorMessage(null);

      if (Array.isArray(data)) {
        setSuccess(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formHandler = (e) => {
    e.preventDefault();

    if (!error) {
      postReservation();
    }
  };

  const guestsHandler = (e) => {
    const targetNumber = e.target.value;
    const mealsLeft = meal.max_reservations - numberOfGuests;

    if (targetNumber > 0 && targetNumber <= mealsLeft) {
      setGuests(e.target.value);
      setError(false);
      setErrorMessage('');
    } else {
      setError(true);
      setErrorMessage('Incorrect number of guests');
    }
  };

  const nameHandler = (e) => {
    const targetName = e.target.value;

    if (targetName.length > 2 && targetName.length <= 50) {
      setContactName(e.target.value);
      setError(false);
      setErrorMessage('');
    } else {
      setError(true);
      setErrorMessage('Incorrect name');
    }
  };

  const emailHandler = (e) => {
    const targetEmail = e.target.value;

    if (
      targetEmail.length > 5 &&
      targetEmail.length <= 50 &&
      targetEmail.includes('@')
    ) {
      setEmail(e.target.value);
      setError(false);
      setErrorMessage('');
    } else {
      setError(true);
      setErrorMessage('Incorrect email');
    }
  };

  const phoneHandler = (e) => {
    const targetPhone = e.target.value;

    if (targetPhone.length > 5 && /^[0-9]+$/.test(targetPhone)) {
      setPhone(e.target.value);
      setError(false);
      setErrorMessage('');
    } else {
      setError(true);
      setErrorMessage('Incorrect phone number');
    }
  };

  return (
    <form className="reservation__form" onSubmit={formHandler}>
      <h3>Meal reservation</h3>
      {success ? (
        <p className="reservation__success">Reservation created</p>
      ) : (
        ''
      )}
      {error ? <p className="reservation__error">{errorMessage}</p> : ''}
      <div className="reservation__guests">
        <label htmlFor="guests">Guests number:</label>
        <input
          className={error ? 'validation__error' : ''}
          type="number"
          min="1"
          id="guests"
          defaultValue={guests}
          onBlur={guestsHandler}
        />
      </div>
      <div className="reservation__field">
        <label htmlFor="contact-name">Contact name:</label>
        <input
          className={error ? 'validation__error' : ''}
          type="text"
          id="contact-name"
          defaultValue={contactName}
          onBlur={nameHandler}
        />
      </div>
      <div className="reservation__field">
        <label htmlFor="email">Email:</label>
        <input
          className={error ? 'validation__error' : ''}
          type="email"
          id="email"
          defaultValue={email}
          onBlur={emailHandler}
        />
      </div>
      <div className="reservation__field">
        <label htmlFor="phone">Phone number:</label>
        <input
          className={error ? 'validation__error' : ''}
          type="phone"
          id="phone"
          defaultValue={phone}
          onBlur={phoneHandler}
        />
      </div>
      <button className="btn-primary" type="submit">
        Add reservation
      </button>
    </form>
  );
};

export default ReservationForm;
