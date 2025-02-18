import React, { useState } from 'react';

function RegistrationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: 0,
        height: 0,
        location: '',
        dating_intentions: [],
        relationship_type: [],
        ethnicity: [],
        children: '',
        family_plans: '',
        covid_vaccine: false,
        pets: '',
        zodiac: '',
        work: '',
        job_title: '',
        school: '',
        education: '',
        religious_beliefs: '',
        hometown: '',
        politics: '',
        languages: [],
        drinking: '',
        smoking: false,
        weed: false,
        drugs: false
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("form submitted, step:", step);
        if (step === 1) {
            // Move to the next form section
            console.log("moving to next step");
            setStep(step + 1);
        } else {
            // Final submission handling here
            console.log(formData);
            // Navigate to a new page or display a completion message
        }
    };

    return (
        <div className="container mt-5">
            <h2>{step === 1 ? "Get Started" : "Tell Us More"}</h2>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="age" className="form-label">Age</label>
                            <input type="number" className="form-control" id="age" name="age" value={formData.age} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Next</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        {/* Add more input fields for each piece of extended information */}
                        <div className="mb-3">
                            <label htmlFor="height" className="form-label">Height</label>
                            <input type="number" className="form-control" id="height" name="height" value={formData.height} onChange={handleChange} />
                        </div>
                        {/* Repeat for other fields */}
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </>
                )}
            </form>
        </div>
    );
}

export default RegistrationForm;
