
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Validation
    if (!inputs.username || !inputs.password || !inputs.name) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    
    try {
      // Call the backend registration API with the requested format
      const response = await fetch('http://localhost:8765/USERSERVICE/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: inputs.username,
          password: inputs.password,
          role: "ADMIN"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      
      // After successful registration, log the user in
      await login(inputs.username, inputs.password);
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-background rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <div>
          <Input
            name="name"
            type="text"
            placeholder="Full Name"
            value={inputs.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            value={inputs.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-destructive">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-primary font-semibold underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
