import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApplication } from '../../slices/applicationSlice';
import { selectAuthUser } from '../../slices/authSlice';

const StudentApplicationForm = () => {
const user = useSelector(selectAuthUser)
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        jobId: '',
        resume: null,
        coverLetter: '',
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',

    });

    const handleChange =(e)=>{

        const {name ,value , files } = e.target;

        if(files){
            setForm((prev)=>(
                {prev,[name]:files[0]}
            ))
        }
        else{
            setForm((prev)=>({...prev,[name]:value}))
        }

    }

    const handleSubmit = (e) => {
        console.log(form)
        e.preventDefault()
        const formData = new FormData();

        Object.keys(form).forEach(key=>formData.append(key,form[key]))
        dispatch(createApplication(formData))
    }



    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
                <h2 className="text-lg font-bold mb-2">Apply for Job/Placement</h2>
                <input className="mb-2 p-2 w-full border" type="text" placeholder="Name" />
                <input className="mb-2 p-2 w-full border" type="email" placeholder='Email' />
                <input className="mb-2 p-2 w-full border" type="text" placeholder='Phone' />
                {/* <select name="jobId" value={form.jobId} onChange={handleChange} required className="mb-2 p-2 w-full border">
                    <option value="">Select Job/Drive</option>
                    {jobs.map((job) => (
                        <option value={job._id} key={job._id}>{job.title}</option>
                    ))}
                </select> */}
                <input type="text" placeholder='Resume' className="mb-2 p-2 w-full border" />

                <textarea name="coverLetter" id="" value={form.coverLetter} onChange={handleChange} placeholder='Cover Letter' className="mb-2 p-2 w-full border" rows={4}/>

                <button type='submit' className="bg-blue-500 text-white py-2 px-4 rounded" >
                    Submit Application
                </button>

            </form>
        </>
    )
}

export default StudentApplicationForm