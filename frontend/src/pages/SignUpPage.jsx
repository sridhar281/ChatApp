import React,{ useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, EyeOff ,Eye} from 'lucide-react';
import { User, Mail, Lock, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimationDisplay from "../components/AnimationDisplay";
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

  const{signup, isSigningUp} = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return toast.error('Full Name is required');
    } 
    if(!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error('Invalid email format');
    }
    if(!formData.email.trim()) {
      return toast.error('Please enter a valid email'); 
    }
    if (!formData.password.trim() || !formData.confirmPassword.trim()) {  
      return toast.error('Please fill in all fields');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {    
      return toast.error('Passwords do not match');
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isvalid = validateForm();
    if(isvalid===true){
      const success = await 
      signup(formData);
      return toast.success('Account created successfully');
      if (success) {
        navigate('/login'); // Redirect to login page after successful signup
      }
    }
    // e.preventDefault(); 
    // if (validateForm()) {
    //   await signup(formData);
    // } 
    // else {
    //   console.error('Form validation failed');
    // } 
  }

  return (
<div className='min-h-screen grid lg:grid-cols-2'>
  <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
    <div className="w-full max-w-md space-y-8">
      {/*LOGO*/}
   <div className="text-center mb-8">
     <div className="flex flex-col items-center gap-2 group">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transform-colors">
      <MessageSquare className="size-6 text-primary"></MessageSquare>
      </div>
      <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
      <p className="text-base-content/60">Get Started with your free account.</p>
     </div>
   </div>
   <form onSubmit={handleSubmit}  className="space-y-8" action="">
    {/* Full Name Input */}
    <div className="form-control">
  <label className="label">
    <span className="label-text font-medium">Full Name</span>
  </label>
  <div className="flex items-center border rounded input input-bordered px-3 gap-2 w-full">
    <User className="size-5 text-gray-500" />
    <input
      type="text"
      className="w-full outline-none bg-transparent pl-5"
      placeholder="Virat"
      value={formData.fullName}
      onChange={(e) =>
        setFormData({ ...formData, fullName: e.target.value })
      }
    />
  </div>
</div>
     {/* Email Input */}
    <div className="form-control">
      <label htmlFor="" className="label">
        <span className="label-text font-medium"> Email</span></label>
        <div className="flex items-center border rounded input input-bordered px-3 gap-2 w-full">
          <Mail className="size-5  text-gray-500"/>
        <input type="text"
        className={`w-full outline-none bg-transparent pl-5`}
        placeholder='virat@gmail.com'
        value={formData.email}
        onChange={(e)=>setFormData({...formData,email:e.target.value})} />
    </div>
</div>
    {/* Password Input */}
    <div className="form-control">
      <label htmlFor="" className="label">
        <span className="label-text font-medium">
          Password
        </span>
      </label>
        <div className="flex-items-center border rounded input input-bordered px-3 gap-2 w-full ">
          <Lock className="size-5 text-gray-500 bg-red"/>
        <input type={showPassword ? 'text' : 'password'}
        className={`w-full outline-none bg-transparent pl-5`}
        placeholder='********'
        value={formData.password}
        onChange={(e)=>setFormData({...formData, password:e.target.value})} />
        <button
          type="button"
          className='absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40'
          onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (<EyeOff className="size-5 text-base-content/40"/>):( <Eye className="size-5 text-base-content/40"/>)}
        </button>
      </div>
    </div>

    {/* Confirm Password Input */}
     <div className="form-control">
      <label htmlFor="" className="label">
        <span className="label-text font-medium">
         Confirm Password
        </span>
      </label>
        <div className="flex items-center border rounded input input-bordered px-3 gap-2 w-full">
          <LockKeyhole className="size-5 text-base-content/40 color:white"></LockKeyhole>
        <input type={showConfirmPassword ? 'text' : 'Password'}
        className={` w-full outline-none bg-transparent pl-5`}
        placeholder='********'
        value={formData.confirmPassword}
        onChange={(e)=>setFormData({...formData, confirmPassword:e.target.value})} />
        <button
          type="button"
          className='absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40'
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (<EyeOff className="size-5 text-base-content/40"/>):( <Eye className="size-5 text-base-content/40"/>)}
        </button>
      </div>
    </div>
 <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>
  {isSigningUp ? (<>
  <Loader2 className="size-5 animate-spin"/>Loading.... 
  </>
  ):("Create Account")}
 </button>
   </form>
  <div className="text-center">
  <p className="text-base-content/60">
    Already have an account?{" "}
    <Link to="/login" className="link link-primary">
      Sign in
    </Link>
  </p>
</div>
</div>
</div>
<div className="flex w-full h-screen gap-8">
        <AnimationDisplay />
</div>
</div>
// right side

  )
}

export default SignUpPage;
