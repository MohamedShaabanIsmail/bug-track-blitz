
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulated register logic (real app: call API)
    if (!inputs.email || !inputs.password || !inputs.name) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    // In actual app, create user here...
    await login(inputs.email, inputs.password);
    setLoading(false);
    navigate("/");
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
            name="email"
            type="email"
            placeholder="Email"
            value={inputs.email}
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
