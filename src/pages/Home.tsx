import { Helmet } from "react-helmet-async";

export default function HomePage() {
  return (
    <div>
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <h1>Welcome to the Home Page</h1>
    </div>
  );
}
